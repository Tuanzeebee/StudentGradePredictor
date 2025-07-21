import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getChartData } from '../api';

type DataPoint = {
  courseCode: string;
  semester: string;
  actual?: number;
  predicted?: number;
  actualGPA?: number;
  predictedGPA?: number;
};

interface GPAStats {
  cumulativeGPA: number;
  predictedGPA: number;
  projectedGPA: number;
  totalCompletedCredits: number;
  totalCredits: number;
  totalPredictedCredits: number;
  totalCourses: number;
  completedCourses: number;
  predictedCourses: number;
  semesterGPAs: Array<{
    semester: string;
    actualGPA: number;
    predictedGPA: number;
    projectedGPA: number;
    completedCredits: number;
    totalCredits: number;
    predictedCredits: number;
  }>;
}

export interface ScoreChartRef {
  refreshData: () => Promise<void>;
}

interface ScoreChartProps {
  gpaStats?: GPAStats;
}

const ScoreChart = forwardRef<ScoreChartRef, ScoreChartProps>(({ gpaStats }, ref) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGPA, setShowGPA] = useState(false);
  const [showGPAStats, setShowGPAStats] = useState(false);
  const [gpaStatsState, setGpaStatsState] = useState<GPAStats | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getChartData();
      const responseData = response.data;
      
      // Handle new response structure with chartData and gpaStats
      if (responseData.chartData) {
        setData(responseData.chartData);
        if (responseData.gpaStats) {
          setGpaStatsState(responseData.gpaStats);
        }
      } else {
        // Fallback for old response format
        setData(responseData);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch chart data');
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshData: fetchData,
  }));

  useEffect(() => {
    fetchData();
  }, []);

  // Update local state when props change
  useEffect(() => {
    if (gpaStats) {
      setGpaStatsState(gpaStats);
    }
  }, [gpaStats]);

  // Use props gpaStats if available, otherwise use local state
  const currentGpaStats = gpaStats || gpaStatsState;

  if (loading || error || data.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: error ? '#fff3e0' : '#f8f9fa',
          borderRadius: '8px',
          border: error ? '1px solid #ff9800' : undefined,
        }}
      >
        <p style={{ color: error ? '#e65100' : '#333' }}>
          {error ? `Lỗi: ${error}` : loading ? 'Đang tải dữ liệu...' : 'Không có dữ liệu để hiển thị'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* GPA Stats Summary */}
      {gpaStats && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#1976d2' }}>GPA Hiện tại</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {gpaStats.cumulativeGPA.toFixed(2)}
            </p>
            <small style={{ color: '#666' }}>{gpaStats.completedCourses}/{gpaStats.totalCourses} môn</small>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#43a047' }}>GPA Dự đoán</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#43a047' }}>
              {gpaStats.predictedGPA.toFixed(2)}
            </p>
            <small style={{ color: '#666' }}>Toàn khóa</small>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#ff9800' }}>Tín chỉ</h4>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>
              {gpaStats.totalCompletedCredits}/{gpaStats.totalCredits}
            </p>
            <small style={{ color: '#666' }}>Hoàn thành/Tổng</small>
          </div>
        </div>
      )}

      {/* Chart Toggle */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showGPA}
            onChange={(e) => setShowGPA(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          <span>Hiển thị GPA thay vì điểm thô</span>
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showGPAStats}
            onChange={(e) => setShowGPAStats(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          <span>Hiển thị thống kê GPA</span>
        </label>
      </div>

      {/* GPA Statistics Panel */}
      {currentGpaStats && showGPAStats && (
        <div className="gpa-stats" style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>GPA Statistics</h3>
          <div className="gpa-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '10px',
            marginBottom: '15px'
          }}>
            <div className="gpa-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontWeight: 'bold' }}>Cumulative GPA (Current):</label>
              <span style={{ color: '#1976d2' }}>{currentGpaStats.cumulativeGPA.toFixed(2)}</span>
            </div>
            <div className="gpa-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontWeight: 'bold' }}>Predicted GPA (All Predictions):</label>
              <span style={{ color: '#43a047' }}>{currentGpaStats.predictedGPA.toFixed(2)}</span>
            </div>
            <div className="gpa-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontWeight: 'bold' }}>Projected GPA (Combined):</label>
              <span style={{ color: '#9c27b0' }}>{currentGpaStats.projectedGPA.toFixed(2)}</span>
            </div>
            <div className="gpa-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontWeight: 'bold' }}>Completed Credits:</label>
              <span>{currentGpaStats.totalCompletedCredits}/{currentGpaStats.totalCredits}</span>
            </div>
            <div className="gpa-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontWeight: 'bold' }}>Predicted Credits:</label>
              <span style={{ color: '#43a047' }}>{currentGpaStats.totalPredictedCredits}</span>
            </div>
            <div className="gpa-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontWeight: 'bold' }}>Courses:</label>
              <span>
                Completed: {currentGpaStats.completedCourses}, 
                Predicted: {currentGpaStats.predictedCourses}, 
                Total: {currentGpaStats.totalCourses}
              </span>
            </div>
          </div>

          <h4 style={{ margin: '15px 0 10px 0', color: '#333' }}>Semester GPAs</h4>
          <div className="semester-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px'
          }}>
            {currentGpaStats.semesterGPAs.map((sem, index) => (
              <div key={index} className="semester-item" style={{
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #dee2e6'
              }}>
                <strong style={{ display: 'block', marginBottom: '5px', color: '#333' }}>{sem.semester}</strong>
                <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                  <div>Actual GPA: <span style={{ color: '#1976d2' }}>{sem.actualGPA.toFixed(2)}</span></div>
                  <div>Predicted GPA: <span style={{ color: '#43a047' }}>{sem.predictedGPA.toFixed(2)}</span></div>
                  <div>Projected GPA: <span style={{ color: '#9c27b0' }}>{sem.projectedGPA.toFixed(2)}</span></div>
                  <div>Credits: {sem.completedCredits}/{sem.totalCredits} (Predicted: {sem.predictedCredits})</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="courseCode" />
            <YAxis domain={showGPA ? [0, 4] : [0, 10]} />
            <Tooltip 
              formatter={(value: number, name: string) => [
                value.toFixed(2), 
                name
              ]} 
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={showGPA ? "actualGPA" : "actual"}
              stroke="#1976d2"
              strokeWidth={2.5}
              name={showGPA ? "GPA thực tế" : "Điểm thực tế"}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey={showGPA ? "predictedGPA" : "predicted"}
              stroke="#43a047"
              strokeWidth={2}
              strokeDasharray="5 5"
              name={showGPA ? "GPA dự đoán" : "Điểm dự đoán"}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

ScoreChart.displayName = 'ScoreChart';

export default ScoreChart;
