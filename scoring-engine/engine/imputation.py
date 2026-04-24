"""
Model-based imputation for incomplete applicant data.

When an applicant hasn't provided certain fields (e.g. no utility bills,
no income history), we estimate the missing values using KNN imputation
on the existing dataset. This is way better than just dropping the field
or using a global average.
"""

import numpy as np
from sklearn.impute import KNNImputer

from engine.repayment import REPAYMENT_FEATURES
from engine.income import INCOME_FEATURES

ALL_FEATURES = REPAYMENT_FEATURES + INCOME_FEATURES


def _features_to_row(features: dict) -> list:
    """Convert a feature dict to a flat row in the canonical order."""
    return [features.get(f, np.nan) for f in ALL_FEATURES]


def _row_to_features(row: list) -> dict:
    """Convert a flat row back to a feature dict."""
    return {name: float(val) for name, val in zip(ALL_FEATURES, row)}


def impute(features: dict, reference_data: np.ndarray = None) -> tuple[dict, list, float]:
    """
    Fill in missing feature values using KNN imputation.

    Parameters
    ----------
    features : dict
        Feature dict with possible None values.
    reference_data : np.ndarray, optional
        Matrix of past applicant feature rows for the KNN to learn from.
        If None, falls back to simple median fill.

    Returns
    -------
    (imputed_features, imputed_fields, data_completeness)
        - imputed_features: dict with all Nones replaced
        - imputed_fields: list of field names that were filled in
        - data_completeness: float 0-1 showing how much data was originally present
    """
    row = _features_to_row(features)
    total = len(row)
    missing_mask = [i for i, v in enumerate(row) if v is None or np.isnan(v)]
    present_count = total - len(missing_mask)
    data_completeness = present_count / total if total > 0 else 0.0

    imputed_fields = [ALL_FEATURES[i] for i in missing_mask]

    if not missing_mask:
        # nothing to impute
        return features, [], data_completeness

    row_array = np.array([[np.nan if v is None else v for v in row]])

    if reference_data is not None and len(reference_data) >= 5:
        # stack our row onto the reference data and impute together
        combined = np.vstack([reference_data, row_array])
        imputer = KNNImputer(n_neighbors=min(5, len(reference_data)))
        imputed = imputer.fit_transform(combined)
        filled_row = imputed[-1]  # our row is the last one
    else:
        # fallback: fill with sensible defaults
        defaults = {
            "repayment_ratio": 0.7,
            "default_count": 0.0,
            "credit_utilization": 0.4,
            "debt_to_income": 0.35,
            "delay_frequency": 0.15,
            "income_amount": 0.3,
            "income_consistency": 0.6,
            "business_longevity": 0.25,
            "utility_regularity": 0.5,
            "expense_to_income": 0.55,
        }
        filled_row = []
        for i, name in enumerate(ALL_FEATURES):
            val = row[i]
            if val is None or np.isnan(val):
                filled_row.append(defaults.get(name, 0.5))
            else:
                filled_row.append(val)
        filled_row = np.array(filled_row)

    imputed_features = _row_to_features(filled_row)
    return imputed_features, imputed_fields, data_completeness
