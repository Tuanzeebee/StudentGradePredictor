import React from 'react';

interface ChevronDownProps {
  className?: string;
  size?: number;
}

export const ChevronDown: React.FC<ChevronDownProps> = ({ className = "", size = 16 }) => {
  return (
    <svg 
      className={className}
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="m6 9 6 6 6-6" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ChevronDown;
