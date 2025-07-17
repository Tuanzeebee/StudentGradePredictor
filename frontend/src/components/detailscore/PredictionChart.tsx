import React from "react";

interface ScoreData {
  courseCode: string;
  semester: string;
  actual?: number;
  predicted?: number;
  actualGPA?: number;
  predictedGPA?: number;
  semesterNumber: number;
  year: string;
  studyFormat: string;
  creditsUnit: number;
}

interface PredictionChartProps {
  scoreData: ScoreData[];
}

const PredictionChart: React.FC<PredictionChartProps> = ({ scoreData }) => {
  // Calculate average scores
  const actualScores = scoreData.filter(item => item.actual !== undefined);
  const predictedScores = scoreData.filter(item => item.predicted !== undefined);
  
  const avgActualScore = actualScores.length > 0 
    ? actualScores.reduce((sum, item) => sum + (item.actual || 0), 0) / actualScores.length 
    : 0;
    
  const avgPredictedScore = predictedScores.length > 0 
    ? predictedScores.reduce((sum, item) => sum + (item.predicted || 0), 0) / predictedScores.length 
    : 0;

  // Calculate progress statistics
  const totalCourses = scoreData.length;
  const coursesWithActualScores = actualScores.length;
  const coursesWithPredictions = predictedScores.length;
  const completionRate = totalCourses > 0 ? (coursesWithActualScores / totalCourses) * 100 : 0;
  const predictionRate = totalCourses > 0 ? (coursesWithPredictions / totalCourses) * 100 : 0;

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '15px',
      marginTop: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ 
        marginBottom: '25px', 
        color: '#3C315B',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        Biểu đồ dự đoán theo tất cả môn học
      </h3>
      
      {/* Summary Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '2px solid #0ea5e9'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#0c4a6e', fontSize: '16px' }}>Điểm trung bình hiện tại</h4>
          <p style={{ 
            margin: 0, 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#0284c7'
          }}>
            {avgActualScore > 0 ? avgActualScore.toFixed(2) : 'N/A'}
          </p>
          <small style={{ color: '#0c4a6e' }}>
            Từ {coursesWithActualScores}/{totalCourses} môn học
          </small>
        </div>

        <div style={{
          backgroundColor: '#f0fdf4',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '2px solid #22c55e'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#14532d', fontSize: '16px' }}>Điểm dự đoán trung bình</h4>
          <p style={{ 
            margin: 0, 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#16a34a'
          }}>
            {avgPredictedScore > 0 ? avgPredictedScore.toFixed(2) : 'N/A'}
          </p>
          <small style={{ color: '#14532d' }}>
            Từ {coursesWithPredictions}/{totalCourses} dự đoán
          </small>
        </div>

        <div style={{
          backgroundColor: '#fefce8',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '2px solid #eab308'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#713f12', fontSize: '16px' }}>Cải thiện dự kiến</h4>
          <p style={{ 
            margin: 0, 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: avgPredictedScore > avgActualScore ? '#16a34a' : '#dc2626'
          }}>
            {avgActualScore > 0 && avgPredictedScore > 0 
              ? (avgPredictedScore > avgActualScore ? '+' : '') + (avgPredictedScore - avgActualScore).toFixed(2)
              : 'N/A'
            }
          </p>
          <small style={{ color: '#713f12' }}>
            Điểm số so với hiện tại
          </small>
        </div>
      </div>

      {/* Progress Bars */}
      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ marginBottom: '15px', color: '#374151' }}>Tiến độ hoàn thành</h4>
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '5px' 
          }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Môn học có điểm thực tế</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>
              {coursesWithActualScores}/{totalCourses} ({completionRate.toFixed(1)}%)
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '10px',
            backgroundColor: '#e5e7eb',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${completionRate}%`,
              height: '100%',
              backgroundColor: '#3b82f6',
              borderRadius: '5px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '5px' 
          }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Môn học có dự đoán</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>
              {coursesWithPredictions}/{totalCourses} ({predictionRate.toFixed(1)}%)
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '10px',
            backgroundColor: '#e5e7eb',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${predictionRate}%`,
              height: '100%',
              backgroundColor: '#10b981',
              borderRadius: '5px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '30px',
        padding: '15px',
        backgroundColor: '#f8fafc',
        borderRadius: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '16px',
            height: '4px',
            backgroundColor: '#3b82f6',
            borderRadius: '2px'
          }} />
          <span style={{ fontSize: '14px', color: '#374151', fontWeight: 'medium' }}>
            Điểm thực tế
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '16px',
            height: '4px',
            backgroundColor: '#10b981',
            borderRadius: '2px',
            opacity: 0.8,
            background: 'repeating-linear-gradient(45deg, #10b981, #10b981 3px, transparent 3px, transparent 6px)'
          }} />
          <span style={{ fontSize: '14px', color: '#374151', fontWeight: 'medium' }}>
            Điểm dự đoán
          </span>
        </div>
      </div>

     
    </div>
  );
};

export default PredictionChart;
