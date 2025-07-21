import React from 'react';

interface TestimonialCardProps {
  name: string;
  role: string;
  avatar: string;
  testimonial: string;
  rating: string;
  hasGap?: boolean;
  testimonialWidth?: number | string | null;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  avatar,
  testimonial,
  rating,
  hasGap = false,
  testimonialWidth,
}) => {
  return (
    <div
      className={`flex-1 flex flex-col items-start bg-white rounded-[20px] border border-[#F0F0F0] pt-[33px] pb-[33px] ${
        hasGap ? 'gap-[32px]' : ''
      }`}
    >
      <div className="flex items-center ml-[32px] gap-[16px]">
        <img src={avatar} className="w-[60px] h-[60px] object-fill" alt={`${name} avatar`} />
        <div className="flex-shrink-0 flex flex-col items-start">
          <span className="text-[#3C315B] text-[18px] font-bold">{name}</span>
          <span className="text-[#666666] text-[14px]">{role}</span>
        </div>
      </div>

      <div
        className={`${
          hasGap ? 'self-stretch' : ''
        } flex flex-col items-start ${hasGap ? 'mx-[32px]' : 'mb-[26px] ml-[32px]'}`}
      >
        <span
          className={`text-[#666666] text-[16px] ${hasGap ? '' : 'mb-[14px] mr-[32px]'}`}
          style={testimonialWidth ? { width: testimonialWidth } : {}}
        >
          {testimonial}
        </span>
        <span className={`text-[#FF9933] text-[20px] ${hasGap ? '' : 'ml-[0px]'}`}>{rating}</span>
      </div>

      {!hasGap && (
        <span className="text-[#FF9933] text-[20px] ml-[32px]">{rating}</span>
      )}
    </div>
  );
};

export default TestimonialCard;
