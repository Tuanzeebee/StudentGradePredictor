import React from 'react';
import FeatureCard, { type FeatureCardProps } from './FeatureCard';

const FeaturesSection: React.FC = () => {
  const features: FeatureCardProps[] = [
    {
      emoji: '🎯',
      title: 'Accurate Predictions',
      description: 'Get precise grade forecasts based on your current performance and study patterns.',
      paddingLeft: 0,
      paddingRight: 0,
      emojiMarginLeft: 151,
      titleMarginLeft: 70,
      titleMarginRight: 70,
      descriptionMarginLeft: 33,
      descriptionMarginRight: 33
    },
    {
      emoji: '📊',
      title: 'Performance Analytics',
      description: 'Detailed insights into your academic strengths and areas for improvement.',
      paddingLeft: 37,
      paddingRight: 37,
      emojiMarginLeft: 115,
      titleMarginLeft: 22,
      titleMarginRight: 22,
      descriptionMarginLeft: 0,
      descriptionMarginRight: 0
    },
    {
      emoji: '🚀',
      title: 'Study Optimization',
      description: 'Receive personalized recommendations to maximize your academic potential.',
      paddingLeft: 39,
      paddingRight: 39,
      emojiMarginLeft: 112,
      titleMarginLeft: 41,
      titleMarginRight: 41,
      descriptionMarginLeft: 0,
      descriptionMarginRight: 0
    }
  ];

  return (
    <div id="features-section" className="self-stretch flex flex-col mb-[165px]">
      <div className="self-stretch flex flex-col items-center mb-[26px]">
        <span className="text-[#3C315B] text-[42px] font-bold">
          Our Features
        </span>
      </div>
      <span className="text-[#666666] text-[18px] text-center mb-[62px] mx-[428px]">
        Discover powerful AI-driven tools designed to transform your academic journey
      </span>
      <div className="self-stretch flex items-start mx-[136px] gap-[32px]">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
