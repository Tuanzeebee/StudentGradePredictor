import { useState } from 'react';
import { ChevronDown } from "../../components/icons/ChevronDown";

const AdminDashboardNew = () => {
  const [selectedCourse, setSelectedCourse] = useState('MÔN HỌC');
  const [selectedYear, setSelectedYear] = useState('NĂM HỌC');

  // Mock data for dashboard stats
  const statsData = [
    {
      title: "Total Students",
      value: "12,847",
      change: "+12%",
      changeColor: "text-green-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Faculty Members", 
      value: "342",
      change: "+5%",
      changeColor: "text-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "At-Risk Students",
      value: "15", 
      change: "-3%",
      changeColor: "text-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      title: "Avg Performance",
      value: "87.3%",
      change: "+2.1%", 
      changeColor: "text-green-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    }
  ];

  // Mock data for outstanding students
  const outstandingStudents = [
    { id: 282, name: "Nguyễn Đình Tuấn" },
    { id: 283, name: "Hồ Trọng Vỹ" },
    { id: 284, name: "Võ Hoàng Mai Khanh" },
    { id: 285, name: "Võ Văn Phương" }
  ];

  // Mock data for performance stats
  const performanceStats = [
    { label: "Excellent/Outstanding", percentage: 85, color: "bg-orange-400" },
    { label: "Fair/Good", percentage: 10, color: "bg-cyan-400" },
    { label: "Average/Weak", percentage: 5, color: "bg-purple-400" }
  ];

  // Mock data for access time
  const accessTimeData = [
    { label: "Afternoon", percentage: "40%", color: "bg-indigo-600" },
    { label: "Evening", percentage: "32%", color: "bg-indigo-400" },
    { label: "Morning", percentage: "28%", color: "bg-indigo-200" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-100 shadow-lg z-10">
        {/* Logo */}
        <div className="flex items-center p-6 border-b">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="ml-3 text-xl font-bold text-red-400">Predica</span>
        </div>

        {/* Menu */}
        <nav className="mt-8">
          <div className="px-6 mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">MENU</h3>
          </div>
          
          <div className="space-y-1 px-4">
            <div className="bg-indigo-50 text-indigo-700 rounded-lg px-3 py-2 flex items-center">
              <div className="w-5 h-5 mr-3">📊</div>
              <span className="font-medium">Dashboard</span>
            </div>
            
            <div className="text-gray-600 rounded-lg px-3 py-2 flex items-center hover:bg-gray-50 cursor-pointer">
              <div className="w-5 h-5 mr-3">🤖</div>
              <span>AI Analytics</span>
            </div>
            
            <div className="text-gray-600 rounded-lg px-3 py-2 flex items-center hover:bg-gray-50 cursor-pointer">
              <div className="w-5 h-5 mr-3">👥</div>
              <span>Faculty Management</span>
            </div>
            
            <div className="text-gray-600 rounded-lg px-3 py-2 flex items-center hover:bg-gray-50 cursor-pointer">
              <div className="w-5 h-5 mr-3">🎓</div>
              <span>Student Management</span>
            </div>
            
            <div className="text-gray-600 rounded-lg px-3 py-2 flex items-center hover:bg-gray-50 cursor-pointer">
              <div className="w-5 h-5 mr-3">🔬</div>
              <span>Research AI</span>
            </div>
          </div>

          <div className="px-6 mt-8 mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">SYSTEM</h3>
          </div>
          
          <div className="space-y-1 px-4">
            <div className="text-gray-600 rounded-lg px-3 py-2 flex items-center hover:bg-gray-50 cursor-pointer">
              <div className="w-5 h-5 mr-3">📈</div>
              <span>Leadership Reports</span>
            </div>
            
            <div className="text-gray-600 rounded-lg px-3 py-2 flex items-center hover:bg-gray-50 cursor-pointer">
              <div className="w-5 h-5 mr-3">⚙️</div>
              <span>System Settings</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b px-8 py-4">
          <div className="flex justify-end items-center">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600">🍔</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">ADMIN</span>
                <ChevronDown size={16} />
              </div>
              <div className="relative">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600">🔔</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <span className={`text-xl ${stat.iconColor}`}>
                      {index === 0 ? '👥' : index === 1 ? '👨‍🏫' : index === 2 ? '⚠️' : '📊'}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${stat.changeColor}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Performance Statistics */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Statistics</h3>
                <p className="text-sm text-gray-500 mb-6">Student statistics by academic performance (GPA)</p>
                
                <div className="space-y-4">
                  {performanceStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${stat.color} mr-3`}></div>
                        <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{stat.percentage}%</span>
                    </div>
                  ))}
                </div>

                {/* Visual representation */}
                <div className="mt-6 relative">
                  <div className="w-48 h-48 mx-auto relative">
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-orange-400 via-cyan-400 to-purple-400"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">85%</div>
                        <div className="text-sm text-white opacity-80">Excellent</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Outstanding Students */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Outstanding Students</h3>
                <p className="text-sm text-gray-500 mb-6">Top students with outstanding achievements</p>
                
                <div className="space-y-4">
                  {outstandingStudents.map((student, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-semibold text-sm">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">ID: {student.id}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Access Time */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Access Time</h3>
                  <button className="px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors">
                    View Report
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-6">From 1-30 Dec, 2025</p>

                {/* Featured time slot */}
                <div className="bg-indigo-600 rounded-xl p-4 text-white mb-6">
                  <div className="text-sm font-medium">Afternoon</div>
                  <div className="text-xs opacity-75 mt-1">1pm - 4pm</div>
                  <div className="text-lg font-bold mt-2">890 access hits</div>
                </div>

                {/* Time breakdown */}
                <div className="space-y-3">
                  {accessTimeData.map((time, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${time.color} mr-3`}></div>
                        <span className="text-sm font-medium text-gray-700">{time.label}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{time.percentage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Score Distribution Section */}
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Score Distribution</h3>
                <div className="flex space-x-4">
                  <select 
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>MÔN HỌC</option>
                    <option>Toán cao cấp</option>
                    <option>Lập trình</option>
                    <option>Vật lý</option>
                  </select>
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>NĂM HỌC</option>
                    <option>2024-2025</option>
                    <option>2023-2024</option>
                    <option>2022-2023</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Nhập mã số môn học"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Chart placeholder */}
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-gray-600 font-medium">Score Distribution Chart</div>
                  <div className="text-sm text-gray-500 mt-1">Biểu đồ phân phối điểm số</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardNew;
