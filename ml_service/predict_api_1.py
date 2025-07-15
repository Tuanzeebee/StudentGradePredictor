"""FastAPI endpoints for ML prediction and reverse‑engineering study features.

Endpoints
---------
* **/predict**  – Predicts `raw_score` from study‑behaviour features using **mlp_final_pipeline.joblib**.
* **/reverse** – Infers **only** `weekly_study_hours` (no longer attendance) from a known `raw_score` via **mlp_final_pipeline_reverse.joblib**.

Both endpoints:
* Validate input with Pydantic.
* Auto‑generate required interaction columns exactly as the training pipelines expect.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# ────────────────────────────────────────────────────────────────────────────────
# CORS (adjust allow_origins for production)
# ────────────────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ────────────────────────────────────────────────────────────────────────────────
# Load ML models (ensure paths are correct)
# ────────────────────────────────────────────────────────────────────────────────
reverse_model = joblib.load("model_reverse/mlp_final_pipeline_reverse.joblib")
score_model   = joblib.load("mlp_final_pipeline.joblib")

# ────────────────────────────────────────────────────────────────────────────────
# Pydantic request schemas
# ────────────────────────────────────────────────────────────────────────────────
class ReverseRequest(BaseModel):
    semester_number: int
    course_code: str
    study_format: str
    credits_unit: int
    raw_score: float
    attendance_percentage: float
    part_time_hours: float
    family_support: int

class PredictRequest(BaseModel):
    semester_number: int
    course_code: str
    study_format: str
    credits_unit: int
    weekly_study_hours: float
    attendance_percentage: float
    part_time_hours: float
    family_support: int

# ────────────────────────────────────────────────────────────────────────────────
# /reverse – infer weekly_study_hours from raw_score (attendance is NOT predicted)
# ────────────────────────────────────────────────────────────────────────────────
@app.post("/reverse")
def reverse_predict(data: ReverseRequest):
    """Return only **weekly_study_hours** derived from a known raw_score."""

    # Interaction columns expected by the reverse pipeline
    family_support_x_part_time_hours = data.family_support * data.part_time_hours
    attendance_x_support            = (data.attendance_percentage / 100) * data.family_support

    input_df = pd.DataFrame([
        {
            "semester_number": data.semester_number,
            "course_code": data.course_code,
            "study_format": data.study_format,
            "credits_unit": data.credits_unit,
            "raw_score": data.raw_score,
            "attendance_percentage": data.attendance_percentage,
            "part_time_hours": data.part_time_hours,
            "family_support": data.family_support,
            "family_support_x_part_time_hours": family_support_x_part_time_hours,
            "attendance_x_support": attendance_x_support,
        }
    ])

    # Model now returns a single column (weekly_study_hours)
    predicted_weekly_hours = float(reverse_model.predict(input_df)[0])

    return {
        "mode": "reverse_prediction",
        "predicted_weekly_study_hours": predicted_weekly_hours,
    }

# ────────────────────────────────────────────────────────────────────────────────
# /predict – predict raw_score from study features
# ────────────────────────────────────────────────────────────────────────────────
@app.post("/predict")
def predict_score(data: PredictRequest):
    study_hours_x_attendance           = data.weekly_study_hours * (data.attendance_percentage / 100)
    study_hours_x_part_part_time_hours = data.weekly_study_hours * data.part_time_hours
    family_support_x_part_time_hours   = data.family_support * data.part_time_hours
    attendance_x_support               = (data.attendance_percentage / 100) * data.family_support
    full_interaction_feature           = (
        data.weekly_study_hours
        * (data.attendance_percentage / 100)
        * data.part_time_hours
        * data.family_support
    )

    df = pd.DataFrame([
        {
            "semester_number": data.semester_number,
            "course_code": data.course_code,
            "study_format": data.study_format,
            "credits_unit": data.credits_unit,
            "weekly_study_hours": data.weekly_study_hours,
            "attendance_percentage": data.attendance_percentage,
            "part_time_hours": data.part_time_hours,
            "family_support": data.family_support,
            "study_hours_x_attendance": study_hours_x_attendance,
            "study_hours_x_part_part_time_hours": study_hours_x_part_part_time_hours,
            "family_support_x_part_time_hours": family_support_x_part_time_hours,
            "attendance_x_support": attendance_x_support,
            "full_interaction_feature": full_interaction_feature,
        }
    ])

    if hasattr(score_model, "feature_names_in_"):
        expected_cols = list(score_model.feature_names_in_)
        for col in expected_cols:
            if col not in df.columns:
                df[col] = 0
        df = df[expected_cols]

    predicted_score = float(score_model.predict(df)[0])

    return {
        "mode": "raw_score_prediction",
        "predicted_score": predicted_score,
    }
