import React from "react";
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

const SubjectTableImproved: React.FC<SubjectTableProps> = ({ scoreData }) => {
  const navigate = useNavigate();
  
  // Chỉ hiển thị các môn học chưa có điểm thực tế (actual = null hoặc undefined)
  const filteredScoreData = scoreData.filter(item => !item.actual);

  const getGradeColor = (score: number) => {
    if (score >= 9) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 8) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 7) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (score >= 6) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getGradeIcon = (score: number) => {
    if (score >= 9) return "🌟";
    if (score >= 8) return "⭐";
    if (score >= 7) return "👍";
    if (score >= 6) return "👌";
    return "⚠️";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white">
          Chi tiết các môn học chưa có điểm thực tế
        </h3>
        <p className="text-indigo-100 text-sm mt-1">
          {filteredScoreData.length} môn học cần dự đoán điểm
        </p>
      </div>
      
      {filteredScoreData.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎉</div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            Hoàn thành xuất sắc!
          </h4>
          <p className="text-gray-600">
            Tất cả các môn học đã có điểm thực tế
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Không có môn học nào cần dự đoán điểm
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Môn học
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Học kỳ
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tín chỉ
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Điểm dự đoán
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredScoreData.map((item, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {item.courseCode.substring(0, 2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {item.courseCode}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium mt-1">
                          {(() => {
                            const courseName = item.courseName || 'Chưa có tên môn';
                            // Nếu courseName có format "Mã môn: Tên môn", chỉ lấy phần tên môn
                            if (courseName.includes(':')) {
                              return courseName.split(':')[1]?.trim() || courseName;
                            }
                            return courseName;
                          })()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.studyFormat} • {item.year}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-2 h-2 bg-indigo-400 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-gray-900">
                        {item.semester}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Kỳ {item.semesterNumber}
                    </p>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                      {item.creditsUnit} TC
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    {item.predicted ? (
                      <div className="inline-flex items-center space-x-2">
                        <span className="text-lg">
                          {getGradeIcon(item.predicted)}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${getGradeColor(item.predicted)}`}>
                          {item.predicted.toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        Chưa dự đoán
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    {item.predicted ? (
                      <button
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                        onClick={() => navigate(`/learning-path?courseCode=${item.courseCode}&predictedScore=${item.predicted || item.predictedGPA || 0}`)}
                      >
                        <span className="mr-2">🎯</span>
                        Học ngay
                      </button>
                    ) : (
                      <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed">
                        <span className="mr-2">⏳</span>
                        Đang xử lý
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {filteredScoreData.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">Tổng cộng:</span>
              <span className="ml-2">{filteredScoreData.length} môn học</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              <span>Sẵn sàng để học</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectTableImproved;
