import React from 'react';
import SocialButton from './SocialButton';

export default function Footer() {
  const socialIcons = [
    'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/l3uwo0bt_expires_30_days.png',
    'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/6o5nx5vf_expires_30_days.png',
    'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/f8iq24jm_expires_30_days.png'
  ];

  return (
    <div id="footer-section" className="self-stretch flex flex-col items-start bg-[#3C315B] pt-[68px] pb-[68px]">
      <div className="flex items-start mb-[8px] ml-[50px]">
        <div className="flex-shrink-0 flex flex-col items-start mr-[228px]">
          <span className="text-white text-[25px]">
            SCORE
          </span>
          <span className="text-white text-[25px]">
            PREDICT
          </span>
        </div>
        <div className="flex-shrink-0 flex flex-col items-center mt-[7px] mb-[7px] mr-[275px] gap-[19px]">
          <span className="text-white text-[18px] font-bold">
            Product
          </span>
          <span className="text-[#CCCCCC] text-[16px]">
            Features
          </span>
        </div>
        <div className="flex-shrink-0 flex flex-col items-start mt-[7px] mr-[254px] gap-[19px]">
          <span className="text-white text-[18px] font-bold">
            Company
          </span>
          <span className="text-[#CCCCCC] text-[16px]">
            About Us
          </span>
        </div>
        <div className="flex-shrink-0 flex flex-col items-start mt-[7px] gap-[19px]">
          <span className="text-white text-[18px] font-bold">
            Support
          </span>
          <span className="text-[#CCCCCC] text-[16px]">
            Help Center
          </span>
        </div>
      </div>
      <div className="flex items-center mb-[22px] ml-[50px]">
        <span className="text-[#CCCCCC] text-[16px] mr-[108px] w-[236px]">
          Empowering students with AI-driven grade predictions and academic insights for better educational outcomes.
        </span>
        <div className="flex-shrink-0 flex flex-col items-start mr-[250px] gap-[14px]">
          <span className="text-[#CCCCCC] text-[16px]">
            Pricing
          </span>
          <span className="text-[#CCCCCC] text-[16px]">
            API
          </span>
          <span className="text-[#CCCCCC] text-[16px]">
            Integrations
          </span>
        </div>
        <div className="flex-shrink-0 flex flex-col items-start mr-[283px] gap-[14px]">
          <span className="text-[#CCCCCC] text-[16px]">
            Careers
          </span>
          <span className="text-[#CCCCCC] text-[16px]">
            Blog
          </span>
          <span className="text-[#CCCCCC] text-[16px]">
            Press
          </span>
        </div>
        <div className="flex-shrink-0 flex flex-col items-start gap-[14px]">
          <span className="text-[#CCCCCC] text-[16px]">
            Contact Us
          </span>
          <span className="text-[#CCCCCC] text-[16px]">
            Privacy Policy
          </span>
          <span className="text-[#CCCCCC] text-[16px]">
            Terms of Service
          </span>
        </div>
      </div>
      <div className="flex items-start mb-[94px] ml-[50px] gap-[18px]">
        {socialIcons.map((iconUrl, index) => {
          const hrefs = [
            'https://facebook.com/scorepredict',
            'https://twitter.com/scorepredict', 
            'https://linkedin.com/company/scorepredict'
          ];
          const labels = [
            'Facebook',
            'Twitter',
            'LinkedIn'
          ];
          return (
            <SocialButton
              key={index}
              icon={
                <img 
                  src={iconUrl} 
                  alt={labels[index]}
                  className="w-[24px] h-[24px]"
                />
              }
              href={hrefs[index]}
              label={labels[index]}
            />
          );
        })}
      </div>
      <div className="flex items-start ml-[50px]">
        <span className="text-[#CCCCCC] text-[16px] mr-[776px]">
          © 2024 ScorePredict. All rights reserved.
        </span>
        <span className="text-[#CCCCCC] text-[16px] mr-[38px]">
          Privacy
        </span>
        <span className="text-[#CCCCCC] text-[16px] mr-[36px]">
          Terms
        </span>
        <span className="text-[#CCCCCC] text-[16px]">
          Cookies
        </span>
      </div>
    </div>
  );
}