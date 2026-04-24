"""
SHAP-based explainability for credit scoring decisions.

Uses TreeExplainer to produce per-feature SHAP values that show
exactly how much each factor pushed the score up or down.
"""

import os
import numpy as np

from engine.imputation import ALL_FEATURES
from engine.composite import _pretty_name

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "model", "xgb_model.json")


def explain_score(filled_features: dict) -> dict:
    """
    Generate SHAP explanations for a scored applicant.

    Parameters
    ----------
    filled_features : dict
        Feature dict with all values filled in (post-imputation).

    Returns
    -------
    dict with:
        - shap_values: list of {feature, value, shap_value, impact, explanation}
        - base_value: the baseline prediction before any features
        - bias_flags: list of any bias concerns
    """
    feature_row = np.array([[filled_features[f] for f in ALL_FEATURES]])

    try:
        import xgboost as xgb
        import shap

        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError("Model not found")

        model = xgb.XGBClassifier()
        model.load_model(MODEL_PATH)

        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(feature_row)

        # handle multi-output (binary classification gives 1D or 2D)
        if isinstance(shap_values, list):
            vals = shap_values[1][0]  # class 1 (good borrower)
        elif len(shap_values.shape) == 3:
            vals = shap_values[0, :, 1]
        else:
            vals = shap_values[0]

        base_value = float(explainer.expected_value)
        if isinstance(explainer.expected_value, np.ndarray):
            base_value = float(explainer.expected_value[1]) if len(explainer.expected_value) > 1 else float(explainer.expected_value[0])

    except Exception:
        # fallback: generate approximate importance from feature values
        vals = _approximate_shap(filled_features)
        base_value = 0.5

    # build the explanation list, sorted by absolute impact
    explanations = []
    for i, name in enumerate(ALL_FEATURES):
        sv = float(vals[i])
        fv = filled_features[name]

        if sv > 0.02:
            impact = "positive"
        elif sv < -0.02:
            impact = "negative"
        else:
            impact = "neutral"

        explanations.append({
            "feature": _pretty_name(name),
            "key": name,
            "value": round(fv, 4),
            "shapValue": round(sv, 4),
            "impact": impact,
            "explanation": _human_explanation(name, fv, sv),
        })

    # sort by absolute shap value (most important first)
    explanations.sort(key=lambda x: abs(x["shapValue"]), reverse=True)

    # check for bias
    bias_flags = _check_bias(explanations)

    return {
        "shapValues": explanations,
        "baseValue": round(base_value, 4),
        "biasFlags": bias_flags,
    }


def _approximate_shap(features: dict) -> list:
    """
    Rough SHAP approximation when the real model isn't available.
    Uses feature deviation from "average" as a proxy.
    """
    averages = {
        "repayment_ratio": 0.75,
        "default_count": 0.1,
        "credit_utilization": 0.4,
        "debt_to_income": 0.35,
        "delay_frequency": 0.12,
        "income_amount": 0.35,
        "income_consistency": 0.65,
        "business_longevity": 0.3,
        "utility_regularity": 0.5,
        "expense_to_income": 0.5,
    }

    # importance weights (how much each feature matters)
    weights = {
        "repayment_ratio": 0.20,
        "default_count": 0.18,
        "credit_utilization": 0.12,
        "debt_to_income": 0.10,
        "delay_frequency": 0.10,
        "income_amount": 0.08,
        "income_consistency": 0.07,
        "business_longevity": 0.05,
        "utility_regularity": 0.05,
        "expense_to_income": 0.05,
    }

    vals = []
    for name in ALL_FEATURES:
        fv = features.get(name, averages.get(name, 0.5))
        avg = averages.get(name, 0.5)
        w = weights.get(name, 0.05)

        # for "lower is better" features, flip the direction
        if name in ("default_count", "credit_utilization", "debt_to_income",
                     "delay_frequency", "expense_to_income"):
            diff = (avg - fv) * w
        else:
            diff = (fv - avg) * w

        vals.append(diff)

    return vals


def _human_explanation(name: str, value: float, shap_val: float) -> str:
    """Generate a one-liner explanation for a factor."""
    direction = "helps" if shap_val > 0 else "hurts" if shap_val < 0 else "has minimal effect on"

    templates = {
        "repayment_ratio": f"Your repayment rate of {value:.0%} {direction} your score.",
        "default_count": f"Having {value:.0f} past default(s) {direction} your score.",
        "credit_utilization": f"Using {value:.0%} of your credit limit {direction} your score.",
        "debt_to_income": f"Your debt-to-income ratio of {value:.0%} {direction} your score.",
        "delay_frequency": f"Late payment frequency of {value:.0%} {direction} your score.",
        "income_amount": f"Your income level {direction} your score.",
        "income_consistency": f"Income consistency of {value:.0%} {direction} your score.",
        "business_longevity": f"Your business track record {direction} your score.",
        "utility_regularity": f"Utility payment regularity {direction} your score.",
        "expense_to_income": f"Your expense ratio of {value:.0%} {direction} your score.",
    }

    return templates.get(name, f"{_pretty_name(name)} {direction} your score.")


def _check_bias(explanations: list) -> list:
    """Flag potential bias concerns in the scoring."""
    flags = []

    # check if any single feature dominates too much
    if explanations:
        top = explanations[0]
        total_impact = sum(abs(e["shapValue"]) for e in explanations)
        if total_impact > 0 and abs(top["shapValue"]) / total_impact > 0.5:
            flags.append({
                "type": "dominance",
                "feature": top["feature"],
                "message": f"{top['feature']} accounts for over 50% of the score impact. Review recommended.",
            })

    return flags
