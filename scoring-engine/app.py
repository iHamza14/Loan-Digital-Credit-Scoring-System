"""
FastAPI scoring microservice.

Exposes the XGBoost + SHAP scoring engine over HTTP so the
Node.js backend can call it.

Endpoints:
    POST /score    — score an applicant, returns composite score + breakdown
    POST /explain  — detailed SHAP explanation for an applicant
    GET  /health   — healthcheck
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import numpy as np
import os

from engine.composite import compute_score
from engine.repayment import build_features as build_repayment
from engine.income import build_features as build_income
from engine.imputation import impute
from engine.explain import explain_score

app = FastAPI(title="LoanSewa Scoring Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── request / response models ──────────────────────────────────

class ApplicantData(BaseModel):
    """Everything we know about an applicant. All fields optional
    because imputation handles the gaps."""

    # repayment related
    on_time_payments: Optional[int] = None
    total_payments: Optional[int] = None
    defaults: Optional[int] = None
    outstanding_debt: Optional[float] = None
    credit_limit: Optional[float] = None
    total_debt: Optional[float] = None
    delayed_payments: Optional[int] = None

    # income related
    monthly_income: Optional[float] = None
    income_history: Optional[list[float]] = None
    business_months: Optional[int] = None
    electricity_bill_avg: Optional[float] = None
    mobile_recharge_avg: Optional[float] = None
    monthly_expenses: Optional[float] = None

    # meta
    age: Optional[int] = None
    loan_amount: Optional[float] = None


class ScoreResponse(BaseModel):
    compositeScore: int
    repaymentScore: int
    incomeScore: int
    riskBand: str
    suggestedAction: str
    dataCompleteness: float
    factors: list
    imputedFields: list
    improvements: list
    rawProbability: float


class ExplainResponse(BaseModel):
    shapValues: list
    baseValue: float
    biasFlags: list


# ── endpoints ──────────────────────────────────────────────────

@app.get("/health")
def health():
    model_exists = os.path.exists(
        os.path.join(os.path.dirname(__file__), "model", "xgb_model.json")
    )
    return {
        "status": "healthy",
        "modelLoaded": model_exists,
    }


@app.post("/score", response_model=ScoreResponse)
def score_applicant(data: ApplicantData):
    """Score a single applicant and return the full breakdown."""
    try:
        applicant = data.model_dump()
        result = compute_score(applicant)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scoring failed: {str(e)}")


@app.post("/explain", response_model=ExplainResponse)
def explain_applicant(data: ApplicantData):
    """Return detailed SHAP explanation for an applicant."""
    try:
        applicant = data.model_dump()

        # build + impute features first
        repayment_feats = build_repayment(applicant)
        income_feats = build_income(applicant)
        all_feats = {**repayment_feats, **income_feats}
        filled_feats, _, _ = impute(all_feats)

        result = explain_score(filled_feats)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
