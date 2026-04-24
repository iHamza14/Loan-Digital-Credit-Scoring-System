"""
Composite scoring — combines repayment + income engines through
the XGBoost model, maps to 300-900 credit score, assigns risk bands.
"""

import os
import numpy as np
import xgboost as xgb

from engine.repayment import REPAYMENT_FEATURES, build_features as build_repayment
from engine.income import INCOME_FEATURES, build_features as build_income
from engine.imputation import impute, ALL_FEATURES

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "model", "xgb_model.json")

# risk band thresholds (on the 300-900 scale)
RISK_BANDS = [
    {"min": 750, "max": 900, "label": "Low Risk - High Need",    "action": "auto_approved"},
    {"min": 650, "max": 749, "label": "Medium Risk - High Need",  "action": "manual_review"},
    {"min": 500, "max": 649, "label": "High Risk - High Need",    "action": "referred"},
    {"min": 300, "max": 499, "label": "Very High Risk",           "action": "rejected"},
]


def _load_model():
    """Load the trained XGBoost model from disk."""
    if not os.path.exists(MODEL_PATH):
        return None
    model = xgb.XGBClassifier()
    model.load_model(MODEL_PATH)
    return model


def _map_to_credit_score(probability: float) -> int:
    """
    Map the model's "probability of being a good borrower" (0-1)
    to a credit score on the 300-900 scale.
    """
    return int(300 + probability * 600)


def _get_risk_band(score: int) -> dict:
    """Find the risk band for a given credit score."""
    for band in RISK_BANDS:
        if band["min"] <= score <= band["max"]:
            return band
    return RISK_BANDS[-1]  # default to highest risk


def _generate_improvements(features: dict, imputed_fields: list) -> list:
    """Suggest concrete steps the applicant can take to improve their score."""
    tips = []

    if features.get("repayment_ratio", 1) < 0.85:
        tips.append("Maintain consistent on-time repayments to boost your repayment score.")

    if features.get("default_count", 0) > 0:
        tips.append("Clear any pending defaults — even one default significantly impacts your score.")

    if features.get("credit_utilization", 0) > 0.5:
        tips.append("Try to keep credit utilization below 50% of your limit.")

    if features.get("debt_to_income", 0) > 0.4:
        tips.append("Reduce outstanding debt relative to your income for a better risk profile.")

    if features.get("income_consistency", 1) < 0.6:
        tips.append("Stabilise your monthly income — consistent earnings signal lower risk.")

    if features.get("business_longevity", 0) < 0.3:
        tips.append("Business longevity improves with time — keep operating and building history.")

    if features.get("utility_regularity", 0) < 0.5:
        tips.append("Upload recent utility bills to improve your alternative data score.")

    if "electricity_bill_avg" in imputed_fields or "mobile_recharge_avg" in imputed_fields:
        tips.append("Provide electricity and mobile recharge data for a more accurate score.")

    if len(imputed_fields) > 3:
        tips.append("Complete your profile — more data means a more accurate (and likely higher) score.")

    return tips[:5]  # cap at 5 suggestions


def compute_score(applicant: dict, reference_data=None) -> dict:
    """
    Run the full scoring pipeline for one applicant.

    1. Build features from both engines
    2. Impute missing values
    3. Run through XGBoost (or heuristic fallback)
    4. Map to 300-900 score
    5. Assign risk band
    6. Generate improvement tips

    Returns a dict with everything the API needs.
    """
    # step 1: feature engineering
    repayment_feats = build_repayment(applicant)
    income_feats = build_income(applicant)
    all_feats = {**repayment_feats, **income_feats}

    # step 2: impute missing values
    filled_feats, imputed_fields, completeness = impute(all_feats, reference_data)

    # step 3: run through model
    model = _load_model()
    feature_row = np.array([[filled_feats[f] for f in ALL_FEATURES]])

    if model is not None:
        # adaptive weighting: use model prediction
        probas = model.predict_proba(feature_row)
        # probability of class 1 (good borrower)
        good_prob = float(probas[0][1]) if probas.shape[1] > 1 else float(probas[0][0])
    else:
        # fallback heuristic
        from engine.repayment import score_from_features as rep_score
        from engine.income import score_from_features as inc_score

        rep = rep_score(filled_feats) / 100
        inc = inc_score(filled_feats) / 100

        # adaptive weights based on data completeness
        rep_fields_present = sum(1 for f in REPAYMENT_FEATURES if f not in imputed_fields)
        inc_fields_present = sum(1 for f in INCOME_FEATURES if f not in imputed_fields)
        total_present = rep_fields_present + inc_fields_present

        if total_present > 0:
            rep_weight = rep_fields_present / total_present
            inc_weight = inc_fields_present / total_present
        else:
            rep_weight, inc_weight = 0.6, 0.4

        good_prob = rep * rep_weight + inc * inc_weight

    # step 4: map to credit score
    credit_score = _map_to_credit_score(good_prob)

    # step 5: risk band
    band = _get_risk_band(credit_score)

    # build per-factor breakdown
    factors = []
    for name in ALL_FEATURES:
        val = filled_feats[name]
        was_imputed = name in imputed_fields

        # determine impact direction
        if name in ("default_count", "credit_utilization", "debt_to_income",
                     "delay_frequency", "expense_to_income"):
            # for these, lower is better
            if val < 0.3:
                impact = "positive"
            elif val > 0.6:
                impact = "negative"
            else:
                impact = "neutral"
            display_score = max(0, 100 - int(val * 100))
        else:
            # for these, higher is better
            if val > 0.7:
                impact = "positive"
            elif val < 0.4:
                impact = "negative"
            else:
                impact = "neutral"
            display_score = int(val * 100)

        factors.append({
            "name": _pretty_name(name),
            "key": name,
            "score": display_score,
            "impact": impact,
            "imputed": was_imputed,
        })

    # step 6: improvements
    improvements = _generate_improvements(filled_feats, imputed_fields)

    return {
        "compositeScore": credit_score,
        "repaymentScore": int(good_prob * 100),  # simplified
        "incomeScore": int(good_prob * 100),
        "riskBand": band["label"],
        "suggestedAction": band["action"],
        "dataCompleteness": round(completeness * 100, 1),
        "factors": factors,
        "imputedFields": imputed_fields,
        "improvements": improvements,
        "rawProbability": round(good_prob, 4),
    }


# friendly names for display
_PRETTY = {
    "repayment_ratio": "Repayment History",
    "default_count": "Past Defaults",
    "credit_utilization": "Credit Utilization",
    "debt_to_income": "Debt-to-Income Ratio",
    "delay_frequency": "Payment Delays",
    "income_amount": "Income Level",
    "income_consistency": "Income Consistency",
    "business_longevity": "Business Longevity",
    "utility_regularity": "Utility Payment Regularity",
    "expense_to_income": "Expense-to-Income Ratio",
}


def _pretty_name(key: str) -> str:
    return _PRETTY.get(key, key.replace("_", " ").title())
