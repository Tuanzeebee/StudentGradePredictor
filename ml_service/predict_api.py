from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cấu hình lại nếu muốn hạn chế
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
reverse_model = joblib.load("model_reverse/mlp_final_pipeline_revese.joblib")
score_model = joblib.load("xgb_final_pipeline.joblib")

# =========================
# 🚀 SCHEMA ĐẦU VÀO
# =========================

class ReverseRequest(BaseModel):
    semester_number: int
    course_code: str
    study_format: str
    credits_unit: int
    raw_score: float
    commute_time_minutes: float
    family_support: int

class PredictRequest(BaseModel):
    semester_number: int
    course_code: str
    study_format: str
    credits_unit: int
    weekly_study_hours: float
    attendance_percentage: float
    commute_time_minutes: float
    family_support: int

# =========================
# 🔁 API DỰ ĐOÁN NGƯỢC
# =========================
@app.post("/reverse")
def reverse_predict(data: ReverseRequest):
    # Tính các feature còn thiếu
    fail_rate_general = max(0, 1 - data.raw_score / 10)
    # Vì reverse chưa có attendance & study_hours nên sxa ta giả định đơn giản để tránh lỗi:
    sxa_placeholder = data.raw_score  # giả định
    fail_rate_major = max(0, 1 - sxa_placeholder / 20)

    input_df = pd.DataFrame([{
        "semester_number": data.semester_number,
        "course_code": data.course_code,
        "study_format": data.study_format,
        "credits_unit": data.credits_unit,
        "raw_score": data.raw_score,
        "commute_time_minutes": data.commute_time_minutes,
        "family_support": data.family_support,
        "fail_rate_general": fail_rate_general,
        "fail_rate_major": fail_rate_major,
    }])

    print("📘 Gọi mô hình nghịch (reverse prediction)")
    preds = reverse_model.predict(input_df)
    weekly_hours, attendance = preds[0]

    return {
        "mode": "reverse_prediction",
        "predicted_weekly_study_hours": float(weekly_hours),
        "predicted_attendance_percentage": float(attendance)
    }


# =========================
# 🎯 API DỰ ĐOÁN raw_score
# =========================
@app.post("/predict")
def predict_score(data: PredictRequest):
    sxa = data.weekly_study_hours * (data.attendance_percentage / 100)
    axs = (data.attendance_percentage / 100) * data.family_support
    interaction = data.weekly_study_hours * data.commute_time_minutes * (data.attendance_percentage / 100) * data.family_support

    hint = int(
        (data.attendance_percentage >= 85) or
        (data.weekly_study_hours >= 15 and data.attendance_percentage >= 90) or
        (data.weekly_study_hours >= 20 and data.attendance_percentage >= 70) or
        (data.family_support >= 3 and data.attendance_percentage >= 95) or
        (data.family_support >= 2 and data.attendance_percentage >= 85)
    )

    fail_rate_general = max(0, 1 - data.attendance_percentage / 100)
    fail_rate_major = max(0, 1 - sxa / 20)

    df = pd.DataFrame([{
        "semester_number": data.semester_number,
        "course_code": data.course_code,
        "study_format": data.study_format,
        "credits_unit": data.credits_unit,
        "weekly_study_hours": data.weekly_study_hours,
        "attendance_percentage": data.attendance_percentage,
        "commute_time_minutes": data.commute_time_minutes,
        "family_support": data.family_support,
        "study_hours_x_attendance": sxa,
        "attendance_x_support": axs,
        "full_interaction_feature": interaction,
        "expected_score_hint": hint,
        "fail_rate_general": fail_rate_general,
        "fail_rate_major": fail_rate_major
    }])

    # Bổ sung feature thiếu nếu cần
    if hasattr(score_model, 'feature_names_in_'):
        expected = list(score_model.feature_names_in_)
        for col in expected:
            if col not in df.columns:
                df[col] = 0
        df = df[expected]

    print("📘 Gọi mô hình chính để dự đoán raw_score")
    predicted = score_model.predict(df)[0]

    return {
        "mode": "raw_score_prediction",
        "predicted_score": float(predicted)
    }
    # --- 3. Lỗi nếu không có thông tin hợp lệ ---
    return {
        "error": "❌ Thiếu thông tin. Cần raw_score để dự đoán ngược hoặc weekly_study_hours & attendance_percentage để dự đoán điểm."
    }
