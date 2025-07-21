import React from 'react';
import StepButton from './StepButton';

interface Step {
  number: string;
  title: string;
  description: string;
  paddingLeft: number | string;
  paddingRight: number | string;
  marginRight: number | string;
  titleMarginRight: number | string;
  descriptionMarginRight: number | string;
  descriptionWidth: number | string;
  targetSectionId?: string;
}

const HowItWorksSection: React.FC = () => {
  const steps: Step[] = [
    {
      number: '1',
      title: 'Input Your Data',
      description: 'Enter your current grades, assignment scores, and study habits into our secure platform.',
      paddingLeft: 28,
      paddingRight: 28,
      marginRight: 236,
      titleMarginRight: 169,
      descriptionMarginRight: 64,
      descriptionWidth: 248,
      targetSectionId: 'features-section'
    },
    {
      number: '2',
      title: 'AI Analysis',
      description: 'Our advanced algorithms analyze patterns in your academic performance and learning behavior.',
      paddingLeft: 25,
      paddingRight: 25,
      marginRight: 236,
      titleMarginRight: 168,
      descriptionMarginRight: 56,
      descriptionWidth: 226,
      targetSectionId: 'testimonials-section'
    },
    {
      number: '3',
      title: 'Get Predictions',
      description: 'Receive detailed grade forecasts and probability ranges for your upcoming assessments.',
      paddingLeft: 25,
      paddingRight: 25,
      marginRight: 236,
      titleMarginRight: 112,
      descriptionMarginRight: 41,
      descriptionWidth: 261,
      targetSectionId: 'footer-section'
    },
    {
      number: '4',
      title: 'Optimize Performance',
      description: 'Use insights and recommendations to improve your study strategy and achieve better results.',
      paddingLeft: 24,
      paddingRight: 24,
      marginRight: 0,
      titleMarginRight: 0,
      descriptionMarginRight: 0,
      descriptionWidth: 257,
      targetSectionId: 'hero-section'
    }
  ];

  return (
    <div className="self-stretch flex flex-col mb-[165px]">
      <div className="self-stretch flex flex-col items-center mb-[26px]">
        <span className="text-[#3C315B] text-[42px] font-bold">
          How It Works
        </span>
      </div>
      <span className="text-[#666666] text-[18px] text-center mb-[61px] mx-[249px]">
        Simple steps to unlock your academic potential with AI-powered grade predictions
      </span>
      <div className="self-stretch flex justify-center mb-[24px]">
        <div className="flex items-start gap-[58px]">
          {steps.map((step, index) => (
            <StepButton key={index} {...step} />
          ))}
        </div>
      </div>
      <div className="self-stretch flex justify-center mb-[18px]">
        <div className="flex items-start gap-[58px]">
          {steps.map((step, index) => (
            <span
              key={index}
              className="text-[#3C315B] text-[20px] font-bold text-center"
              style={{ width: step.descriptionWidth }}
            >
              {step.title}
            </span>
          ))}
        </div>
      </div>
      <div className="self-stretch flex justify-center">
        <div className="flex items-start gap-[58px]">
          {steps.map((step, index) => (
            <span
              key={index}
              className="text-[#666666] text-[16px] text-center"
              style={{ width: step.descriptionWidth }}
            >
              {step.description}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
