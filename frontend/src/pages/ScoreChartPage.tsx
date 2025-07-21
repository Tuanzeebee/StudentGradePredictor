import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ScoreChart from '../components/ScoreChart';
import type { ScoreChartRef } from '../components/ScoreChart';
import { savePredictedScore, getChartData } from '../api';

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

type InputMode = 'per-course' | 'by-semester' | 'apply-all';

interface GlobalValues {
  familySupport: number;
  commuteHours: number;
  attendance: number;
}

interface SemesterValues {
  [semesterKey: string]: GlobalValues;
}

const ScoreChartPage: React.FC = () => {
  const navigate = useNavigate();
  const chartRef = useRef<ScoreChartRef>(null);
  const [scoreData, setScoreData] = useState<ScoreData[]>([]);
  const [gpaStats, setGpaStats] = useState<GPAStats | null>(null);
  const [predictedScores, setPredictedScores] = useState<{ [index: number]: number }>({});
  const [supportValues, setSupportValues] = useState<{ [index: number]: number }>({});
  const [commuteValues, setCommuteValues] = useState<{ [index: number]: number }>({});
  const [attendanceValues, setAttendanceValues] = useState<{ [index: number]: number }>({});
  const [rawScores, setRawScores] = useState<{ [index: number]: number }>({});
  const [inferredResults, setInferredResults] = useState<{ [index: number]: { weeklyStudyHours: number } }>({});
  const [saving, setSaving] = useState<{ [index: number]: boolean }>({});

  // New state for input modes
  const [inputMode, setInputMode] = useState<InputMode>('per-course');
  const [globalValues, setGlobalValues] = useState<GlobalValues>({
    familySupport: 1,
    commuteHours: 0,
    attendance: 90,
  });
  const [semesterValues, setSemesterValues] = useState<SemesterValues>({});
  const [availableSemesters, setAvailableSemesters] = useState<string[]>([]);

  const handleSupportChange = (index: number, value: number) => {
    setSupportValues(prev => ({ ...prev, [index]: value }));
  };
  const handleCommuteChange = (index: number, value: number) => {
    setCommuteValues(prev => ({ ...prev, [index]: value }));
  };
  const handleAttendanceChange = (index: number, value: number) => {
    setAttendanceValues(prev => ({ ...prev, [index]: value }));
  };

  const handleInferAndPredict = async (index: number) => {
    const item = scoreData[index];
    const rawScore = rawScores[index];
    const commute = commuteValues[index];
    const support = supportValues[index];
    const attendance = attendanceValues[index];

    if ([rawScore, commute, support, attendance].some(v => v === undefined || isNaN(v))) return;

    try {
      setSaving(prev => ({ ...prev, [index]: true }));

      // Step 1: Call reverse engineering to get weekly study hours
      const reverseRes = await fetch("http://localhost:8000/reverse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          semester_number: item.semesterNumber,
          course_code: item.courseCode,
          study_format: item.studyFormat,
          credits_unit: item.creditsUnit,
          raw_score: rawScore,
          attendance_percentage: attendance,
          part_time_hours: commute,
          family_support: support,
        }),
      });

      const reverseResult = await reverseRes.json();
      if (!reverseResult.predicted_weekly_study_hours) return;

      const weeklyStudyHours = reverseResult.predicted_weekly_study_hours;
      setInferredResults(prev => ({ ...prev, [index]: { weeklyStudyHours } }));

      // Step 2: Call prediction API (predict_api_1.py automatically calculates interaction features)
      const predictRes = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          semester_number: item.semesterNumber,
          course_code: item.courseCode,
          study_format: item.studyFormat,
          credits_unit: item.creditsUnit,
          weekly_study_hours: weeklyStudyHours,
          attendance_percentage: attendance,
          part_time_hours: commute,
          family_support: support,
        }),
      });

      const predictResult = await predictRes.json();
      if (predictResult.predicted_score !== undefined) {
        const predictedScore = predictResult.predicted_score;
        setPredictedScores(prev => ({ ...prev, [index]: predictedScore }));

        // Step 3: Automatically save to backend database
        try {
          await savePredictedScore({
            semesterNumber: item.semesterNumber,
            year: item.year || '2024-2025', // Use existing year or default
            courseCode: item.courseCode,
            predictedScore: predictedScore,
            weeklyStudyHours: weeklyStudyHours,
            attendancePercentage: attendance,
            commuteTimeMinutes: commute,
            familySupport: support,
            studyFormat: item.studyFormat,
            creditsUnit: item.creditsUnit,
          });

          // Step 4: Refresh the chart to show updated data and fetch new GPA stats
          if (chartRef.current) {
            await chartRef.current.refreshData();
          }

          // Step 5: Refetch GPA stats to update the page
          const updatedResponse = await getChartData();
          const updatedData = updatedResponse.data;
          if (updatedData.gpaStats) {
            setGpaStats(updatedData.gpaStats);
          }

          console.log('✅ Prediction saved successfully!');
        } catch (saveError) {
          console.error('❌ Error saving prediction:', saveError);
          // Still show the prediction even if saving fails
        }
      }

    } catch (err) {
      console.error("❌ Lỗi dự đoán:", err);
    } finally {
      setSaving(prev => ({ ...prev, [index]: false }));
    }
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/auth/login');

      const response = await getChartData();
      const responseData = response.data;
      
      // Handle new response structure
      if (responseData.chartData && responseData.gpaStats) {
        setScoreData(responseData.chartData);
        setGpaStats(responseData.gpaStats);
      } else {
        // Fallback for old response format
        setScoreData(responseData);
      }

      // Extract unique semesters for semester mode
      const data = responseData.chartData || responseData;
      if (Array.isArray(data)) {
        const uniqueSemesters = [...new Set(data.map((item: ScoreData) => item.semester))].filter((s): s is string => typeof s === 'string');
        setAvailableSemesters(uniqueSemesters);

        // Initialize semester values with defaults
        const initialSemesterValues: SemesterValues = {};
        uniqueSemesters.forEach(semester => {
          initialSemesterValues[semester] = {
            familySupport: 1,
            commuteHours: 0,
            attendance: 90,
          };
        });
        setSemesterValues(initialSemesterValues);

        const rawMap: { [index: number]: number } = {};
        data.forEach((item: ScoreData, idx: number) => {
          if (item.actual != null) rawMap[idx] = item.actual;
        });
        setRawScores(rawMap);
      }
    } catch (err) {
      console.error("Lỗi fetch chart-data:", err);
      // If token is invalid, redirect to login
      if (err instanceof Error && err.message.includes('401')) {
        navigate('/auth/login');
      }
    }
  };

  fetchData();
}, [navigate]);

  useEffect(() => {
    scoreData.forEach((_, index) => {
      const rawScore = rawScores[index];
      const commute = commuteValues[index];
      const support = supportValues[index];
      const attendance = attendanceValues[index];

      const valid = [rawScore, commute, support, attendance].every(v => v !== undefined && !isNaN(v));
      if (valid) handleInferAndPredict(index);
    });
  }, [scoreData, rawScores, commuteValues, supportValues, attendanceValues]);

  // Helper functions for mode management
  const applyGlobalValues = () => {
    const newSupportValues: { [index: number]: number } = {};
    const newCommuteValues: { [index: number]: number } = {};
    const newAttendanceValues: { [index: number]: number } = {};

    scoreData.forEach((_, index) => {
      newSupportValues[index] = globalValues.familySupport;
      newCommuteValues[index] = globalValues.commuteHours;
      newAttendanceValues[index] = globalValues.attendance;
    });

    setSupportValues(newSupportValues);
    setCommuteValues(newCommuteValues);
    setAttendanceValues(newAttendanceValues);
  };

  const applySemesterValues = () => {
    const newSupportValues: { [index: number]: number } = {};
    const newCommuteValues: { [index: number]: number } = {};
    const newAttendanceValues: { [index: number]: number } = {};

    scoreData.forEach((item, index) => {
      const semesterKey = item.semester;
      const semesterValue = semesterValues[semesterKey];
      
      if (semesterValue) {
        newSupportValues[index] = semesterValue.familySupport;
        newCommuteValues[index] = semesterValue.commuteHours;
        newAttendanceValues[index] = semesterValue.attendance;
      }
    });

    setSupportValues(newSupportValues);
    setCommuteValues(newCommuteValues);
    setAttendanceValues(newAttendanceValues);
  };

  const handleModeChange = (newMode: InputMode) => {
    setInputMode(newMode);
    
    // Apply values based on selected mode
    if (newMode === 'apply-all') {
      applyGlobalValues();
    } else if (newMode === 'by-semester') {
      applySemesterValues();
    }
    // For 'per-course' mode, keep existing individual values
  };

  const handleGlobalValueChange = (field: keyof GlobalValues, value: number) => {
    const newGlobalValues = { ...globalValues, [field]: value };
    setGlobalValues(newGlobalValues);
    
    if (inputMode === 'apply-all') {
      // Apply to all courses immediately
      const newSupportValues: { [index: number]: number } = {};
      const newCommuteValues: { [index: number]: number } = {};
      const newAttendanceValues: { [index: number]: number } = {};

      scoreData.forEach((_, index) => {
        newSupportValues[index] = newGlobalValues.familySupport;
        newCommuteValues[index] = newGlobalValues.commuteHours;
        newAttendanceValues[index] = newGlobalValues.attendance;
      });

      setSupportValues(newSupportValues);
      setCommuteValues(newCommuteValues);
      setAttendanceValues(newAttendanceValues);
    }
  };

  const handleSemesterValueChange = (semester: string, field: keyof GlobalValues, value: number) => {
    const newSemesterValues = {
      ...semesterValues,
      [semester]: {
        ...semesterValues[semester],
        [field]: value,
      },
    };
    setSemesterValues(newSemesterValues);
    
    if (inputMode === 'by-semester') {
      // Apply to courses in this semester immediately
      const newSupportValues = { ...supportValues };
      const newCommuteValues = { ...commuteValues };
      const newAttendanceValues = { ...attendanceValues };

      scoreData.forEach((item, index) => {
        if (item.semester === semester) {
          const semesterValue = newSemesterValues[semester];
          newSupportValues[index] = semesterValue.familySupport;
          newCommuteValues[index] = semesterValue.commuteHours;
          newAttendanceValues[index] = semesterValue.attendance;
        }
      });

      setSupportValues(newSupportValues);
      setCommuteValues(newCommuteValues);
      setAttendanceValues(newAttendanceValues);
    }
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8f9fa' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Biểu Đồ Điểm Số & GPA</h1>
      <ScoreChart ref={chartRef} gpaStats={gpaStats || undefined} />
      
      <div style={{ marginTop: '30px' }}>
        <h2>Dự đoán điểm số</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Chọn chế độ nhập và điền thông tin để dự đoán điểm số. Kết quả sẽ được lưu tự động và cập nhật biểu đồ.
        </p>

        {/* Mode Selector */}
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>🎯 Chế độ nhập liệu</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="inputMode"
                value="per-course"
                checked={inputMode === 'per-course'}
                onChange={(e) => handleModeChange(e.target.value as InputMode)}
                style={{ marginRight: '8px' }}
              />
              <span>🟩 <strong>Từng môn học</strong> (chi tiết)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="inputMode"
                value="by-semester"
                checked={inputMode === 'by-semester'}
                onChange={(e) => handleModeChange(e.target.value as InputMode)}
                style={{ marginRight: '8px' }}
              />
              <span>🟨 <strong>Theo học kỳ</strong></span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="inputMode"
                value="apply-all"
                checked={inputMode === 'apply-all'}
                onChange={(e) => handleModeChange(e.target.value as InputMode)}
                style={{ marginRight: '8px' }}
              />
              <span>🟦 <strong>Áp dụng cho tất cả</strong></span>
            </label>
          </div>
        </div>

        {/* Global Input Mode */}
        {inputMode === 'apply-all' && (
          <div style={{ 
            backgroundColor: '#e3f2fd', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '2px solid #2196f3'
          }}>
            <h4 style={{ marginBottom: '15px', color: '#1976d2' }}>🟦 Giá trị áp dụng cho tất cả môn học</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <label><strong>Hỗ trợ gia đình:</strong><br/>
                <select 
                  value={globalValues.familySupport} 
                  onChange={(e) => handleGlobalValueChange('familySupport', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value={0}>Thấp</option>
                  <option value={1}>Trung bình</option>
                  <option value={2}>Cao</option>
                  <option value={3}>Rất cao</option>
                </select>
              </label>
              <label><strong>Thời Gian Đi Làm (giờ/tuần):</strong><br/>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={globalValues.commuteHours}
                  onChange={(e) => handleGlobalValueChange('commuteHours', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="0-40 giờ"
                />
              </label>
              <label><strong>Tỷ lệ chuyên cần (%):</strong><br/>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={globalValues.attendance}
                  onChange={(e) => handleGlobalValueChange('attendance', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="50-100%"
                />
              </label>
            </div>
          </div>
        )}

        {/* Semester Input Mode */}
        {inputMode === 'by-semester' && (
          <div style={{ 
            backgroundColor: '#fff8e1', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '2px solid #ffc107'
          }}>
            <h4 style={{ marginBottom: '15px', color: '#f57c00' }}>🟨 Nhập theo học kỳ</h4>
            {availableSemesters.map(semester => (
              <div key={semester} style={{ 
                marginBottom: '20px', 
                padding: '15px', 
                backgroundColor: '#fff',
                borderRadius: '6px',
                border: '1px solid #ddd'
              }}>
                <h5 style={{ marginBottom: '10px', color: '#333' }}>📚 {semester}</h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  <label><strong>Hỗ trợ gia đình:</strong><br/>
                    <select 
                      value={semesterValues[semester]?.familySupport ?? 1} 
                      onChange={(e) => handleSemesterValueChange(semester, 'familySupport', parseInt(e.target.value))}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      <option value={0}>Thấp</option>
                      <option value={1}>Trung bình</option>
                      <option value={2}>Cao</option>
                      <option value={3}>Rất cao</option>
                    </select>
                  </label>
                  <label><strong>Đi làm (giờ/tuần):</strong><br/>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={semesterValues[semester]?.commuteHours ?? 0}
                      onChange={(e) => handleSemesterValueChange(semester, 'commuteHours', parseInt(e.target.value))}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </label>
                  <label><strong>Chuyên cần (%):</strong><br/>
                    <input
                      type="number"
                      min={50}
                      max={100}
                      value={semesterValues[semester]?.attendance ?? 90}
                      onChange={(e) => handleSemesterValueChange(semester, 'attendance', parseInt(e.target.value))}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Per-course input mode or results display */}
      {inputMode === 'per-course' && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#4caf50' }}>🟩 Nhập chi tiết từng môn học</h3>
        </div>
      )}
      
      {scoreData.map((item, index) => (
        <div key={index} style={{ 
          background: '#fff', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: saving[index] ? '2px solid #007bff' : '1px solid #e0e0e0',
          opacity: inputMode === 'per-course' ? 1 : 0.8
        }}>
          <h4 style={{ marginBottom: '15px', color: '#333' }}>
            Môn: {item.courseCode} – {item.semester}
            {saving[index] && <span style={{ color: '#007bff', marginLeft: '10px' }}>💾 Đang lưu...</span>}
          </h4>
          <p style={{ marginBottom: '15px' }}>Raw Score: {rawScores[index] ?? '—'}</p>
          
          {inputMode === 'per-course' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <label><strong>Hỗ trợ gia đình:</strong><br/>
                <select 
                  value={supportValues[index] ?? 1} 
                  onChange={(e) => handleSupportChange(index, parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  disabled={saving[index]}
                >
                  <option value={0}>Thấp</option>
                  <option value={1}>Trung bình</option>
                  <option value={2}>Cao</option>
                  <option value={3}>Rất cao</option>
                </select>
              </label>
              
              <label><strong>Thời Gian Đi Làm (giờ/tuần):</strong><br/>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={commuteValues[index] ?? ''}
                  onChange={(e) => handleCommuteChange(index, parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="0-40 giờ"
                  disabled={saving[index]}
                />
              </label>

              <label><strong>Tỷ lệ chuyên cần (%):</strong><br/>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={attendanceValues[index] ?? ''}
                  onChange={(e) => handleAttendanceChange(index, parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="50-100%"
                  disabled={saving[index]}
                />
              </label>
            </div>
          )}

          {inputMode !== 'per-course' && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px', 
              color: '#666',
              fontSize: '14px'
            }}>
              📋 Giá trị đã được áp dụng từ chế độ {inputMode === 'apply-all' ? 'toàn cục' : 'theo học kỳ'}:
              <br/>
              • Hỗ trợ gia đình: {supportValues[index] ?? '—'}
              • Đi làm: {commuteValues[index] ?? '—'} giờ/tuần
              • Chuyên cần: {attendanceValues[index] ?? '—'}%
            </div>
          )}
          
          {predictedScores[index] !== undefined && (
            <div style={{ 
              marginTop: '15px', 
              padding: '10px', 
              backgroundColor: '#d4edda', 
              borderRadius: '4px', 
              color: '#155724' 
            }}>
              🎯 <strong>Điểm dự đoán: {predictedScores[index].toFixed(2)}</strong>
            </div>
          )}
          
          {inferredResults[index] && (
            <div style={{ 
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: '#d1ecf1', 
              borderRadius: '4px', 
              color: '#0c5460' 
            }}>
              👉 <strong>Thời gian học ước tính: {inferredResults[index].weeklyStudyHours.toFixed(1)} giờ/tuần</strong>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ScoreChartPage;
