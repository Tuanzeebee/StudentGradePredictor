from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd

app = FastAPI()

# Load full pipeline model (có cả OneHotEncoder bên trong)
model = joblib.load("xgb_final_pipeline.joblib")

class PredictRequest(BaseModel):
    semester_number: int
    course_code: str
    study_format: str
    credits_unit: int
    weekly_study_hours: float
    attendance_percentage: float
    commute_time_minutes: float
    family_support: int
    study_hours_x_attendance: float
    attendance_x_support: float
    full_interaction_feature: float
    expected_score_hint: int
    fail_rate_general: float
    fail_rate_major: float

@app.post("/predict")
def predict(data: PredictRequest):
    sxa = data.weekly_study_hours * (data.attendance_percentage / 100)
    axs = (data.attendance_percentage / 100) * data.family_support
    interaction = data.weekly_study_hours * data.commute_time_minutes * (data.attendance_percentage / 100) * data.family_support

    hint = int(
        (data.attendance_percentage >= 85) or
        (data.weekly_study_hours >= 15 and data.attendance_percentage >= 90) or
        (data.weekly_study_hours >= 20 and data.attendance_percentage >= 70) or
        (data.family_support >= 4 and data.attendance_percentage >= 95) or
        (data.family_support >= 3 and data.attendance_percentage >= 85)
    )

    fail_rate_general = max(0, 1 - data.attendance_percentage / 100)
    fail_rate_major = max(0, 1 - sxa / 20)

    # Tạo input dưới dạng dataframe với tên cột đúng như khi train
    df = pd.DataFrame([{
        "semester_number": data.semester_number,
        "course_code": data.course_code,               # giữ nguyên string
        "study_format": data.study_format,             # giữ nguyên string
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

    print("📦 Input DataFrame to model:\n", df)

    try:
        model_features = getattr(model, 'feature_names_in_', None)
        if model_features is not None:
            print("✅ Model expects features:", list(model_features))
            missing = set(model_features) - set(df.columns)
            extra = set(df.columns) - set(model_features)
            if missing:
                print("❌ Missing feature(s):", missing)
            if extra:
                print("⚠️ Extra feature(s):", extra)
    except Exception as e:
        print("⚠️ Could not inspect model feature names:", str(e))

    prediction = model.predict(df)[0]
    print(f"✅ Predicted score: {prediction:.4f}")

    return {"predicted_score": float(prediction)}
