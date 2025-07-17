import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleStartPredicting = () => {
    navigate('/auth/login');
  };

  const handleWatchDemo = () => {
    // Scroll to features section
    const featuresSection = document.getElementById('features-section');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
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
      </div>
    </div>
  );
};

export default HeroSection;
