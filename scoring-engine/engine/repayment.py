"""
Feature engineering for repayment risk assessment.

Looks at how reliably someone has repaid past obligations —
on-time payments, defaults, delays, credit utilization, debt load.
"""

import numpy as np


# feature names in the order XGBoost expects them
REPAYMENT_FEATURES = [
    "repayment_ratio",
    "default_count",
    "credit_utilization",
    "debt_to_income",
    "delay_frequency",
]


def build_features(applicant: dict) -> dict:
    """
    Turn raw applicant data into repayment-risk features.

    Parameters
    ----------
    applicant : dict
        Raw applicant data. Keys used:
        - on_time_payments, total_payments
        - defaults
        - outstanding_debt, credit_limit
        - total_debt, monthly_income
        - delayed_payments

    Returns
    -------
    dict  with keys matching REPAYMENT_FEATURES
    """
    total_payments = applicant.get("total_payments", 0)
    on_time = applicant.get("on_time_payments", 0)

    # ratio of payments made on time (0-1, higher is better)
    if total_payments > 0:
        repayment_ratio = on_time / total_payments
    else:
        repayment_ratio = None  # will be imputed

    default_count = applicant.get("defaults", None)

    # how much of available credit is used (0-1, lower is better)
    credit_limit = applicant.get("credit_limit", 0)
    outstanding = applicant.get("outstanding_debt", 0)
    if credit_limit and credit_limit > 0:
        credit_utilization = outstanding / credit_limit
    else:
        credit_utilization = None

    # total debt relative to income (lower is better)
    monthly_income = applicant.get("monthly_income", 0)
    total_debt = applicant.get("total_debt", 0)
    if monthly_income and monthly_income > 0:
        debt_to_income = total_debt / monthly_income
    else:
        debt_to_income = None

    # fraction of payments that were late
    delayed = applicant.get("delayed_payments", 0)
    if total_payments > 0:
        delay_frequency = delayed / total_payments
    else:
        delay_frequency = None

    return {
        "repayment_ratio": repayment_ratio,
        "default_count": default_count,
        "credit_utilization": credit_utilization,
        "debt_to_income": debt_to_income,
        "delay_frequency": delay_frequency,
    }


def score_from_features(features: dict) -> float:
    """
    Quick heuristic score (0-100) from repayment features.
    Used as a standalone fallback when the XGBoost model is unavailable.
    """
    score = 50.0  # baseline

    ratio = features.get("repayment_ratio")
    if ratio is not None:
        score += (ratio - 0.5) * 40  # +20 for perfect, -20 for terrible

    defaults = features.get("default_count")
    if defaults is not None:
        score -= min(defaults * 8, 30)

    util = features.get("credit_utilization")
    if util is not None:
        if util < 0.3:
            score += 10
        elif util > 0.7:
            score -= 15

    dti = features.get("debt_to_income")
    if dti is not None:
        if dti < 0.3:
            score += 10
        elif dti > 0.6:
            score -= 15

    delay = features.get("delay_frequency")
    if delay is not None:
        score -= delay * 20

    return float(np.clip(score, 0, 100))
