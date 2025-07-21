#!/bin/bash
# Script to start the ML service using predict_api_1.py

echo "🚀 Starting ML Service (predict_api_1.py)..."
echo "📍 Port: 8000"
echo "📂 Directory: ml_service"

cd ml_service

# Check if Python is available
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed or not in PATH"
    exit 1
fi

# Check if required files exist
if [ ! -f "predict_api_1.py" ]; then
    echo "❌ predict_api_1.py not found in ml_service directory"
    exit 1
fi

if [ ! -f "model_reverse/mlp_final_pipeline_reverse.joblib" ]; then
    echo "❌ Reverse model not found: model_reverse/mlp_final_pipeline_reverse.joblib"
    exit 1
fi

if [ ! -f "mlp_final_pipeline.joblib" ]; then
    echo "❌ Prediction model not found: mlp_final_pipeline.joblib"
    exit 1
fi

echo "✅ All models found"
echo "🔄 Starting FastAPI server..."

# Install dependencies if needed
python -m pip install fastapi uvicorn pandas scikit-learn joblib --quiet

# Start the server
python -m uvicorn predict_api_1:app --host 0.0.0.0 --port 8000 --reload
