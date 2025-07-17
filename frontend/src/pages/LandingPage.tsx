import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth/login');
  };

  const handleSignUp = () => {
    navigate('/auth/register');
  };

  const handleStartPredicting = () => {
    navigate('/auth/login');
  };

  const handleWatchDemo = () => {
    // Scroll to features section
    const featuresSection = document.getElementById('features-section');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col bg-white">
      <div className="flex flex-col self-stretch bg-white h-[3724px]">
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
            <button style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: '8px 37px',
              marginRight: '24px',
              borderRadius: '50px',
              border: '1px solid black',
              cursor: 'pointer'
            }}
            onClick={handleLogin}>
              <span style={{ color: 'black', fontSize: '20px', fontWeight: 'bold' }}>
                Login
              </span>
            </button>
            <button style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#AB9FF2',
              padding: '8px 25px',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={handleSignUp}>
              <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                Sign Up
              </span>
            </button>
          </div>
        </div>
        <div className="flex flex-col self-stretch mb-[149px]">
          <h1 className="text-[#3C315B] text-4xl md:text-5xl lg:text-[56px] font-bold text-center px-4 md:px-8 lg:px-[152px] mb-8 leading-tight">
            Predict Your Academic Success with<br />
            AI-Powered Grade Forecasting
          </h1>
          <div className="flex flex-col items-center self-stretch bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/4jajrz09_expires_30_days.png')] bg-cover bg-center pt-[100px] md:pt-[169px] pb-[122px]">
            <p className="text-[#666666] text-lg md:text-xl text-center mb-[60px] max-w-4xl px-4 md:px-8">
              Transform your study approach with intelligent grade predictions. Our advanced AI analyzes your performance patterns to forecast future academic outcomes across all subjects.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-[39px]">
              <button className="bg-[#AB9FF2] hover:bg-[#9B8FF0] text-white text-xl font-bold py-4 px-8 rounded-full border-0 transition-colors cursor-pointer"
                onClick={handleStartPredicting}>
                Start Predicting
              </button>
              <button className="bg-white hover:bg-gray-50 text-[#3C315B] text-xl font-bold py-4 px-8 rounded-full border-2 border-[#5EA4FF] transition-colors cursor-pointer"
                onClick={handleWatchDemo}>
                Watch Demo
              </button>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-[93px] px-4">
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/mhe5xfcf_expires_30_days.png"} 
                className="w-48 h-48 md:w-60 md:h-60 object-fill"
                alt="Demo image 1"
              />
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/rpz4vw24_expires_30_days.png"} 
                className="w-[280px] h-[280px] md:w-[304px] md:h-[304px] object-fill"
                alt="Demo image 2"
              />
            </div>
            <div id="features-section" className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-8 mb-[165px] px-4 md:px-8 lg:px-[136px]">
              <div className="flex-1 flex flex-col items-center bg-white py-8 px-6 rounded-[20px] border border-solid border-[#F0F0F0] text-center">
                <span className="text-black text-5xl mb-4">
                  🎯
                </span>
                <h3 className="text-[#3C315B] text-[22px] font-bold mb-3.5">
                  Accurate Predictions
                </h3>
                <p className="text-[#666666] text-base">
                  Get precise grade forecasts based on your current performance and study patterns.
                </p>
              </div>
              <div className="flex-1 flex flex-col items-center bg-white py-8 px-6 rounded-[20px] border border-solid border-[#F0F0F0] text-center">
                <span className="text-black text-5xl mb-4">
                  📊
                </span>
                <h3 className="text-[#3C315B] text-[22px] font-bold mb-3.5">
                  Performance Analytics
                </h3>
                <p className="text-[#666666] text-base">
                  Detailed insights into your academic strengths and areas for improvement.
                </p>
              </div>
              <div className="flex-1 flex flex-col items-center bg-white py-8 px-6 rounded-[20px] border border-solid border-[#F0F0F0] text-center">
                <span className="text-black text-5xl mb-4">
                  🚀
                </span>
                <h3 className="text-[#3C315B] text-[22px] font-bold mb-3.5">
                  Study Optimization
                </h3>
                <p className="text-[#666666] text-base">
                  Receive personalized recommendations to maximize your academic potential.
                </p>
              </div>
            </div>
            <h2 className="text-[#3C315B] text-3xl md:text-[42px] font-bold text-center mb-[26px]">
              How It Works
            </h2>
            <p className="text-[#666666] text-lg text-center mb-[61px] max-w-2xl mx-auto px-4">
              Simple steps to unlock your academic potential with AI-powered grade predictions
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 lg:gap-[236px] mb-6 px-4">
              {[1, 2, 3, 4].map((step) => (
                <button 
                  key={step}
                  className="bg-[#5EA4FF] hover:bg-[#4E94EF] text-white text-2xl font-bold py-3.5 px-7 rounded-full border-0 transition-colors cursor-pointer">
                  {step.toString()}
                </button>
              ))}
            </div>
            <div className="flex flex-col md:flex-row items-start justify-center gap-4 md:gap-8 lg:gap-[169px] mb-[18px] px-4">
              <h4 className="text-[#3C315B] text-lg md:text-xl font-bold text-center">
                Input Your Data
              </h4>
              <h4 className="text-[#3C315B] text-lg md:text-xl font-bold text-center">
                AI Analysis
              </h4>
              <h4 className="text-[#3C315B] text-lg md:text-xl font-bold text-center">
                Get Predictions
              </h4>
              <h4 className="text-[#3C315B] text-lg md:text-xl font-bold text-center">
                Optimize Performance
              </h4>
            </div>
            <div className="flex flex-col md:flex-row items-start justify-center gap-4 md:gap-8 lg:gap-16 px-4">
              <p className="text-[#666666] text-base text-center max-w-[248px]">
                Enter your current grades, assignment scores, and study habits into our secure platform.
              </p>
              <p className="text-[#666666] text-base text-center max-w-[226px]">
                Our advanced algorithms analyze patterns in your academic performance and learning behavior.
              </p>
              <p className="text-[#666666] text-base text-center max-w-[261px]">
                Receive detailed grade forecasts and probability ranges for your upcoming assessments.
              </p>
              <p className="text-[#666666] text-base text-center max-w-[257px]">
                Use insights and recommendations to improve your study strategy and achieve better results.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center self-stretch mb-[26px]">
          <span className="text-[#3C315B] text-[42px] font-bold">
            {"What Students Say"}
          </span>
        </div>
        <span className="text-[#666666] text-lg text-center mb-[62px] mx-[428px]">
          {"Discover how ScorePredict has transformed academic planning for thousands of students"}
        </span>
        <div className="flex items-start self-stretch mb-[198px] mx-[132px] gap-8">
          <div className="flex flex-1 flex-col items-start bg-white py-[33px] gap-8 rounded-[20px] border border-solid border-[#F0F0F0]">
            <div className="flex items-center ml-8 gap-4">
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/yyp527bk_expires_30_days.png"} 
                className="w-[60px] h-[60px] object-fill"
                alt="Jessica Smith"
              />
              <div className="flex flex-col shrink-0 items-start">
                <span className="text-[#3C315B] text-lg font-bold">
                  {"Jessica Smith"}
                </span>
                <span className="text-[#666666] text-sm">
                  {"Computer Science Major"}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start self-stretch mx-8">
              <span className="text-[#666666] text-base w-[281px]">
                "ScorePredict helped me identify which subjects needed more attention. The predictions were incredibly accurate and helped me plan my study schedule effectively."
              </span>
              <span className="text-[#FF9933] text-xl">
                {"★★★★★"}
              </span>
            </div>
          </div>
          <div className="flex flex-1 flex-col items-start bg-white py-[33px] rounded-[20px] border border-solid border-[#F0F0F0]">
            <div className="flex items-center mb-[26px] ml-8 gap-4">
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/a9ilgzwt_expires_30_days.png"} 
                className="w-[60px] h-[60px] object-fill"
                alt="Michael Johnson"
              />
              <div className="flex flex-col shrink-0 items-start">
                <span className="text-[#3C315B] text-lg font-bold">
                  {"Michael Johnson"}
                </span>
                <span className="text-[#666666] text-sm">
                  {"Business Administration"}
                </span>
              </div>
            </div>
            <span className="text-[#666666] text-base mb-3.5 mx-8">
              "The AI predictions gave me confidence in my academic planning. I could see exactly what grades I needed to achieve my target GPA."
            </span>
            <span className="text-[#FF9933] text-xl ml-8">
              {"★★★★★"}
            </span>
          </div>
          <div className="flex flex-1 flex-col items-start bg-white py-[33px] rounded-[20px] border border-solid border-[#F0F0F0]">
            <div className="flex items-center mb-[26px] ml-8 gap-4">
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/k0o5j2l7_expires_30_days.png"} 
                className="w-[60px] h-[60px] object-fill"
                alt="Emily Lee"
              />
              <div className="flex flex-col shrink-0 items-start">
                <span className="text-[#3C315B] text-lg font-bold">
                  {"Emily Lee"}
                </span>
                <span className="text-[#666666] text-sm">
                  {"Psychology Student"}
                </span>
              </div>
            </div>
            <span className="text-[#666666] text-base mb-3.5 mx-8">
              "Amazing tool! It predicted my final grades with 95% accuracy. The study recommendations were spot-on and really helped improve my performance."
            </span>
            <span className="text-[#FF9933] text-xl ml-8">
              {"★★★★★"}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start self-stretch bg-[#3C315B] py-[68px]">
          <div className="flex items-start mb-2 ml-[50px]">
            <div className="flex flex-col shrink-0 items-start mr-[228px]">
              <span className="text-white text-[25px]">
                {"SCORE"}
              </span>
              <span className="text-white text-[25px]">
                {"PREDICT"}
              </span>
            </div>
            <div className="flex flex-col shrink-0 items-center my-[7px] mr-[275px] gap-[19px]">
              <span className="text-white text-lg font-bold">
                {"Product"}
              </span>
              <span className="text-[#CCCCCC] text-base">
                {"Features"}
              </span>
            </div>
            <div className="flex flex-col shrink-0 items-start mt-[7px] mr-[254px] gap-[19px]">
              <span className="text-white text-lg font-bold">
                {"Company"}
              </span>
              <span className="text-[#CCCCCC] text-base">
                {"About Us"}
              </span>
            </div>
            <div className="flex flex-col shrink-0 items-start mt-[7px] gap-[19px]">
              <span className="text-white text-lg font-bold">
                {"Support"}
              </span>
              <span className="text-[#CCCCCC] text-base">
                {"Help Center"}
              </span>
            </div>
          </div>
          <div className="flex items-center mb-[22px] ml-[50px]">
            <span className="text-[#CCCCCC] text-base w-[236px] mr-[108px]">
              {"Empowering students with AI-driven grade predictions and academic insights for better educational outcomes."}
            </span>
            <div className="flex flex-col shrink-0 items-start mr-[250px] gap-3.5">
              <span className="text-[#CCCCCC] text-base">
                {"Pricing"}
              </span>
              <span className="text-[#CCCCCC] text-base">
                {"API"}
              </span>
              <span className="text-[#CCCCCC] text-base">
                {"Integrations"}
              </span>
            </div>
            <div className="flex flex-col shrink-0 items-start mr-[283px] gap-3.5">
              <span className="text-[#CCCCCC] text-base">
                {"Careers"}
              </span>
              <span className="text-[#CCCCCC] text-base">
                {"Blog"}
              </span>
              <span className="text-[#CCCCCC] text-base">
                {"Press"}
              </span>
            </div>
            <div className="flex flex-col shrink-0 items-start gap-3.5">
              <span className="text-[#CCCCCC] text-base">
                {"Contact Us"}
              </span>
              <span className="text-[#CCCCCC] text-base">
                {"Privacy Policy"}
              </span>
              <span className="text-[#CCCCCC] text-base">
                {"Terms of Service"}
              </span>
            </div>
          </div>
          <div className="flex items-start mb-[94px] ml-[50px] gap-[18px]">
            <button className="flex flex-col shrink-0 items-start bg-[#5EA4FF] text-left py-3 px-[11px] rounded-[22369600px] border-0"
              onClick={() => console.log("Social media clicked")}>
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/l3uwo0bt_expires_30_days.png"} 
                className="w-[23px] h-[23px] object-fill"
                alt="Social media 1"
              />
            </button>
            <button className="flex flex-col shrink-0 items-start bg-[#5EA4FF] text-left py-3 px-[11px] rounded-[22369600px] border-0"
              onClick={() => console.log("Social media clicked")}>
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/6o5nx5vf_expires_30_days.png"} 
                className="w-[23px] h-[23px] object-fill"
                alt="Social media 2"
              />
            </button>
            <button className="flex flex-col shrink-0 items-start bg-[#5EA4FF] text-left p-3 rounded-[22369600px] border-0"
              onClick={() => console.log("Social media clicked")}>
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/f8iq24jm_expires_30_days.png"} 
                className="w-[23px] h-[23px] object-fill"
                alt="Social media 3"
              />
            </button>
          </div>
          <div className="flex items-start ml-[50px]">
            <span className="text-[#CCCCCC] text-base mr-[776px]">
              {"© 2024 ScorePredict. All rights reserved."}
            </span>
            <span className="text-[#CCCCCC] text-base mr-[38px]">
              {"Privacy"}
            </span>
            <span className="text-[#CCCCCC] text-base mr-9">
              {"Terms"}
            </span>
            <span className="text-[#CCCCCC] text-base">
              {"Cookies"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
