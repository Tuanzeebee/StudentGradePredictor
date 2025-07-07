import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScoreChart from '../components/ScoreChart';

interface ScoreData {
  courseCode: string;
  semester: string;
  actual?: number;
  predicted?: number;
}

const ScoreChartPage: React.FC = () => {
  const navigate = useNavigate();
  const [scoreData, setScoreData] = useState<ScoreData[]>([]);
  const [totalGPA, setTotalGPA] = useState<number>(0);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [inferredResults, setInferredResults] = useState<{[key: number]: {attendancePercentage: number, weeklyStudyHours: number}}>({});

  const handleSupportChange = (index: number, value: number) => {
    // Handle family support change
    console.log(`Support changed for index ${index}: ${value}`);
  };

  const handleCommuteChange = (index: number, value: number) => {
    // Handle commute time change
    console.log(`Commute time changed for index ${index}: ${value}`);
  };

  const handleInfer = (index: number) => {
    // Simulate inference result
    const result = {
      attendancePercentage: Math.floor(Math.random() * 30) + 70, // 70-100%
      weeklyStudyHours: Math.floor(Math.random() * 10) + 10 // 10-20 hours
    };
    setInferredResults(prev => ({...prev, [index]: result}));
  };

  useEffect(() => {
    // Fetch data for GPA calculation
    fetch('http://localhost:3000/scores/chart-data')
      .then((res) => res.json())
      .then((data) => {
        setScoreData(data);
        
        // Calculate total GPA from actual scores
        const validScores = data.filter((item: ScoreData) => item.actual && item.actual > 0);
        const totalScore = validScores.reduce((sum: number, item: ScoreData) => sum + (item.actual || 0), 0);
        const averageGPA = validScores.length > 0 ? totalScore / validScores.length : 0;
        
        setTotalGPA(parseFloat(averageGPA.toFixed(2)));
        setTotalCourses(validScores.length);
      })
      .catch((error) => {
        console.error('Error fetching score data:', error);
      });
  }, []);

  return (
    <div style={{ 
      padding: '30px',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px' 
      }}>
        <h1 style={{ 
          color: '#333',
          marginBottom: '10px'
        }}>
          Biểu Đồ Điểm Số
        </h1>
        <p style={{ 
          color: '#666',
          marginBottom: '20px'
        }}>
          Xem biểu đồ so sánh điểm thực tế và điểm dự đoán
        </p>
      </div>

      {/* GPA Summary Card */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>Tổng Kết GPA</h3>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ 
            backgroundColor: '#e3f2fd',
            padding: '15px',
            borderRadius: '8px',
            minWidth: '150px'
          }}>
            <h4 style={{ color: '#1976d2', margin: '0 0 5px 0' }}>GPA Trung Bình</h4>
            <p style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#1976d2',
              margin: '0'
            }}>
              {totalGPA.toFixed(2)}
            </p>
          </div>
          <div style={{ 
            backgroundColor: '#f3e5f5',
            padding: '15px',
            borderRadius: '8px',
            minWidth: '150px'
          }}>
            <h4 style={{ color: '#7b1fa2', margin: '0 0 5px 0' }}>Tổng Số Môn</h4>
            <p style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#7b1fa2',
              margin: '0'
            }}>
              {totalCourses}
            </p>
          </div>
        </div>
        
        {/* Notes Section */}
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          borderLeft: '4px solid #ff9800'
        }}>
          <h4 style={{ color: '#e65100', margin: '0 0 10px 0' }}>📝 Ghi Chú:</h4>
          <ul style={{ 
            textAlign: 'left', 
            margin: '0', 
            paddingLeft: '20px',
            color: '#e65100'
          }}>
            <li><strong>RawScore:</strong> Điểm thực tế của từng môn học (thang điểm 10)</li>
            <li><strong>GPA:</strong> Điểm trung bình được tính từ tất cả các môn học</li>
            <li><strong>Điểm dự đoán:</strong> Điểm được dự đoán dựa trên thuật toán AI</li>
            <li><strong>Biểu đồ:</strong> So sánh giữa điểm thực tế (xanh dương) và điểm dự đoán (xanh lá)</li>
          </ul>
        </div>
      </div>

      {/* Chart Container */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <ScoreChart />
        {scoreData
  .filter((item) => item.actual && item.actual > 0)
  .map((item, index) => (
    <div key={index} style={{ marginBottom: '20px', padding: '15px', background: '#fff', borderRadius: '8px' }}>
      <h4 style={{ marginBottom: '10px' }}>Môn: {item.courseCode} – {item.semester}</h4>
      <label>
        Hỗ trợ gia đình:
        <select defaultValue={1} onChange={(e) => handleSupportChange(index, parseInt(e.target.value))}>
          <option value={0}>Thấp</option>
          <option value={1}>Trung bình</option>
          <option value={2}>Cao</option>
          <option value={3}>Rất cao</option>
        </select>
      </label>
      <label style={{ marginLeft: '20px' }}>
        Thời gian đi học (phút):
        <input 
          type="number" 
          min={5} 
          max={60} 
          defaultValue={25} 
          style={{ width: '60px', marginLeft: '5px' }}
          onChange={(e) => handleCommuteChange(index, parseInt(e.target.value))} 
        />
      </label>
      <button onClick={() => handleInfer(index)} style={{ marginLeft: '20px' }}>
        Tính thời gian học & điểm danh
      </button>

      {/* Kết quả dự đoán hiển thị ở đây */}
      {inferredResults[index] && (
        <div style={{ marginTop: '10px', color: '#007bff' }}>
          👉 attendance: {inferredResults[index].attendancePercentage}% – weeklyStudyHours: {inferredResults[index].weeklyStudyHours}
        </div>
      )}
    </div>
))}

      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={() => navigate('/landing')}
          style={{ 
            padding: '12px 30px', 
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '0 10px'
          }}
        >
          Về Trang Chính
        </button>
        
        <button 
          onClick={() => navigate('/')}
          style={{ 
            padding: '12px 30px', 
            fontSize: '16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '0 10px'
          }}
        >
          Về Trang Chủ
        </button>
      </div>
    </div>
  );
};

export default ScoreChartPage; 