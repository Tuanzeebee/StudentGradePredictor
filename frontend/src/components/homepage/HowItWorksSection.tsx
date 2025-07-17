import React from "react";

const HowItWorksSection: React.FC = () => {
  return (
    <div>
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
  );
};

export default HowItWorksSection;
