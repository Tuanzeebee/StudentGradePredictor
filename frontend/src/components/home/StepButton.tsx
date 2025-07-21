import React from 'react';

interface StepButtonProps {
  number: string;
  paddingLeft?: number | string;
  paddingRight?: number | string;
  marginRight?: number | string;
  targetSectionId?: string; // ID của section cần cuộn đến
}

const StepButton: React.FC<StepButtonProps> = ({
  number,
  paddingLeft,
  paddingRight,
  marginRight,
  targetSectionId,
}) => {
  const handleClick = (): void => {
    if (targetSectionId) {
      const element = document.getElementById(targetSectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // Fallback: cuộn xuống 500px
      window.scrollBy({
        top: 500,
        behavior: 'smooth'
      });
    }
  };

  return (
    <button
      className="flex-shrink-0 flex flex-col items-start bg-[#5EA4FF] rounded-full border-none pt-[14px] pb-[14px] text-left"
      style={{ paddingLeft, paddingRight, marginRight }}
      onClick={handleClick}
    >
      <span className="text-white text-[24px] font-bold">{number}</span>
    </button>
  );
};

export default StepButton;
