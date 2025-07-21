import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { savePredictedScore, getChartData } from '../api';

// Interfaces for score prediction
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

type InputMode = 'by-semester' | 'apply-all';

interface GlobalValues {
  familySupport: number;
  commuteHours: number;
  attendance: number;
}

interface SemesterValues {
  [semesterKey: string]: GlobalValues;
}

// FileUploadBox component with real upload functionality
const FileUploadBox: React.FC<{ setActiveTab: (tab: 'guide' | 'upload' | 'overview') => void }> = ({ setActiveTab }) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChartButton, setShowChartButton] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleUploadClick = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    const fileInput = document.getElementById('csv-file-input') as HTMLInputElement;
    fileInput?.click();
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Vui lòng chọn file để upload');
      return;
    }
  
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('❌ Bạn chưa đăng nhập. Vui lòng đăng nhập lại!');
        setIsLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:3000/scores/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,  
        },
        body: formData,
      });
      
      if (response.ok) {
        setMessage('✅ Upload thành công!');
        setShowChartButton(true);
      } else {
        const text = await response.text();
        setMessage(`❌ Upload thất bại: ${text}`);
        setShowChartButton(false);
      }
    } catch (error) {
      setMessage('❌ Có lỗi xảy ra khi upload file');
      setShowChartButton(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
      padding: '40px 20px 60px 20px',
      margin: '0 auto',
      maxWidth: '600px',
      borderRadius: '15px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
    }}>
      <span style={{
        color: '#3C315B',
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        Tải lên file điểm CSV
      </span>
      
      {/* Hidden file input */}
      <input
        id="csv-file-input"
        type="file"
        accept=".csv,.tsv"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      {/* Message display */}
      {message && (
        <div style={{
          padding: '12px 20px',
          margin: '0 0 20px 0',
          borderRadius: '8px',
          backgroundColor: message.includes('thành công') ? '#d1fae5' : '#fee2e2',
          color: message.includes('thành công') ? '#065f46' : '#dc2626',
          border: `1px solid ${message.includes('thành công') ? '#a7f3d0' : '#fca5a5'}`,
          fontSize: '14px',
          fontWeight: '500',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          {message}
        </div>
      )}
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 60px 60px 60px',
          borderRadius: '12px',
          border: file ? '2px solid #10b981' : '2px dashed #d1d5db',
          backgroundColor: file ? '#f0fdf4' : 'white',
          minWidth: '400px',
          transition: 'all 0.3s ease'
        }}>
          <button
            type="button"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: file ? '#10b981' : '#3C315B',
              padding: '15px',
              marginBottom: '20px',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              width: '60px',
              height: '60px',
              transition: 'transform 0.2s ease'
            }}
            onClick={handleUploadClick}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          
          >
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/c0gf0356_expires_30_days.png"
              style={{ width: '28px', height: '28px', objectFit: 'contain' }}
              alt="Upload Icon"
            />
          </button>
          
          {file ? (
            <div style={{ textAlign: 'center' }}>
              <span style={{
                color: '#065f46',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px',
                display: 'block'
              }}>
                ✅ File đã chọn: {file.name}
              </span>
              <span style={{
                color: '#6b7280',
                fontSize: '14px'
              }}>
                Kích thước: {(file.size / 1024).toFixed(2)} KB
              </span>
            </div>
          ) : (
            <>
              <span style={{
                color: '#374151',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                Kéo thả file CSV vào đây hoặc
              </span>
              
              <button
                type="button"
                style={{
                  backgroundColor: '#3C315B',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={handleUploadClick}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d1b4e'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3C315B'}
              >
                Chọn file
              </button>
            </>
          )}
        </div>
        
        <span style={{
          color: '#6b7280',
          fontSize: '14px',
          textAlign: 'center',
          marginTop: '15px',
          maxWidth: '300px',
          lineHeight: '1.4'
        }}>
          Chỉ hỗ trợ file .csv từ Student Grade Extractor
        </span>
      </div>
      
      {/* Upload and navigation buttons */}
      {file && (
        <div style={{
          marginTop: '30px',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            type="button"
            onClick={handleUpload}
            disabled={isLoading}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              backgroundColor: isLoading ? '#6b7280' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? 'Đang upload...' : 'Upload File'}
          </button>
          
          {showChartButton && (
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                padding: '12px 30px',
                fontSize: '16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Xem Tổng Quan
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Score Prediction Component
const ScorePredictionComponent: React.FC = () => {
  const navigate = useNavigate();
  
  // Score prediction states
  const [scoreData, setScoreData] = useState<ScoreData[]>([]);
  const [gpaStats, setGpaStats] = useState<GPAStats | null>(null);
  const [predictedScores, setPredictedScores] = useState<{ [index: number]: number }>({});
  const [supportValues, setSupportValues] = useState<{ [index: number]: number }>({});
  const [commuteValues, setCommuteValues] = useState<{ [index: number]: number }>({});
  const [attendanceValues, setAttendanceValues] = useState<{ [index: number]: number }>({});
  const [rawScores, setRawScores] = useState<{ [index: number]: number }>({});
  const [inferredResults, setInferredResults] = useState<{ [index: number]: { weeklyStudyHours: number } }>({});
  const [saving, setSaving] = useState<{ [index: number]: boolean }>({});

  // Input mode states
  const [inputMode, setInputMode] = useState<InputMode>('by-semester');
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

      // Step 2: Call prediction API
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

        // Step 3: Save to backend database
        try {
          await savePredictedScore({
            semesterNumber: item.semesterNumber,
            year: item.year || '2024-2025',
            courseCode: item.courseCode,
            predictedScore: predictedScore,
            weeklyStudyHours: weeklyStudyHours,
            attendancePercentage: attendance,
            commuteTimeMinutes: commute,
            familySupport: support,
            studyFormat: item.studyFormat,
            creditsUnit: item.creditsUnit,
          });

          // Step 4: Refetch GPA stats
          const updatedResponse = await getChartData();
          const updatedData = updatedResponse.data;
          if (updatedData.gpaStats) {
            setGpaStats(updatedData.gpaStats);
          }

          console.log('✅ Prediction saved successfully!');
        } catch (saveError) {
          console.error('❌ Error saving prediction:', saveError);
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
        
        if (responseData.chartData && responseData.gpaStats) {
          setScoreData(responseData.chartData);
          setGpaStats(responseData.gpaStats);
        } else {
          setScoreData(responseData);
        }

        const data = responseData.chartData || responseData;
        if (Array.isArray(data)) {
          const uniqueSemesters = [...new Set(data.map((item: ScoreData) => item.semester))].filter((s): s is string => typeof s === 'string');
          setAvailableSemesters(uniqueSemesters);

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
    
    if (newMode === 'apply-all') {
      applyGlobalValues();
    } else if (newMode === 'by-semester') {
      applySemesterValues();
    }
  };

  const handleGlobalValueChange = (field: keyof GlobalValues, value: number) => {
    const newGlobalValues = { ...globalValues, [field]: value };
    setGlobalValues(newGlobalValues);
    
    if (inputMode === 'apply-all') {
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

  if (scoreData.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px',
        backgroundColor: '#f8fafc',
        borderRadius: '15px',
        border: '2px dashed #d1d5db'
      }}>
        <h3 style={{ color: '#374151', marginBottom: '10px' }}>📊 Chưa có dữ liệu điểm số</h3>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
          Vui lòng tải lên file CSV từ tab "Nhập Bảng Điểm" trước khi sử dụng tính năng dự đoán.
        </p>
        <button
          onClick={() => navigate('/prediction-details')}
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Xem Biểu Đồ
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#3C315B' }}>🎯 Dự đoán điểm số</h2>
      <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center' }}>
        Chọn chế độ nhập và điền thông tin để dự đoán điểm số. Kết quả sẽ được lưu tự động.
      </p>

      {/* GPA Summary */}
      {gpaStats && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '12px', 
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>GPA Hiện tại</h4>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1976d2' }}>
              {gpaStats.cumulativeGPA.toFixed(2)}
            </p>
            <small style={{ color: '#666' }}>{gpaStats.completedCourses}/{gpaStats.totalCourses} môn</small>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#43a047' }}>GPA Dự đoán</h4>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#43a047' }}>
              {gpaStats.predictedGPA.toFixed(2)}
            </p>
            <small style={{ color: '#666' }}>Toàn Kỳ</small>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#ff9800' }}>Tín chỉ</h4>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#ff9800' }}>
              {gpaStats.totalCompletedCredits}/{gpaStats.totalCredits}
            </p>
            <small style={{ color: '#666' }}>Hoàn thành/Tổng</small>
          </div>
        </div>
      )}

      {/* Mode Selector */}
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '25px', 
        borderRadius: '12px', 
        marginBottom: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333', textAlign: 'center' }}>🎯 Chế độ nhập liệu</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '10px 15px', backgroundColor: inputMode === 'by-semester' ? '#fff8e1' : '#f8f9fa', borderRadius: '8px', border: inputMode === 'by-semester' ? '2px solid #ffc107' : '2px solid transparent' }}>
            <input
              type="radio"
              name="inputMode"
              value="by-semester"
              checked={inputMode === 'by-semester'}
              onChange={(e) => handleModeChange(e.target.value as InputMode)}
              style={{ marginRight: '10px' }}
            />
            <span style={{ fontWeight: 'bold' }}>🟨 Theo học kỳ</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '10px 15px', backgroundColor: inputMode === 'apply-all' ? '#e3f2fd' : '#f8f9fa', borderRadius: '8px', border: inputMode === 'apply-all' ? '2px solid #2196f3' : '2px solid transparent' }}>
            <input
              type="radio"
              name="inputMode"
              value="apply-all"
              checked={inputMode === 'apply-all'}
              onChange={(e) => handleModeChange(e.target.value as InputMode)}
              style={{ marginRight: '10px' }}
            />
            <span style={{ fontWeight: 'bold' }}>🟦 Áp dụng cho tất cả</span>
          </label>
        </div>
      </div>

      {/* Global Input Mode */}
      {inputMode === 'apply-all' && (
        <div style={{ 
          backgroundColor: '#e3f2fd', 
          padding: '25px', 
          borderRadius: '12px', 
          marginBottom: '30px',
          border: '2px solid #2196f3'
        }}>
          <h4 style={{ marginBottom: '20px', color: '#1976d2', textAlign: 'center' }}>🟦 Giá trị áp dụng cho tất cả môn học</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <label style={{ fontWeight: 'bold' }}>
              Hỗ trợ gia đình:
              <select 
                value={globalValues.familySupport} 
                onChange={(e) => handleGlobalValueChange('familySupport', parseInt(e.target.value))}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '5px' }}
              >
                <option value={0}>Thấp</option>
                <option value={1}>Trung bình</option>
                <option value={2}>Cao</option>
                <option value={3}>Rất cao</option>
              </select>
            </label>
            <label style={{ fontWeight: 'bold' }}>
              Thời Gian Đi Làm (giờ/tuần):
              <input
                type="number"
                min={0}
                max={40}
                value={globalValues.commuteHours}
                onChange={(e) => handleGlobalValueChange('commuteHours', parseInt(e.target.value))}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '5px' }}
                placeholder="0-40 giờ"
              />
            </label>
            <label style={{ fontWeight: 'bold' }}>
              Tỷ lệ chuyên cần (%):
              <input
                type="number"
                min={50}
                max={100}
                value={globalValues.attendance}
                onChange={(e) => handleGlobalValueChange('attendance', parseInt(e.target.value))}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '5px' }}
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
          padding: '25px', 
          borderRadius: '12px', 
          marginBottom: '30px',
          border: '2px solid #ffc107'
        }}>
          <h4 style={{ marginBottom: '20px', color: '#f57c00', textAlign: 'center' }}>🟨 Nhập theo học kỳ</h4>
          {availableSemesters.map(semester => (
            <div key={semester} style={{ 
              marginBottom: '25px', 
              padding: '20px', 
              backgroundColor: '#fff',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <h5 style={{ marginBottom: '15px', color: '#333', textAlign: 'center' }}>📚 {semester}</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                <label style={{ fontWeight: 'bold' }}>
                  Hỗ trợ gia đình:
                  <select 
                    value={semesterValues[semester]?.familySupport ?? 1} 
                    onChange={(e) => handleSemesterValueChange(semester, 'familySupport', parseInt(e.target.value))}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '5px' }}
                  >
                    <option value={0}>Thấp</option>
                    <option value={1}>Trung bình</option>
                    <option value={2}>Cao</option>
                    <option value={3}>Rất cao</option>
                  </select>
                </label>
                <label style={{ fontWeight: 'bold' }}>
                  Đi làm (giờ/tuần):
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={semesterValues[semester]?.commuteHours ?? 0}
                    onChange={(e) => handleSemesterValueChange(semester, 'commuteHours', parseInt(e.target.value))}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '5px' }}
                  />
                </label>
                <label style={{ fontWeight: 'bold' }}>
                  Chuyên cần (%):
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={semesterValues[semester]?.attendance ?? 90}
                    onChange={(e) => handleSemesterValueChange(semester, 'attendance', parseInt(e.target.value))}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '5px' }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Navigation to Chart - Moved to bottom */}
      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '30px' }}>
        <button
          onClick={() => navigate('/prediction-details')}
          style={{
            padding: '15px 40px',
            fontSize: '18px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
            marginBottom: '10px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          📊 Xem Biểu Đồ Chi Tiết
        </button>
        <p style={{ color: '#666', fontSize: '14px', margin: '0' }}>
          Xem biểu đồ trực quan về tiến độ học tập và phân tích chi tiết
        </p>
      </div>
    </div>
  );
};

function Landing() {
  const [activeTab, setActiveTab] = useState<'guide' | 'upload' | 'overview'>('guide');

  const buttonStyles = {
    padding: '12px 30px',
    fontSize: '16px',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    margin: '0 10px',
    border: 'none'
  };

  const activeButtonStyle = {
    ...buttonStyles,
    backgroundColor: '#3C315B',
    color: 'white'
  };

  const inactiveButtonStyle = {
    ...buttonStyles,
    backgroundColor: '#ECEAF2',
    color: 'black'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 50px',
        backgroundColor: 'white',
        boxShadow: '0px 1px 0px rgba(0,0,0,0.1)',
        marginBottom: '47px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/gag6rxpd_expires_30_days.png"
            style={{ width: '105px', height: '66px', objectFit: 'fill' }}
            alt="Logo"
          />
          <span style={{ 
            color: '#3C315B', 
            fontSize: '25px', 
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: '1.2'
          }}>
            SCORE<br/>PREDICT
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#3C315B', fontSize: '20px', fontWeight: 'bold' }}>
            Our Features
          </span>
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/ijefief7_expires_30_days.png"
            style={{ width: '12px', height: '7px' }}
            alt="arrow"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '60px', 
        marginBottom: '62px' 
      }}>
        <button
          style={activeTab === 'guide' ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => setActiveTab('guide')}
        >
          Hướng Dẫn
        </button>
        <button
          style={activeTab === 'upload' ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => setActiveTab('upload')}
        >
          Nhập Bảng Điểm
        </button>
        <button
          style={activeTab === 'overview' ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => setActiveTab('overview')}
        >
          Tổng Quan
        </button>
      </div>

      {/* Content Based on Active Tab */}
      {activeTab === 'guide' && (
        <div style={{ padding: '0 140px' }}>
          <h2 style={{ 
            color: '#3C315B', 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '22px',
            marginLeft: '53px'
          }}>
            Hướng dẫn sử dụng hệ thống
          </h2>

          {/* Step 1 */}
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '24px',
            marginBottom: '32px',
            borderRadius: '15px',
            marginLeft: '0',
            marginRight: '124px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
              <button style={{
                backgroundColor: '#3C315B',
                color: 'white',
                padding: '6px 17px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                1
              </button>
              <span style={{ color: '#3C315B', fontSize: '20px', fontWeight: 'bold' }}>
                Tải Student Grade Extractor 1.0
              </span>
            </div>
            <p style={{ color: '#374151', fontSize: '16px', marginBottom: '12px', marginLeft: '84px' }}>
              Tải và cài đặt tiện ích Student Grade Extractor 1.0 về máy tính của bạn từ Chrome Web Store hoặc Firefox Add-ons.
            </p>
            <div style={{
              backgroundColor: '#eef2ff',
              padding: '12px',
              borderRadius: '8px',
              marginLeft: '84px',
              display: 'flex',
              gap: '4px'
            }}>
              <span style={{ color: '#1e40af', fontSize: '14px', fontWeight: 'bold' }}>Lưu ý:</span>
              <span style={{ color: '#1e40af', fontSize: '14px' }}>
                Đảm bảo tiện ích được kích hoạt trong trình duyệt của bạn sau khi cài đặt.
              </span>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '24px',
            marginBottom: '53px',
            borderRadius: '15px',
            marginRight: '124px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
              <button style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '6px 15px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                2
              </button>
              <span style={{ color: '#3C315B', fontSize: '20px', fontWeight: 'bold' }}>
                Truy cập MyDTU và trích xuất điểm
              </span>
            </div>
            <p style={{ color: '#374151', fontSize: '16px', marginBottom: '16px', marginLeft: '84px' }}>
              Thực hiện các bước sau để trích xuất điểm số:
            </p>

            {[
              "Đăng nhập vào tài khoản MyDTU của bạn",
              'Vào mục "Học tập" trong menu chính',
              'Chọn "Bảng điểm" để xem điểm số của bạn',
              "Nhấp vào biểu tượng Extension trên thanh công cụ trình duyệt",
              'Chọn "Student Grade Extractor 1.0" từ danh sách tiện ích',
              'Nhấp vào nút "Trích xuất & Tải CSV"',
            ].map((text, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
                marginLeft: '84px',
                gap: '12px'
              }}>
                <div style={{
                  backgroundColor: '#10b981',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%'
                }} />
                <span style={{ color: '#374151', fontSize: '15px' }}>{text}</span>
              </div>
            ))}

            <div style={{
              backgroundColor: '#fef3c7',
              padding: '12px',
              borderRadius: '8px',
              marginLeft: '84px',
              display: 'flex',
              gap: '9px'
            }}>
              <span style={{ color: '#92400e', fontSize: '14px', fontWeight: 'bold' }}>Quan trọng:</span>
              <span style={{ color: '#92400e', fontSize: '14px' }}>
                File CSV sẽ được tải xuống máy tính của bạn. Hãy ghi nhớ vị trí lưu file để sử dụng ở bước tiếp theo.
              </span>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '24px',
            marginBottom: '72px',
            borderRadius: '15px',
            marginRight: '124px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
              <button style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '6px 15px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                3
              </button>
              <span style={{ color: '#3C315B', fontSize: '20px', fontWeight: 'bold' }}>
                Chuyển đến trang nhập điểm
              </span>
            </div>
            <p style={{ color: '#374151', fontSize: '16px', marginBottom: '16px', marginLeft: '84px' }}>
              Sau khi đã có file CSV, chuyển đến trang "Nhập bảng điểm" để tải lên và phân tích dữ liệu điểm số của bạn.
            </p>
            <button
              onClick={() => setActiveTab('upload')}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginLeft: '84px'
              }}
            >
              Chuyển đến trang nhập bảng điểm →
            </button>
          </div>
        </div>
      )}

      {activeTab === 'upload' && (
        <div style={{ 
          padding: '0 140px',
          minHeight: '60vh'
        }}>
          <h2 style={{ 
            color: '#3C315B', 
            fontSize: '2.5rem', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Xin chào! 👋
          </h2>
          
          <p style={{ 
            color: '#666', 
            fontSize: '1.2rem', 
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            Chào mừng bạn đến với ứng dụng dự đoán điểm số!
          </p>
          
          <FileUploadBox setActiveTab={setActiveTab} />    
        </div>
      )}

      {activeTab === 'overview' && (
        <div style={{ 
          padding: '0 40px',
          minHeight: '60vh'
        }}>
          <ScorePredictionComponent />
        </div>
      )}
    </div>
  );
}

export default Landing;