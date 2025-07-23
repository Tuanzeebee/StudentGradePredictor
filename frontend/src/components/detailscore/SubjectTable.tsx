import { useNavigate } from "react-router-dom";

interface ScoreData {
  courseCode: string;
  courseName?: string;
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
  const navigate = useNavigate();
  
  // Chỉ hiển thị các môn học chưa có điểm thực tế (actual = null hoặc undefined)
  const filteredScoreData = scoreData.filter(item => !item.actual);

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      marginTop: '20px'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#3C315B' }}>
        Chi tiết các môn học chưa có điểm thực tế ({filteredScoreData.length} môn)
      </h3>
      
      {filteredScoreData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <p>Tất cả các môn học đã có điểm thực tế</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            Không có môn học nào cần dự đoán điểm
          </p>
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
                  Tên môn
                </th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Học kỳ
                </th>
                <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Tín chỉ
                </th>
                <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Điểm dự đoán
                </th>
                <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredScoreData.map((item, index) => (
                <tr key={index} style={{ 
                  borderBottom: '1px solid #f3f4f6',
                  transition: 'background-color 0.2s',
                }}>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#1f2937' }}>
                    {item.courseCode}
                  </td>
                  <td style={{ padding: '15px', color: '#374151' }}>
                    {(() => {
                      const courseName = item.courseName || 'Chưa có tên môn';
                      // Nếu courseName có format "Mã môn: Tên môn", chỉ lấy phần tên môn
                      if (courseName.includes(':')) {
                        return courseName.split(':')[1]?.trim() || courseName;
                      }
                      return courseName;
                    })()}
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
                      <span style={{ color: '#ef4444', fontStyle: 'italic' }}>Chưa dự đoán</span>
                    )}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    {item.predicted ? (
                      <button
                        style={{
                          backgroundColor: '#0891b2',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 16px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0e7490'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0891b2'}
                        onClick={() => navigate(`/learning-path?courseCode=${item.courseCode}&predictedScore=${item.predicted || item.predictedGPA || 0}`)}
                      >
                        Learn
                      </button>
                    ) : (
                      <span style={{ 
                        color: '#9ca3af', 
                        fontStyle: 'italic',
                        fontSize: '12px'
                      }}>
                        Chưa có dự đoán
                      </span>
                    )}
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
