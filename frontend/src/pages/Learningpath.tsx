// Placeholder SVG data URLs for icons
const placeholderIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAxNCAxNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNyAxIDEzIDcgNyAxMyAxIDciIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==";

// Define vector icons as placeholders
const vector = placeholderIcon;
const image = placeholderIcon;
const vector2 = placeholderIcon;
const vector3 = placeholderIcon;
const vector4 = placeholderIcon;
const vector5 = placeholderIcon;
const vector6 = placeholderIcon;
const vector7 = placeholderIcon;

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getLearningPath } from '../api';

interface LearningPathData {
  courseCode: string;
  courseName: string;
  creditUnits: number;
  predictedScore: number;
  currentStatus: {
    weeklyStudyTime: number;
    attendancePercentage: number;
    commuteTimeMinutes: number;
    recommendedTotalHours: number;
    currentTotalHours: number;
  };
  recommendations: {
    onTrack: boolean;
    message: string;
    suggestedWeeklyHours: number;
  };
  userProfile: {
    totalCompletedCourses: number;
    averagePerformance: number;
    studyPatterns: {
      avgWeeklyStudyHours: number;
      avgAttendancePercentage: number;
      avgCommuteTime: number;
    };
  };
}

const Learningpath = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [learningData, setLearningData] = useState<LearningPathData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get courseCode from URL parameters
  const courseCode = searchParams.get('courseCode');

  useEffect(() => {
    const fetchLearningPath = async () => {
      if (!courseCode) {
        setError('Course code is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getLearningPath(courseCode);
        setLearningData(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching learning path:', error);
        setError('Failed to load learning path data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningPath();
  }, [courseCode]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg mb-4">Đang tải dữ liệu học tập...</div>
        </div>
      </div>
    );
  }

  if (error || !learningData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600 mb-6">{error || 'Không thể tải dữ liệu lộ trình học tập'}</p>
          <button
            onClick={() => navigate('/prediction-details')}
            className="tailwind-button px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors border-0 cursor-pointer"
          >
            Back to Course List
          </button>
        </div>
      </div>
    );
  }
  // Navigation functions
  const handleBackToCourseList = () => {
    navigate('/prediction-details');
  };

  const handleDownloadStudyPlan = () => {
    if (!learningData) return;
    
    // Create a simple text version of the study plan
    const studyPlanText = `Kế hoạch học tập - ${learningData.courseName}
    
Thời gian học hàng tuần: ${learningData.currentStatus.weeklyStudyTime} giờ
Tỷ lệ tham dự: ${learningData.currentStatus.attendancePercentage}%
Thời gian đi làm: ${learningData.currentStatus.commuteTimeMinutes} phút
Tổng giờ đã lên kế hoạch: ${learningData.currentStatus.currentTotalHours} giờ
Tổng giờ được khuyến nghị: ${learningData.currentStatus.recommendedTotalHours} giờ
Điểm dự đoán: ${learningData.predictedScore}

Kế hoạch học tập:
${studyPlanItems.map((item, index) => `
${index + 1}. ${item.title}
   ${item.description}
   Trạng thái: ${item.completed ? 'Hoàn thành' : 'Đang chờ'}
`).join('')}

Mẹo học tập:
${studyTips.map(tip => `
- ${tip.title}: ${tip.description}
`).join('')}

Khuyến nghị:
${learningData.recommendations.message}
Giờ học hàng tuần được đề xuất: ${learningData.recommendations.suggestedWeeklyHours}h
    `;

    const blob = new Blob([studyPlanText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${learningData.courseCode}-Study-Plan.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  // Study plan data
  const studyPlanItems = [
    {
      id: 1,
      title: "Chương 1: Biến và Kiểu dữ liệu",
      description: "3 giờ • Hiểu những điều cơ bản",
      completed: true,
      icon: vector,
    },
    {
      id: 2,
      title: "Chương 2: Cấu trúc điều khiển",
      description: "4 giờ • Áp dụng logic",
      completed: false,
      icon: image,
    },
    {
      id: 3,
      title: "Chương 3: Hàm và Mảng",
      description: "5 giờ • Xây dựng code có thể tái sử dụng",
      completed: false,
      icon: vector2,
    },
    {
      id: 4,
      title: "Ôn tập và Thực hành Giữa kỳ",
      description: "6 giờ • Củng cố kiến thức",
      completed: false,
      icon: vector3,
    },
  ];

  // Calculate progress
  const completedItems = studyPlanItems.filter(item => item.completed).length;
  const progressPercentage = Math.round((completedItems / studyPlanItems.length) * 100);

  // Study tips data
  const studyTips = [
    {
      title: "Quản lý thời gian",
      description:
        "Sử dụng phiên học 25 phút theo phương pháp Pomodoro với nghỉ 5 phút để tập trung",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-500",
      textColor: "text-blue-700",
      icon: vector4,
    },
    {
      title: "Chiến lược thực hành",
      description:
        "Hoàn thành bài tập lập trình ngay sau khi học xong từng chủ đề",
      bgColor: "bg-green-50",
      iconBg: "bg-emerald-500",
      textColor: "text-emerald-800",
      icon: vector5,
    },
    {
      title: "Trợ lý AI",
      description: "Sử dụng công cụ AI để làm rõ nhanh và trợ giúp gỡ lỗi",
      bgColor: "bg-amber-100",
      iconBg: "bg-amber-500",
      textColor: "text-amber-800",
      icon: vector6,
    },
    {
      title: "Nhóm học tập",
      description:
        "Tham gia các phiên học tập cộng tác để hiểu rõ hơn",
      bgColor: "bg-pink-50",
      iconBg: "bg-pink-500",
      textColor: "text-pink-700",
      icon: vector7,
    },
  ];

  // Profile recommendations data - dynamic based on user data
  const profileRecommendations = learningData ? [
    `Dựa trên ${learningData.userProfile.totalCompletedCourses} môn đã hoàn thành, hãy duy trì mô hình học tập nhất quán`,
    `Hiệu suất trung bình của bạn là ${learningData.userProfile.averagePerformance.toFixed(1)} - ${learningData.recommendations.message}`,
    `Tối ưu hóa thời gian đi lại ${Math.round(learningData.currentStatus.commuteTimeMinutes)} phút để ôn tập bài`,
  ] : [
    "Tập trung vào các khái niệm chính và sử dụng kỹ thuật ghi nhớ chủ động",
    "Ôn tập các chương trước hàng tuần để duy trì khả năng ghi nhớ", 
    "Lên lịch học tập vào thời gian cố định để xây dựng thói quen",
  ];

  // Summary data - dynamic based on learning data
  const summaryData = learningData ? [
    { label: "Thời gian học hàng tuần:", value: `${learningData.currentStatus.weeklyStudyTime} giờ` },
    { label: "Tỷ lệ tham dự:", value: `${learningData.currentStatus.attendancePercentage}%` },
    { label: "Thời gian đi lại:", value: `${learningData.currentStatus.commuteTimeMinutes} phút` },
    { label: "Tổng giờ khuyến nghị:", value: `${Math.round(learningData.currentStatus.weeklyStudyTime * 2.5)} giờ` },
    { label: "Điểm dự đoán:", value: `${learningData.predictedScore.toFixed(1)}` },
  ] : [
    { label: "Thời gian học hàng tuần:", value: "6 giờ" },
    { label: "Tổng giờ đã lên kế hoạch:", value: "36 giờ" },
    { label: "Tổng giờ khuyến nghị:", value: "15 giờ" },
    { label: "Điểm dự đoán:", value: "7.8" },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-[1272px] h-[1912px]">
        <div className="relative w-[1257px] h-[1912px] bg-white">
          <p 
            className="absolute top-[25px] left-4 [font-family:'Inter-Medium',Helvetica] font-medium text-gray-500 text-sm text-center tracking-[0] leading-5 whitespace-nowrap cursor-pointer hover:text-blue-500 transition-colors"
            onClick={handleBackToCourseList}
          >
            ← Quay về danh sách môn học
          </p>

          <div className="absolute w-[1225px] h-[394px] top-[72px] left-4 bg-white rounded-lg border border-solid border shadow-[0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_1px_2px_#0000001a,0px_1px_3px_#0000001a]">
            <div className="absolute top-[22px] left-6 [font-family:'Inter-Bold',Helvetica] font-bold text-gray-900 text-2xl tracking-[0] leading-8 whitespace-nowrap">
              {learningData?.courseName || 'Loading...'}
            </div>

            <div className="top-[63px] left-6 [font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-sm leading-5 absolute tracking-[0] whitespace-nowrap">
              {learningData?.creditUnits || 3} Tín chỉ
            </div>

            <div className="top-[22px] left-[1167px] [font-family:'Inter-Bold',Helvetica] font-bold text-amber-500 text-2xl text-right leading-8 absolute tracking-[0] whitespace-nowrap">
              {learningData?.predictedScore.toFixed(1) || '0.0'}
            </div>

            <div className="absolute top-[58px] left-[1108px] [font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-xs text-right tracking-[0] leading-4 whitespace-nowrap">
              Điểm dự đoán
            </div>

            <div className="absolute w-[576px] h-[108px] top-[109px] left-[25px] bg-gray-50 rounded-lg">
              <div className="absolute top-[15px] left-4 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-gray-700 text-base tracking-[0] leading-6 whitespace-nowrap">
                Tiến độ học tập
              </div>

              <div className="absolute top-[17px] left-[461px] [font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5 whitespace-nowrap">
                {progressPercentage}% Hoàn thành
              </div>

              <div className="absolute w-[544px] h-2 top-[52px] left-4 bg-gray-200 rounded-[26843500px]">
                <div 
                  className="h-2 bg-blue-500 rounded-[26843500px] transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="absolute w-[576px] h-[108px] top-[109px] left-[624px] bg-gray-50 rounded-lg">
              <div className="absolute top-[15px] left-4 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-gray-700 text-base tracking-[0] leading-6 whitespace-nowrap">
                Phân tích nỗ lực học tập
              </div>

              <div className={`absolute w-3 h-3 top-[52px] left-4 ${learningData?.recommendations.onTrack ? 'bg-emerald-500' : 'bg-red-500'} rounded-[26843500px]`} />

              <p className="absolute top-[47px] left-9 [font-family:'Inter-Regular',Helvetica] font-normal text-black text-sm tracking-[0] leading-5 whitespace-nowrap">
                {learningData?.recommendations.onTrack ? 'Đang đạt yêu cầu' : 'Cần cải thiện nỗ lực'}
              </p>

              <p className="absolute top-[74px] left-4 [font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-xs tracking-[0] leading-4 whitespace-nowrap">
                Hiện tại: {learningData?.currentStatus.weeklyStudyTime.toFixed(1) || '6'}h/tuần | Yêu cầu: {Math.round((learningData?.currentStatus.weeklyStudyTime || 6) * 2.5)}h/tuần
              </p>
            </div>

            <div className="absolute w-[376px] h-20 top-[241px] left-[25px] bg-blue-50 rounded-lg">
              <div className="absolute top-[15px] left-[177px] [font-family:'Inter-Bold',Helvetica] font-bold text-blue-700 text-lg text-center tracking-[0] leading-7 whitespace-nowrap">
                {learningData?.currentStatus.weeklyStudyTime.toFixed(1) || '6'}h
              </div>

              <div className="absolute top-[46px] left-[133px] [font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-xs text-center tracking-[0] leading-4 whitespace-nowrap">
                Thời gian học hàng tuần
              </div>
            </div>

            <div className="absolute w-[376px] h-20 top-[241px] left-[425px] bg-green-50 rounded-lg">
              <div className="top-[15px] left-[152px] [font-family:'Inter-Bold',Helvetica] font-bold text-green-800 text-lg text-center leading-7 absolute tracking-[0] whitespace-nowrap">
                {Math.max(1, Math.round((Math.round((learningData?.currentStatus.weeklyStudyTime || 6) * 2.5)) / (learningData?.currentStatus.weeklyStudyTime || 6)))} weeks
              </div>

              <div className="absolute top-[46px] left-[158px] [font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-xs text-center tracking-[0] leading-4 whitespace-nowrap">
                Thời lượng ước tính
              </div>
            </div>

            <div className="absolute w-[376px] h-20 top-[241px] left-[824px] bg-amber-100 rounded-lg">
              <div className="absolute top-[15px] left-[172px] [font-family:'Inter-Bold',Helvetica] font-bold text-amber-800 text-lg text-center tracking-[0] leading-7 whitespace-nowrap">
                {Math.round((learningData?.currentStatus.weeklyStudyTime || 6) * 2.5)}h
              </div>

              <div className="absolute top-[46px] left-[147px] [font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-xs text-center tracking-[0] leading-4 whitespace-nowrap">
                Tổng giờ yêu cầu
              </div>
            </div>
          </div>

          <div className="absolute w-[1225px] h-[440px] top-[490px] left-4 bg-white rounded-lg border border-solid border shadow-[0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_1px_2px_#0000001a,0px_1px_3px_#0000001a]">
            <div className="absolute top-[22px] left-6 [font-family:'Inter-Bold',Helvetica] font-bold text-gray-900 text-xl tracking-[0] leading-7 whitespace-nowrap">
              Kế hoạch học tập hàng tuần
            </div>

            {studyPlanItems.map((item, index) => (
              <div
                key={item.id}
                className="absolute w-[1175px] h-[78px] rounded-lg border border-solid border"
                style={{ top: `${68 + index * 90}px`, left: '25px' }}
              >
                <div
                  className={`absolute w-8 h-8 top-[23px] left-[17px] ${item.completed ? "bg-blue-500" : "bg-gray-500"} rounded-[26843500px]`}
                >
                  <div className="absolute top-[5px] left-[13px] [font-family:'Inter-Medium',Helvetica] font-medium text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
                    {item.id}
                  </div>
                </div>

                <div className="absolute top-[15px] left-16 [font-family:'Inter-Medium',Helvetica] font-medium text-gray-900 text-base tracking-[0] leading-6 whitespace-nowrap">
                  {item.title}
                </div>

                <p className="absolute top-[39px] left-16 [font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5 whitespace-nowrap">
                  {item.description}
                </p>

                <div
                  className={`absolute w-4 h-2 top-[34px] left-[1113px] ${item.completed ? "bg-emerald-500" : "bg-gray-200"} rounded-[26843500px]`}
                />

                <div className="absolute w-5 h-5 top-7 left-[1137px]">
                  <img
                    className="absolute w-3.5 h-2 top-1.5 left-[3px]"
                    alt="Vector"
                    src={item.icon}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="absolute w-[1225px] h-[462px] top-[954px] left-4 bg-white rounded-lg border border-solid border shadow-[0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_1px_2px_#0000001a,0px_1px_3px_#0000001a]">
            <div className="absolute top-[22px] left-6 [font-family:'Inter-Bold',Helvetica] font-bold text-gray-900 text-xl tracking-[0] leading-7 whitespace-nowrap">
              Mẹo học tập cá nhân hóa
            </div>

            {studyTips.map((tip, index) => {
              const isTopRow = index < 2;
              const leftPosition = isTopRow
                ? index === 0
                  ? 25
                  : 624
                : index === 2
                  ? 25
                  : 624;
              const topPosition = isTopRow ? 76 : 184;

              return (
                <div
                  key={index}
                  className={`absolute w-[576px] h-[84px] ${tip.bgColor} rounded-lg`}
                  style={{ top: `${topPosition}px`, left: `${leftPosition}px` }}
                >
                  <div
                    className={`absolute w-8 h-8 top-4 left-4 ${tip.iconBg} rounded-[26843500px]`}
                  >
                    <div className="relative w-4 h-4 top-2 left-2">
                      <img
                        className="absolute w-3.5 h-3.5 top-px left-px"
                        alt="Vector"
                        src={tip.icon}
                      />
                    </div>
                  </div>

                  <div
                    className={`absolute top-[15px] left-[60px] [font-family:'Inter-Medium',Helvetica] font-medium ${tip.textColor} text-base tracking-[0] leading-6 whitespace-nowrap`}
                  >
                    {tip.title}
                  </div>

                  <p className="absolute top-[47px] left-[60px] [font-family:'Inter-Regular',Helvetica] font-normal text-gray-700 text-sm tracking-[0] leading-5 whitespace-nowrap">
                    {tip.description}
                  </p>
                </div>
              );
            })}

            <div className="absolute w-[1175px] h-36 top-[292px] left-[25px] bg-gray-50 rounded-lg">
              <div className="absolute top-[15px] left-4 [font-family:'Inter-Medium',Helvetica] font-medium text-gray-700 text-base tracking-[0] leading-6 whitespace-nowrap">
                Dựa trên hồ sơ của bạn
              </div>

              {profileRecommendations.map((recommendation, index) => (
                <p
                  key={index}
                  className="absolute left-4 [font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5 whitespace-nowrap"
                  style={{ top: `${51 + index * 28}px` }}
                >
                  • {recommendation}
                </p>
              ))}
            </div>
          </div>

          <div className="absolute w-[1225px] h-[320px] top-[1439px] left-4 bg-white rounded-lg border border-solid border shadow-[0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_1px_2px_#0000001a,0px_1px_3px_#0000001a]">
            <div className="absolute top-[23px] left-6 [font-family:'Inter-Bold',Helvetica] font-bold text-gray-900 text-xl tracking-[0] leading-7 whitespace-nowrap">
              Tóm tắt & Khuyến nghị
            </div>

            <div className="absolute top-[75px] left-6 [font-family:'Inter-Medium',Helvetica] font-medium text-gray-700 text-base tracking-[0] leading-6 whitespace-nowrap">
              Trạng thái hiện tại
            </div>

            {summaryData.map((item, index) => (
              <div key={index}>
                <div
                  className="absolute left-6 [font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5 whitespace-nowrap"
                  style={{ top: `${115 + index * 32}px` }}
                >
                  {item.label}
                </div>
                <div
                  className="absolute [font-family:'Inter-Medium',Helvetica] font-medium text-gray-500 text-sm leading-5 tracking-[0] whitespace-nowrap"
                  style={{ 
                    top: `${115 + index * 32}px`, 
                    left: `${item.label.includes("Score") ? 577 : item.label.includes("Weekly") ? 545 : 537}px` 
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}

            <div className="absolute top-[75px] left-[627px] [font-family:'Inter-Medium',Helvetica] font-medium text-gray-700 text-base tracking-[0] leading-6 whitespace-nowrap">
              Khuyến nghị
            </div>

            <div className={`absolute w-[572px] h-[102px] top-[117px] left-[628px] ${learningData?.recommendations.onTrack ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} rounded-lg border border-solid`}>
              <div className={`absolute top-[15px] left-4 [font-family:'Inter-Medium',Helvetica] font-medium ${learningData?.recommendations.onTrack ? 'text-green-600' : 'text-red-600'} text-sm tracking-[0] leading-5 whitespace-nowrap`}>
                {learningData?.recommendations.onTrack ? '✅ Đúng hướng' : '⚠️ Cần cải thiện'}
              </div>

              <p className="absolute w-[497px] top-11 left-4 [font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-sm tracking-[0] leading-5">
                {learningData?.recommendations.message || 'Kế hoạch học tập hiện tại của bạn sẽ giúp bạn đạt được điểm dự đoán. Hãy duy trì sự nhất quán!'}
              </p>
            </div>
          </div>

          <div className="absolute w-[1225px] h-[100px] top-[1783px] left-4">
            <div className="absolute w-[1225px] h-[1px] top-0 left-0 bg-gray-200" />

            <button 
              className="tailwind-button absolute w-[400px] h-[50px] top-[35px] left-0 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-md border-0 cursor-pointer"
              onClick={handleBackToCourseList}
            >
              <div className="absolute top-3 left-[149px] [font-family:'Inter-Medium',Helvetica] font-medium text-white text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                Back to Course List
              </div>
            </button>

            <button 
              className="tailwind-button absolute w-[400px] h-[50px] top-[35px] left-[412px] bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-md border-0 cursor-pointer"
              onClick={handleDownloadStudyPlan}
            >
              <div className="absolute top-3 left-[141px] [font-family:'Inter-Medium',Helvetica] font-medium text-white text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                Download Study Plan
              </div>
            </button>

            <button 
              className="tailwind-button absolute w-[400px] h-[50px] top-[35px] left-[825px] bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors shadow-md border-0 cursor-pointer"
              onClick={() => navigate('/study-with-me')}
            >
              <div className="absolute top-3 left-[158px] [font-family:'Inter-Medium',Helvetica] font-medium text-white text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                Study With Me
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learningpath;
