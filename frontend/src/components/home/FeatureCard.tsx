import React from 'react';

export interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
  paddingLeft?: string | number;
  paddingRight?: string | number;
  emojiMarginLeft?: string | number;
  titleMarginLeft?: string | number;
  titleMarginRight?: string | number;
  descriptionMarginLeft?: string | number;
  descriptionMarginRight?: string | number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  emoji,
  title,
  description,
  paddingLeft,
  paddingRight,
  emojiMarginLeft,
  titleMarginLeft,
  titleMarginRight,
  descriptionMarginLeft,
  descriptionMarginRight,
}) => {
  return (
    <div
      className="flex-1 flex flex-col items-start bg-white rounded-[20px] border border-[#F0F0F0] pt-[32px] pb-[32px]"
      style={{ paddingLeft, paddingRight }}
    >
      <span
        className="text-black text-[48px] mb-[16px]"
        style={{ marginLeft: emojiMarginLeft }}
      >
        {emoji}
      </span>
      <span
        className="text-[#3C315B] text-[22px] font-bold text-center mb-[14px]"
        style={{ marginLeft: titleMarginLeft, marginRight: titleMarginRight }}
      >
        {title}
      </span>
      <span
        className="text-[#666666] text-[16px] text-center"
        style={{ marginLeft: descriptionMarginLeft, marginRight: descriptionMarginRight }}
      >
        {description}
      </span>
    </div>
  );
};

export default FeatureCard;
