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
# Thêm import cho PyTorch
import torch
from torch import nn

# Load preprocessor và model PyTorch
preprocessor = joblib.load("preprocessor.joblib")

# Dummy input hợp lệ để lấy input_dim
dummy_input = pd.DataFrame([{
    "semester_number": 1,
    "course_code": "MATH101",
    "study_format": "LEC",
    "credits_unit": 3,
    "weekly_study_hours": 5.0,
    "attendance_percentage": 90.0,
    "part_time_hours": 10.0,
    "family_support": 2,
    "study_hours_x_attendance": 4.5,
    "study_hours_x_part_part_time_hours": 50.0,
    "family_support_x_part_time_hours": 20.0,
    "attendance_x_support": 1.8,
    "full_interaction_feature": 45.0
}])
input_dim = preprocessor.transform(dummy_input).shape[1]

# Định nghĩa lại model khớp với best_mlp_model.pt
class MLPFull(nn.Module):
    def __init__(self, input_dim):
        super().__init__()
        self.model = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(64, 1)
        )
    def forward(self, x):
        return self.model(x)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = MLPFull(input_dim)
model.load_state_dict(torch.load("best_mlp_model.pt", map_location=device))
model.to(device)
model.eval()


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

    df = pd.DataFrame([{
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
    }])

    # Tiền xử lý
    df_processed = preprocessor.transform(df)

    # Nếu là sparse matrix → chuyển sang dense
    if hasattr(df_processed, "toarray"):
        df_processed = df_processed.toarray()

    input_tensor = torch.tensor(df_processed, dtype=torch.float32).to(device)

    with torch.no_grad():
        prediction = model(input_tensor).squeeze().cpu().item()

    return {
        "mode": "raw_score_prediction",
        "predicted_score": round(prediction, 4)
    }
