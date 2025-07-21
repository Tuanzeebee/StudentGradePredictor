# PowerShell script to start the ML service using predict_api_1.py

Write-Host "🚀 Starting ML Service (predict_api_1.py)..." -ForegroundColor Green
Write-Host "📍 Port: 8000" -ForegroundColor Yellow
Write-Host "📂 Directory: ml_service" -ForegroundColor Yellow

Set-Location ml_service

# Check if Python is available
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if required files exist
if (-not (Test-Path "predict_api_1.py")) {
    Write-Host "❌ predict_api_1.py not found in ml_service directory" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "model_reverse/mlp_final_pipeline_reverse.joblib")) {
    Write-Host "❌ Reverse model not found: model_reverse/mlp_final_pipeline_reverse.joblib" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "mlp_final_pipeline.joblib")) {
    Write-Host "❌ Prediction model not found: mlp_final_pipeline.joblib" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All models found" -ForegroundColor Green
Write-Host "🔄 Starting FastAPI server..." -ForegroundColor Blue

# Install dependencies if needed
python -m pip install fastapi uvicorn pandas scikit-learn joblib --quiet

# Start the server
python -m uvicorn predict_api_1:app --host 0.0.0.0 --port 8000 --reload
