import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CourseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [studyProgress] = useState(33);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBackToCourseList = () => {
    navigate('/');
  };

  const handleDownloadStudyPlan = () => {
    const studyPlanText = `CS101: Introduction to Programming - Study Plan
    
Weekly Study Time: 6 hours
Total Hours Planned: 36 hours
Recommended Total: 45 hours
Predicted Score: 7.8

Study Plan:
1. Chapter 1: Variables & Data Types (3 hours • Understand basics) - Completed
2. Chapter 2: Control Structures (4 hours • Apply logic) - Pending  
3. Chapter 3: Functions & Arrays (5 hours • Build reusable code) - Pending
4. Midterm Review & Practice (6 hours • Consolidate knowledge) - Pending

Study Tips:
- Time Management: Use 25-minute Pomodoro sessions with 5-minute breaks for focused study
- Practice Strategy: Complete coding exercises immediately after learning each topic  
- AI Assistant: Use AI tools for quick clarifications and debugging help
- Study Groups: Join collaborative learning sessions for better understanding
    `;

    const blob = new Blob([studyPlanText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CS101-Study-Plan.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const chapters = [
    { id: 1, title: "Chapter 1: Variables & Data Types", description: "3 hours • Understand basics", completed: true },
    { id: 2, title: "Chapter 2: Control Structures", description: "4 hours • Apply logic", completed: false },
    { id: 3, title: "Chapter 3: Functions & Arrays", description: "5 hours • Build reusable code", completed: false },
    { id: 4, title: "Midterm Review & Practice", description: "6 hours • Consolidate knowledge", completed: false },
  ];

  const studyTips = [
    {
      title: "Time Management",
      description: "Use 25-minute Pomodoro sessions with 5-minute breaks for focused study",
      icon: "⏰",
      bgColor: "from-blue-50 to-blue-100",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-blue-700"
    },
    {
      title: "Practice Strategy", 
      description: "Complete coding exercises immediately after learning each topic",
      icon: "✅",
      bgColor: "from-emerald-50 to-green-100",
      iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
      textColor: "text-emerald-700"
    },
    {
      title: "AI Assistant",
      description: "Use AI tools for quick clarifications and debugging help",
      icon: "⚡",
      bgColor: "from-amber-50 to-yellow-100",
      iconBg: "bg-gradient-to-br from-amber-500 to-yellow-600",
      textColor: "text-amber-700"
    },
    {
      title: "Study Groups",
      description: "Join collaborative learning sessions for better understanding",
      icon: "👥",
      bgColor: "from-pink-50 to-rose-100",
      iconBg: "bg-gradient-to-br from-pink-500 to-rose-600",
      textColor: "text-pink-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">SP</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  SCORE PREDICT
                </h1>
                <p className="text-xs text-slate-500">AI-Powered Learning</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">Dashboard</a>
              <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">Courses</a>
              <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">Analytics</a>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium">
                Login
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button 
            onClick={handleBackToCourseList}
            className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors group"
          >
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course List
          </button>
        </div>

        {/* Course Header Card */}
        <div className={`bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8 mb-8 relative overflow-hidden ${mounted ? 'animate-in slide-in-from-bottom-4 duration-500' : ''}`}>
          {/* Background Gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/50 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          
          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  CS101: Introduction to Programming
                </h1>
                <div className="flex items-center text-slate-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  3 Credit Units
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  7.8
                </div>
                <p className="text-sm text-slate-500">Predicted Score</p>
              </div>
            </div>

            {/* Progress Sections */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Study Progress */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-700">Study Progress</h3>
                  <span className="text-sm text-slate-500">{studyProgress}% Complete</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: mounted ? `${studyProgress}%` : '0%' }}
                  ></div>
                </div>
              </div>

              {/* Study Effort Analysis */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-6">
                <h3 className="font-semibold text-slate-700 mb-4">Study Effort Analysis</h3>
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                  <span className="text-slate-700">On track to meet requirements</span>
                </div>
                <p className="text-sm text-slate-500">Current: 36h total | Required: 45h</p>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-700 mb-2">6h</div>
                <p className="text-blue-600 font-medium">Weekly Study Time</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-emerald-700 mb-2">6 weeks</div>
                <p className="text-emerald-600 font-medium">Remaining</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-amber-700 mb-2">45h</div>
                <p className="text-amber-600 font-medium">Total Required</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Study Plan */}
        <div className={`bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8 mb-8 ${mounted ? 'animate-in slide-in-from-bottom-4 duration-700' : ''}`}>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Weekly Study Plan</h2>
          
          <div className="space-y-4">
            {chapters.map((chapter) => (
              <div 
                key={chapter.id}
                className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => setActiveChapter(activeChapter === chapter.id ? null : chapter.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      chapter.completed 
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                        : 'bg-gradient-to-br from-slate-400 to-slate-500'
                    }`}>
                      {chapter.completed ? '✓' : chapter.id}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{chapter.title}</h3>
                      <p className="text-slate-500">{chapter.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-2 rounded-full ${
                      chapter.completed ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}></div>
                    <svg 
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        activeChapter === chapter.id ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {activeChapter === chapter.id && (
                  <div className="mt-4 pt-4 border-t border-slate-200 animate-in slide-in-from-top-2 duration-200">
                    <p className="text-slate-600">
                      {chapter.completed 
                        ? "Great job! You've completed this chapter. Review your notes and practice exercises."
                        : "This chapter is coming up next. Make sure to allocate enough time for hands-on practice."
                      }
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Study Tips */}
        <div className={`bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8 mb-8 ${mounted ? 'animate-in slide-in-from-bottom-4 duration-900' : ''}`}>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Personalized Study Tips</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {studyTips.map((tip, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${tip.bgColor} rounded-xl p-6 hover:scale-105 transition-all duration-200 cursor-pointer group`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${tip.iconBg} rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
                    {tip.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${tip.textColor} mb-2`}>{tip.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Profile-based Recommendations */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6">
            <h3 className="font-semibold text-slate-700 mb-4">Based on Your Profile</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                <p className="text-slate-600">Since you have limited study time, focus on key concepts and use active recall techniques</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                <p className="text-slate-600">Review previous chapters weekly to maintain retention</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                <p className="text-slate-600">Schedule study sessions at consistent times to build a routine</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary & Recommendations */}
        <div className={`bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8 mb-8 ${mounted ? 'animate-in slide-in-from-bottom-4 duration-1100' : ''}`}>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Summary & Recommendations</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Current Status */}
            <div>
              <h3 className="font-semibold text-slate-700 mb-4">Current Status</h3>
              <div className="space-y-3">
                {[
                  { label: "Weekly Study Time:", value: "6 hours" },
                  { label: "Total Hours Planned:", value: "36 hours" },
                  { label: "Recommended Total:", value: "45 hours" },
                  { label: "Predicted Score:", value: "7.8" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="font-semibold text-slate-700 mb-4">Recommendations</h3>
              <div className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-semibold text-emerald-700">On Track</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Your current study plan should help you achieve your predicted score. Stay consistent with your schedule and don't hesitate to reach out for help when needed!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleBackToCourseList}
            className="px-8 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:shadow-lg transition-all duration-200 font-medium"
          >
            Back to Course List
          </button>
          <button 
            onClick={handleDownloadStudyPlan}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Study Plan
            </span>
          </button>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes slide-in-from-bottom-4 {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-from-top-2 {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .slide-in-from-bottom-4 {
          animation-name: slide-in-from-bottom-4;
        }
        
        .slide-in-from-top-2 {
          animation-name: slide-in-from-top-2;
        }
        
        .duration-200 {
          animation-duration: 200ms;
        }
        
        .duration-500 {
          animation-duration: 500ms;
        }
        
        .duration-700 {
          animation-duration: 700ms;
        }
        
        .duration-900 {
          animation-duration: 900ms;
        }
        
        .duration-1100 {
          animation-duration: 1100ms;
        }
      `}</style>
    </div>
  );
};

export default CourseDetailPage;
