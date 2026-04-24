"""
Generate a synthetic training dataset and train the XGBoost model.

Run this once to produce xgb_model.json:
    cd scoring-engine
    python -m model.train
"""

import os
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report


DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
MODEL_DIR = os.path.dirname(__file__)
DATASET_PATH = os.path.join(DATA_DIR, "sample_dataset.csv")
MODEL_PATH = os.path.join(MODEL_DIR, "xgb_model.json")

# these match ALL_FEATURES in imputation.py
FEATURE_COLS = [
    "repayment_ratio",
    "default_count",
    "credit_utilization",
    "debt_to_income",
    "delay_frequency",
    "income_amount",
    "income_consistency",
    "business_longevity",
    "utility_regularity",
    "expense_to_income",
]


def generate_dataset(n=1000, seed=42):
    """
    Create a realistic-ish synthetic dataset.
    Target: is_good_borrower (1 = repays on time, 0 = defaults)
    """
    rng = np.random.RandomState(seed)

    data = {}

    # repayment features
    data["repayment_ratio"] = rng.beta(5, 1.5, n)          # skewed high (most people pay on time)
    data["default_count"] = rng.poisson(0.3, n) / 5         # normalised, mostly 0
    data["credit_utilization"] = rng.beta(2, 3, n)          # moderate usage
    data["debt_to_income"] = rng.beta(2, 4, n)              # mostly low
    data["delay_frequency"] = rng.beta(1.5, 6, n)           # mostly low

    # income features
    data["income_amount"] = rng.beta(2, 3, n)               # normalised 0-1
    data["income_consistency"] = rng.beta(4, 2, n)          # mostly stable
    data["business_longevity"] = rng.beta(2, 3, n)
    data["utility_regularity"] = rng.beta(3, 2, n)          # mostly regular
    data["expense_to_income"] = rng.beta(3, 3, n)           # centered around 0.5

    df = pd.DataFrame(data)

    # create target with a realistic relationship
    # good borrowers: high repayment, low defaults, stable income
    signal = (
        df["repayment_ratio"] * 3.0
        - df["default_count"] * 4.0
        - df["credit_utilization"] * 1.5
        - df["debt_to_income"] * 2.0
        - df["delay_frequency"] * 2.5
        + df["income_amount"] * 1.5
        + df["income_consistency"] * 1.0
        + df["business_longevity"] * 0.8
        + df["utility_regularity"] * 0.5
        - df["expense_to_income"] * 1.0
    )

    # add noise and convert to binary
    noise = rng.normal(0, 0.3, n)
    prob = 1 / (1 + np.exp(-(signal + noise)))
    df["is_good_borrower"] = (prob > 0.5).astype(int)

    # sprinkle in some missing values (~10% random NaN) to make it realistic
    mask = rng.random((n, len(FEATURE_COLS))) < 0.10
    for i, col in enumerate(FEATURE_COLS):
        df.loc[mask[:, i], col] = np.nan

    return df


def train():
    """Train XGBoost and save the model."""
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(MODEL_DIR, exist_ok=True)

    print("Generating synthetic dataset...")
    df = generate_dataset(n=1000)
    df.to_csv(DATASET_PATH, index=False)
    print(f"Saved {len(df)} rows to {DATASET_PATH}")

    # fill NaN for training (simple median fill — the real imputation
    # happens at inference time with KNN)
    df_filled = df.copy()
    for col in FEATURE_COLS:
        df_filled[col] = df_filled[col].fillna(df_filled[col].median())

    X = df_filled[FEATURE_COLS].values
    y = df_filled["is_good_borrower"].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("\nTraining XGBoost...")
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        eval_metric="logloss",
        use_label_encoder=False,
    )
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

    # metrics
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    print(f"\nAccuracy:  {accuracy_score(y_test, y_pred):.4f}")
    print(f"AUC-ROC:   {roc_auc_score(y_test, y_proba):.4f}")
    print(f"\n{classification_report(y_test, y_pred)}")

    # feature importance
    print("Feature Importance:")
    importances = model.feature_importances_
    for name, imp in sorted(zip(FEATURE_COLS, importances), key=lambda x: -x[1]):
        bar = "█" * int(imp * 50)
        print(f"  {name:25s} {imp:.4f}  {bar}")

    # save
    model.save_model(MODEL_PATH)
    print(f"\nModel saved to {MODEL_PATH}")

    return model


if __name__ == "__main__":
    train()
