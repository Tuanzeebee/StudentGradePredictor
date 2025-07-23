import AdminDashboardNew from './admin/AdminDashboardNew';
import SubjectTableImproved from '../components/detailscore/SubjectTableImproved';

// Mock data cho SubjectTable
const mockScoreData = [
  {
    courseCode: "CS101",
    courseName: "Introduction to Computer Science",
    semester: "Fall 2024",
    predicted: 8.5,
    predictedGPA: 3.4,
    semesterNumber: 1,
    year: "2024",
    studyFormat: "Full-time",
    creditsUnit: 3,
  },
  {
    courseCode: "MATH201",
    courseName: "Calculus II",
    semester: "Spring 2025",
    predicted: 7.8,
    predictedGPA: 3.1,
    semesterNumber: 2,
    year: "2025",
    studyFormat: "Full-time",
    creditsUnit: 4,
  },
  {
    courseCode: "ENG301",
    courseName: "Academic Writing",
    semester: "Fall 2025",
    predicted: 9.2,
    predictedGPA: 3.7,
    semesterNumber: 3,
    year: "2025",
    studyFormat: "Full-time",
    creditsUnit: 2,
  },
];

export const DemoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Full width layout */}
      <main className="w-full">
        {/* Admin Dashboard Section - Full screen */}
        <section className="min-h-screen">
          <AdminDashboardNew />
        </section>

        {/* Subject Table Section */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Student Score Predictions
              </h2>
              <p className="text-lg text-gray-600">
                Hệ thống dự đoán điểm số thông minh cho sinh viên
              </p>
            </div>
            <SubjectTableImproved scoreData={mockScoreData} />
          </div>
        </section>

        {/* Additional Features Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tính năng nổi bật
              </h2>
              <p className="text-lg text-gray-600">
                Khám phá các tính năng mạnh mẽ của hệ thống
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Prediction</h3>
                <p className="text-gray-600">
                  Dự đoán điểm số chính xác với công nghệ Machine Learning tiên tiến
                </p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics</h3>
                <p className="text-gray-600">
                  Phân tích chi tiết hiệu suất học tập và đưa ra khuyến nghị cá nhân hóa
                </p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Learning Path</h3>
                <p className="text-gray-600">
                  Lộ trình học tập được cá nhân hóa dựa trên khả năng và mục tiêu
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">G</span>
                  </div>
                  <span className="text-2xl font-bold text-red-400">Predica</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Hệ thống dự đoán điểm số thông minh cho sinh viên, 
                  giúp nâng cao hiệu quả học tập và đạt được mục tiêu học tại.
                </p>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700">
                    <span>📘</span>
                  </div>
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700">
                    <span>📧</span>
                  </div>
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700">
                    <span>📞</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Tính năng</h4>
                <ul className="space-y-2 text-gray-400">
                  <li className="hover:text-white cursor-pointer">Dự đoán điểm</li>
                  <li className="hover:text-white cursor-pointer">Phân tích học tập</li>
                  <li className="hover:text-white cursor-pointer">Lộ trình cá nhân</li>
                  <li className="hover:text-white cursor-pointer">Báo cáo chi tiết</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Hỗ trợ</h4>
                <ul className="space-y-2 text-gray-400">
                  <li className="hover:text-white cursor-pointer">Hướng dẫn sử dụng</li>
                  <li className="hover:text-white cursor-pointer">FAQ</li>
                  <li className="hover:text-white cursor-pointer">Liên hệ</li>
                  <li className="hover:text-white cursor-pointer">Góp ý</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400">
                © 2025 Predica - Student Grade Prediction System. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default DemoPage;
