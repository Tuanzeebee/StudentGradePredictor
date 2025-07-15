import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScoreChart from '../components/ScoreChart';

interface ScoreData {
  courseCode: string;
  semester: string;
  actual?: number;
  predicted?: number;
  semesterNumber: number;
  studyFormat: string;
  creditsUnit: number;
}

const ScoreChartPage: React.FC = () => {
  const navigate = useNavigate();
  const [scoreData, setScoreData] = useState<ScoreData[]>([]);
  const [totalGPA, setTotalGPA] = useState<number>(0);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [predictedScores, setPredictedScores] = useState<{ [index: number]: number }>({});
  const [supportValues, setSupportValues] = useState<{ [index: number]: number }>({});
  const [commuteValues, setCommuteValues] = useState<{ [index: number]: number }>({});
  const [attendanceValues, setAttendanceValues] = useState<{ [index: number]: number }>({});
  const [rawScores, setRawScores] = useState<{ [index: number]: number }>({});
  const [inferredResults, setInferredResults] = useState<{ [index: number]: { weeklyStudyHours: number } }>({});

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

      const sxa = weeklyStudyHours * (attendance / 100);
      const sxp = weeklyStudyHours * commute;
      const fxp = support * commute;
      const axs = (attendance / 100) * support;
      const full = weeklyStudyHours * (attendance / 100) * commute * support;

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
          study_hours_x_attendance: sxa,
          study_hours_x_part_part_time_hours: sxp,
          family_support_x_part_time_hours: fxp,
          attendance_x_support: axs,
          full_interaction_feature: full,
        }),
      });

      const predictResult = await predictRes.json();
      if (predictResult.predicted_score !== undefined) {
        setPredictedScores(prev => ({ ...prev, [index]: predictResult.predicted_score }));
      }

    } catch (err) {
      console.error("❌ Lỗi dự đoán:", err);
    }
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const res = await fetch("http://localhost:3000/scores/chart-data", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) throw new Error("Dữ liệu lỗi");

      setScoreData(data);

      const rawMap: { [index: number]: number } = {};
      data.forEach((item, idx) => {
        if (item.actual != null) rawMap[idx] = item.actual;
      });
      setRawScores(rawMap);

      const validScores = data.filter((item) => item.actual && item.actual > 0);
      const totalScore = validScores.reduce((sum, item) => sum + (item.actual || 0), 0);
      setTotalGPA(validScores.length ? totalScore / validScores.length : 0);
      setTotalCourses(validScores.length);
    } catch (err) {
      console.error("Lỗi fetch chart-data:", err);
    }
  };

  fetchData();
}, []);

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

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8f9fa' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Biểu Đồ Điểm Số</h1>
      <ScoreChart />
      {scoreData.map((item, index) => (
        <div key={index} style={{ background: '#fff', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
          <h4>Môn: {item.courseCode} – {item.semester}</h4>
          <p>Raw Score: {rawScores[index] ?? '—'}</p>
<label><strong>Hỗ trợ gia đình:</strong><br/>
  <select value={supportValues[index] ?? 1} onChange={(e) => handleSupportChange(index, parseInt(e.target.value))}>
    <option value={0}>Thấp</option>
    <option value={1}>Trung bình</option>
    <option value={2}>Cao</option>
    <option value={3}>Rất cao</option>
  </select>
</label><br/>
      <label><strong>Thời Gian Đi Làm (giờ/tuần):</strong><br/>
        <input
          type="number"
          min={0}
          max={40}
          value={commuteValues[index] ?? ''}
          onChange={(e) => handleCommuteChange(index, parseInt(e.target.value))}
        />
      </label><br/>

      <label><strong>Tỷ lệ chuyên cần (%):</strong><br/>
        <input
          type="number"
          min={50}
          max={100}
          value={attendanceValues[index] ?? ''}
          onChange={(e) => handleAttendanceChange(index, parseInt(e.target.value))}
        />
      </label>
          
          {predictedScores[index] !== undefined && (
            <div style={{ marginTop: '10px', color: '#28a745' }}>
              🎯 Điểm dự đoán: {predictedScores[index].toFixed(2)}
            </div>
          )}
          {inferredResults[index] && (
            <div style={{ marginTop: '10px', color: '#007bff' }}>
              👉 Thời gian học ước tính: {inferredResults[index].weeklyStudyHours.toFixed(1)} giờ/tuần
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ScoreChartPage;
