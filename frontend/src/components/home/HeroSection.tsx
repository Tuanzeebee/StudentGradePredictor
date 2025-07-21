import React from 'react';
import StartPredictingButton from './StartPredictingButton';
import WatchDemoButton from './WatchDemoButton';

const HeroSection: React.FC = () => {
  return (
    <div id="hero-section" className="self-stretch flex flex-col mb-[149px]">
      <span className="text-[#3C315B] text-[56px] font-bold text-center mx-[152px] whitespace-pre-line">
        Predict Your Academic Success with{'\n'}
        AI-Powered Grade Forecasting
      </span>
      <div
        className="self-stretch flex flex-col items-start pt-[169px] pb-[122px] bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/4jajrz09_expires_30_days.png)',
        }}
      >
        <span className="text-[#666666] text-[20px] text-center mb-[60px] mx-[286px]">
          Transform your study approach with intelligent grade predictions. Our advanced AI analyzes your performance
          patterns to forecast future academic outcomes across all subjects.
        </span>
        <div className="flex items-center mb-[39px] ml-[460px] gap-[18px]">
          <StartPredictingButton />
          <WatchDemoButton />
        </div>
        <div className="flex items-start mb-[93px] ml-[524px]">
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/mhe5xfcf_expires_30_days.png"
            className="w-[192px] h-[192px] mt-[208px] mr-[316px] object-fill"
            alt="AI Illustration 1"
          />
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/rpz4vw24_expires_30_days.png"
            className="w-[304px] h-[304px] object-fill"
            alt="AI Illustration 2"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
