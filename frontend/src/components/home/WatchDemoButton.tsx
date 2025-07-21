import React from 'react';

const WatchDemoButton: React.FC = () => {
  const handleClick = (): void => {
    // Mở video demo trong tab mới hoặc modal
    const demoUrl = 'https://www.youtube.com/watch?v=demoVideoId'; // Thay bằng URL demo thực tế
    window.open(demoUrl, '_blank');
  };

  return (
    <button
      className="flex-shrink-0 flex flex-col items-start bg-white rounded-[50px] border-2 border-[#5EA4FF] pt-[18px] pb-[18px] pl-[33px] pr-[33px] text-left"
      onClick={handleClick}
    >
      <span className="text-[#3C315B] text-[20px] font-bold">
        Watch Demo
      </span>
    </button>
  );
};

export default WatchDemoButton;
