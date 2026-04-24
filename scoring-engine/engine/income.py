"""
Feature engineering for income stability assessment.

Looks at how stable and sufficient someone's income is —
monthly earnings, business longevity, consistency of utility payments
(alternative data), and expense-to-income ratio.
"""

import numpy as np


INCOME_FEATURES = [
    "income_amount",
    "income_consistency",
    "business_longevity",
    "utility_regularity",
    "expense_to_income",
]


def build_features(applicant: dict) -> dict:
    """
    Turn raw applicant data into income-stability features.

    Parameters
    ----------
    applicant : dict
        Raw applicant data. Keys used:
        - monthly_income
        - income_history (list of monthly amounts, optional)
        - business_months
        - electricity_bill_avg, mobile_recharge_avg
        - monthly_expenses

    Returns
    -------
    dict  with keys matching INCOME_FEATURES
    """
    monthly_income = applicant.get("monthly_income", None)

    # normalise income to a 0-1 scale (cap at 2L/month)
    if monthly_income is not None and monthly_income > 0:
        income_amount = min(monthly_income / 200000, 1.0)
    else:
        income_amount = None

    # income consistency — coefficient of variation of past income
    # lower CV = more consistent = better
    history = applicant.get("income_history", [])
    if len(history) >= 3:
        mean_inc = np.mean(history)
        if mean_inc > 0:
            cv = np.std(history) / mean_inc
            income_consistency = max(1.0 - cv, 0.0)  # flip so higher = better
        else:
            income_consistency = None
    else:
        income_consistency = None

    # how long the business has been running (cap at 120 months = 10 years)
    biz_months = applicant.get("business_months", None)
    if biz_months is not None:
        business_longevity = min(biz_months / 120, 1.0)
    else:
        business_longevity = None

    # regularity of utility payments — proxy for income stability
    elec = applicant.get("electricity_bill_avg", None)
    mobile = applicant.get("mobile_recharge_avg", None)
    if elec is not None and mobile is not None:
        # both being non-zero and consistent signals stability
        combined = (min(elec / 5000, 1.0) + min(mobile / 1000, 1.0)) / 2
        utility_regularity = combined
    elif elec is not None:
        utility_regularity = min(elec / 5000, 1.0)
    elif mobile is not None:
        utility_regularity = min(mobile / 1000, 1.0)
    else:
        utility_regularity = None

    # expense to income ratio (lower is better for lending)
    expenses = applicant.get("monthly_expenses", None)
    if expenses is not None and monthly_income and monthly_income > 0:
        expense_to_income = expenses / monthly_income
    else:
        expense_to_income = None

    return {
        "income_amount": income_amount,
        "income_consistency": income_consistency,
        "business_longevity": business_longevity,
        "utility_regularity": utility_regularity,
        "expense_to_income": expense_to_income,
    }


def score_from_features(features: dict) -> float:
    """
    Quick heuristic score (0-100) from income features.
    Used as a standalone fallback when the XGBoost model is unavailable.
    """
    score = 50.0

    inc = features.get("income_amount")
    if inc is not None:
        score += inc * 20

    consistency = features.get("income_consistency")
    if consistency is not None:
        score += (consistency - 0.5) * 20

    longevity = features.get("business_longevity")
    if longevity is not None:
        score += longevity * 15

    utility = features.get("utility_regularity")
    if utility is not None:
        score += (utility - 0.5) * 10

    etr = features.get("expense_to_income")
    if etr is not None:
        if etr < 0.4:
            score += 10
        elif etr > 0.8:
            score -= 15

    return float(np.clip(score, 0, 100))
