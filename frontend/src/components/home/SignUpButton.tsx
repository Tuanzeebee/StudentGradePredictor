import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpButton: React.FC = () => {
  const navigate = useNavigate();
  
  const handleClick = (): void => {
    navigate('/auth/register');
  };

  return (
    <button
      className="flex-shrink-0 flex flex-col items-start bg-[#AB9FF2] rounded-[50px] border border-transparent pt-[8px] pb-[8px] pl-[25px] pr-[25px] text-left"
      onClick={handleClick}
    >
      <span className="text-white text-[20px] font-bold">
        Sign Up
      </span>
    </button>
  );
};

export default SignUpButton;
