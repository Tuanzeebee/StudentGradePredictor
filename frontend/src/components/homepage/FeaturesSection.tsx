import React from "react";

const FeaturesSection: React.FC = () => {
  return (
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
  );
};

export default FeaturesSection;
