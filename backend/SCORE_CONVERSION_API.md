# 📊 Score Conversion API Documentation

## 🎯 Mục tiêu
Hệ thống tự động chuyển đổi điểm số từ thang 10 sang:
- **GPA thang 4** (convertedNumericScore)  
- **Điểm chữ** (convertedScore)

## 📋 Bảng quy đổi điểm
| Xếp loại | Thang điểm 10 | Điểm chữ | Thang điểm 4 | Trạng thái |
|----------|---------------|----------|--------------|------------|
| Giỏi | 9.5 - 10.0 | A+ | 4.0 | Đạt |
| | 8.5 - 9.4 | A | 4.0 | Đạt |
| Khá | 8.0 - 8.4 | A- | 3.65 | Đạt |
| | 7.5 - 7.9 | B+ | 3.33 | Đạt |
| | 7.0 - 7.4 | B | 3.0 | Đạt |
| Trung bình | 6.5 - 6.9 | B- | 2.65 | Đạt |
| | 6.0 - 6.4 | C+ | 2.33 | Đạt |
| | 5.5 - 5.9 | C | 2.0 | Đạt |
| Trung bình yếu | 4.5 - 5.4 | C- | 1.65 | Đạt |
| Không đạt | 4.0 - 4.4 | D | 1.0 | Có điều kiện |
| Kém | 0.0 - 3.9 | F | 0.0 | Không đạt |

## 🚀 API Endpoints

### 1. Cập nhật conversion cho Predicted Scores
```http
POST /scores/update-predicted-conversions
Authorization: Bearer <jwt_token>
```

**Mô tả:** Cập nhật convertedNumericScore và convertedScore cho tất cả predicted scores có predictedScore không null.

**Response Example:**
```json
{
  "message": "Successfully updated conversion for 15 predicted scores",
  "summary": {
    "totalProcessed": 15,
    "successfullyUpdated": 15,
    "failedUpdates": 0,
    "academicPerformance": {
      "passing": 12,
      "conditional": 1,
      "failing": 2,
      "passingRate": "80.00%"
    },
    "gradeDistribution": {
      "A+": 2,
      "A": 3,
      "A-": 2,
      "B+": 3,
      "B": 2,
      "B-": 1,
      "C+": 1,
      "C": 0,
      "C-": 0,
      "D": 1,
      "F": 0
    },
    "averagePredictedGPA": "3.245"
  },
  "detailedResults": [...]
}
```

### 2. Cập nhật conversion cho Actual Scores
```http
POST /scores/update-actual-conversions
Authorization: Bearer <jwt_token>
```

**Mô tả:** Cập nhật convertedNumericScore và convertedScore cho tất cả score records có rawScore không null.

### 3. Cập nhật tất cả conversions
```http
POST /scores/update-all-conversions
Authorization: Bearer <jwt_token>
```

**Mô tả:** Cập nhật conversion cho cả actual và predicted scores, sau đó tính lại GPA stats.

**Response Example:**
```json
{
  "message": "Successfully updated all score conversions for user 1",
  "actualScoresUpdate": {...},
  "predictedScoresUpdate": {...},
  "updatedGPAStats": {
    "cumulativeGPA": 3.25,
    "predictedGPA": 3.18,
    "projectedGPA": 3.22,
    ...
  },
  "summary": {
    "totalActualScoresUpdated": 25,
    "totalPredictedScoresUpdated": 15,
    "totalUpdated": 40,
    "cumulativeGPA": 3.25,
    "projectedGPA": 3.22
  }
}
```

## 🔄 Tự động conversion

### Khi import CSV
- Nếu CSV có sẵn `converted_score` và `converted_numeric_score` → dùng giá trị từ CSV
- Nếu CSV không có nhưng có `raw_score` → tự động tính conversion
- Nếu không có cả hai → để null

### Khi tạo predictions
- Mọi predicted score mới đều tự động tính conversion
- Update predicted score cũng tự động cập nhật conversion

## 🎯 Các trường hợp sử dụng

### 1. Sau khi import CSV mới
```bash
# Import CSV trước, sau đó chạy update all nếu cần
POST /scores/upload (với file CSV)
POST /scores/update-all-conversions  # Nếu cần đảm bảo consistency
```

### 2. Sau khi có predictions mới
```bash
POST /scores/auto-predict
# Predictions sẽ tự động có conversion
```

### 3. Kiểm tra và cập nhật toàn bộ hệ thống
```bash
POST /scores/update-all-conversions
GET /scores/chart-data  # Để xem kết quả
```

## 📊 Thông tin trong response

### Academic Performance
- **passing**: Số môn đạt (điểm ≥ 4.5)
- **conditional**: Số môn có điều kiện (4.0 ≤ điểm < 4.5)
- **failing**: Số môn không đạt (điểm < 4.0)
- **passingRate**: Tỷ lệ đạt (%)

### Grade Distribution
Phân bố theo từng loại điểm chữ từ A+ đến F

### GPA Statistics
- **averageActualGPA**: GPA trung bình từ điểm thực tế
- **averagePredictedGPA**: GPA trung bình từ điểm dự đoán
- **cumulativeGPA**: GPA tích lũy (chỉ từ điểm thực tế, loại trừ ES courses)
- **projectedGPA**: GPA dự kiến (actual + predicted cho môn thiếu)

## ⚠️ Lưu ý quan trọng

1. **ES Courses**: Các môn bắt đầu bằng "ES" bị loại trừ khỏi tính toán GPA
2. **Null Values**: Chỉ conversion được áp dụng khi có điểm số (không null)
3. **Automatic Updates**: Tất cả predictions mới đều tự động có conversion
4. **Consistency**: Dùng `update-all-conversions` để đảm bảo tính nhất quán

## 🔍 Debug và kiểm tra

```bash
GET /scores/prediction-status  # Kiểm tra trạng thái predictions
GET /scores/analyze-data       # Phân tích dữ liệu có sẵn
GET /scores/gpa-stats         # Xem GPA statistics
```
