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

interface SubjectTableProps {
  scoreData: ScoreData[];
}

const SubjectTable: React.FC<SubjectTableProps> = ({ scoreData }) => {
  const getTrend = (actual?: number, predicted?: number) => {
    if (!actual || !predicted) return '→';
    const diff = predicted - actual;
    if (Math.abs(diff) < 0.1) return '→';
    if (diff > 0) return '↑';
    return '↓';
  };

  const getTrendColor = (actual?: number, predicted?: number) => {
    if (!actual || !predicted) return '#6b7280';
    const diff = predicted - actual;
    if (Math.abs(diff) < 0.1) return '#6b7280';
    if (diff > 0) return '#10b981';
    return '#ef4444';
  };

  const getTrendDescription = (actual?: number, predicted?: number) => {
    if (!actual || !predicted) return 'Chưa có dữ liệu';
    const diff = predicted - actual;
    if (Math.abs(diff) < 0.1) return 'Ổn định';
    if (diff > 0) return `Tăng ${diff.toFixed(1)} điểm`;
    return `Giảm ${Math.abs(diff).toFixed(1)} điểm`;
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      marginTop: '20px'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#3C315B' }}>Chi tiết các môn học</h3>
      
      {scoreData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <p>Chưa có dữ liệu môn học</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Mã môn
                </th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Học kỳ
                </th>
                <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Tín chỉ
                </th>
                <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Điểm thực tế
                </th>
                <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Điểm dự đoán
                </th>
                <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Xu hướng
                </th>
              </tr>
            </thead>
            <tbody>
              {scoreData.map((item, index) => (
                <tr key={index} style={{ 
                  borderBottom: '1px solid #f3f4f6',
                  transition: 'background-color 0.2s',
                }}>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#1f2937' }}>
                    {item.courseCode}
                  </td>
                  <td style={{ padding: '15px', color: '#6b7280' }}>
                    {item.semester}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span style={{
                      backgroundColor: '#f3f4f6',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#374151'
                    }}>
                      {item.creditsUnit}
                    </span>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    {item.actual ? (
                      <span style={{
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}>
                        {item.actual.toFixed(1)}
                      </span>
                    ) : (
                      <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>N/A</span>
                    )}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    {item.predicted ? (
                      <span style={{
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}>
                        {item.predicted.toFixed(1)}
                      </span>
                    ) : (
                      <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>N/A</span>
                    )}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '24px',
                        color: getTrendColor(item.actual, item.predicted),
                        fontWeight: 'bold'
                      }}>
                        {getTrend(item.actual, item.predicted)}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: getTrendColor(item.actual, item.predicted),
                        fontWeight: 'medium'
                      }}>
                        {getTrendDescription(item.actual, item.predicted)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubjectTable;
