import React from "react";
import { useNavigate } from "react-router-dom";

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

interface GPAOverviewProps {
  gpaStats: GPAStats | null;
}

const GPAOverview: React.FC<GPAOverviewProps> = ({ gpaStats }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/landing');
  };

  const currentGPA = gpaStats?.cumulativeGPA || 0;
  const predictedGPA = gpaStats?.predictedGPA || 0;

  return (
    <div className="flex flex-col self-stretch bg-white pt-6 pb-14 ml-6 mr-[9px] gap-6 rounded-[20px]">
      <div className="flex items-center self-stretch mx-6">
        <span className="flex-1 text-[#3C315B] text-2xl font-bold">Phân tích chi tiết dự đoán điểm</span>
        <button
          className="flex flex-col shrink-0 items-start bg-gray-500 text-left py-2 px-4 rounded-lg border-0"
          onClick={handleGoBack}
        >
          <span className="text-white text-sm font-bold">← Quay lại</span>
        </button>
      </div>
      <div className="flex items-start self-stretch mx-6 gap-5">
        <div className="flex flex-1 flex-col items-start bg-indigo-50 py-5 rounded-xl">
          <div className="flex items-center self-stretch mb-[7px] mx-6">
            <span className="flex-1 text-gray-700 text-sm font-bold">GPA Hiện tại</span>
            <button
              className="flex flex-col shrink-0 items-start bg-blue-500 text-left p-2 rounded-lg border-0"
              onClick={() => alert("GPA hiện tại: " + currentGPA.toFixed(2))}
            >
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/7afvvb2b_expires_30_days.png"
                className="w-4 h-4 object-fill"
                alt="Info"
              />
            </button>
          </div>
          <span className="text-blue-500 text-[28px] font-bold ml-6">{currentGPA.toFixed(2)}</span>
          <span className="text-gray-500 text-xs ml-6">Trên thang điểm 10</span>
        </div>

        <div className="flex flex-1 flex-col items-start bg-green-50 py-5 rounded-xl">
          <div className="flex items-center self-stretch mb-[7px] mx-6">
            <span className="flex-1 text-gray-700 text-sm font-bold">GPA Dự đoán</span>
            <button
              className="flex flex-col shrink-0 items-start bg-emerald-500 text-left p-2 rounded-lg border-0"
              onClick={() => alert("GPA dự đoán: " + predictedGPA.toFixed(2))}
            >
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/vmpuetjr_expires_30_days.png"
                className="w-4 h-4 object-fill"
                alt="Info"
              />
            </button>
          </div>
          <span className="text-emerald-500 text-[28px] font-bold ml-6">{predictedGPA.toFixed(2)}</span>
          <span className="text-gray-500 text-xs ml-6">Ước tính cuối kỳ</span>
        </div>

        <div className="flex flex-1 flex-col items-start bg-amber-100 py-5 rounded-xl">
          <div className="flex items-center self-stretch mb-[7px] mx-6">
            <span className="flex-1 text-gray-700 text-sm font-bold">Tín chỉ hiện tại</span>
            <button
              className="flex flex-col shrink-0 items-start bg-[#F59E0B] text-left p-2 rounded-lg border-0"
              onClick={() => alert(`Đã hoàn thành: ${gpaStats?.totalCompletedCredits || 0} tín chỉ`)}
            >
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/gfavdrfj_expires_30_days.png"
                className="w-4 h-4 object-fill"
                alt="Info"
              />
            </button>
          </div>
          <span className="text-[#F59E0B] text-[28px] font-bold ml-6">{gpaStats?.totalCompletedCredits || 0}</span>
          <span className="text-gray-500 text-xs ml-6">Đã hoàn thành</span>
        </div>

        <div className="flex flex-1 flex-col items-start bg-pink-50 py-5 rounded-xl">
          <div className="flex items-center self-stretch mb-[7px] mx-6">
            <span className="flex-1 text-gray-700 text-sm font-bold">Tín chỉ còn lại</span>
            <button
              className="flex flex-col shrink-0 items-start bg-pink-500 text-left p-2 rounded-lg border-0"
              onClick={() => alert(`Còn lại: ${(gpaStats?.totalCredits || 0) - (gpaStats?.totalCompletedCredits || 0)} tín chỉ`)}
            >
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/x3o9zcdr_expires_30_days.png"
                className="w-4 h-4 object-fill"
                alt="Info"
              />
            </button>
          </div>
          <span className="text-pink-500 text-[28px] font-bold ml-6">{(gpaStats?.totalCredits || 0) - (gpaStats?.totalCompletedCredits || 0)}</span>
          <span className="text-gray-500 text-xs ml-6">Cần hoàn thành</span>
        </div>
      </div>
    </div>
  );
};

export default GPAOverview;
