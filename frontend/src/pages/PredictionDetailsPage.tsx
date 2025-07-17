/**
 * PredictionDetailsPage.tsx
 * 
 * 🎯 Comprehensive Student Grade Analysis Dashboard
 * 
 * This page consolidates chart and analysis functionality from ScoreChartPage.tsx and ScoreChart.tsx
 * into a unified, single-page dashboard with the following capabilities:
 * 
 * 📊 Features:
 * ✅ User authentication with token validation
 * ✅ Unified single-page layout (no tabs)
 * ✅ GPA overview with real-time statistics
 * ✅ Interactive charts with Recharts integration
 * ✅ Detailed subject table with trend analysis
 * ✅ Data visualization and statistical insights
 * 
 * 🏗️ Architecture:
 * - Uses detailscore components for modular UI
 * - Integrates with backend API for data retrieval
 * - Handles authentication and error states
 * - Single-page layout with vertical sections
 * 
 * 🔧 Components Used:
 * - HeaderBar: Navigation and logout functionality
 * - GPAOverview: Statistical overview with real data
 * - PredictionChart: Enhanced chart display with progress tracking
 * - SubjectTable: Detailed tabular view with trend indicators
 * 
 * 📈 Page Layout (Top to Bottom):
 * 1. 📊 Tổng quan GPA - Statistical overview section
 * 2. 📈 Biểu đồ điểm - Interactive charts section
 * 3. 📋 Bảng chi tiết - Subject table section
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getChartData, getGPAStats } from '../api';
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
import HeaderBar from "../components/detailscore/HeaderBar";
import GPAOverview from "../components/detailscore/GPAOverview";
import SubjectTable from "../components/detailscore/SubjectTable";
import PredictionChart from "../components/detailscore/PredictionChart";

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

const PredictionDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [scoreData, setScoreData] = useState<ScoreData[]>([]);
  const [gpaStats, setGpaStats] = useState<GPAStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Chart display states
  const [showGPA, setShowGPA] = useState(false);
  const [showGPAStats, setShowGPAStats] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [chartResponse, gpaResponse] = await Promise.all([
        getChartData(),
        getGPAStats()
      ]);

      const chartData = chartResponse.data;
      
      // Handle new response structure
      if (chartData.chartData && chartData.gpaStats) {
        setScoreData(chartData.chartData);
        setGpaStats(chartData.gpaStats);
      } else {
        setScoreData(chartData);
        setGpaStats(gpaResponse.data);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      if ((error as any)?.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [navigate]);

  // Chart rendering function
  const renderChart = () => {
    if (!scoreData.length) return null;

    const chartData = scoreData.map((item) => ({
      name: item.courseCode,
      semester: item.semester,
      actual: showGPA ? item.actualGPA : item.actual,
      predicted: showGPA ? item.predictedGPA : item.predicted,
    }));

    return (
      <div style={{ width: '100%', marginTop: '20px' }}>
        <div style={{ marginBottom: '15px', display: 'flex', gap: '15px', alignItems: 'center' }}>
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

        {gpaStats && showGPAStats && (
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

        <div style={{ width: '100%', height: 400, backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, showGPA ? 4 : 10]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#2563eb" 
                strokeWidth={2}
                name={showGPA ? "GPA Thực tế" : "Điểm Thực tế"}
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name={showGPA ? "GPA Dự đoán" : "Điểm Dự đoán"}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (!scoreData.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Chưa có dữ liệu điểm</h2>
          <p className="text-gray-600 mb-6">Vui lòng upload file điểm để xem chi tiết dự đoán</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white">
      <div className="self-stretch bg-white min-h-screen">
        <HeaderBar />
        <div className="flex flex-col self-stretch bg-slate-50 pt-[47px] pb-[92px] mx-[91px] gap-6">
          
          {/* 📊 Tổng quan GPA */}
          <GPAOverview gpaStats={gpaStats} />

          {/* 📈 Biểu đồ điểm */}
          <div>
            <PredictionChart scoreData={scoreData} />
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginTop: '20px' }}>
              <h2 style={{ marginBottom: '20px', color: '#3C315B' }}>Biểu đồ tương tác</h2>
              {renderChart()}
            </div>
          </div>

          {/* 📋 Bảng chi tiết */}
          <SubjectTable scoreData={scoreData} />

        </div>
      </div>
    </div>
  );
};

export default PredictionDetailsPage;
