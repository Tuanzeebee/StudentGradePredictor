import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginButton: React.FC = () => {
  const navigate = useNavigate();
  
  const handleClick = (): void => {
    navigate('/auth/login');
  };

  return (
    <button
      className="flex-shrink-0 flex flex-col items-start bg-white rounded-[50px] border border-black pt-[8px] pb-[8px] pl-[37px] pr-[37px] mr-[24px] text-left"
      onClick={handleClick}
    >
      <span className="text-black text-[20px] font-bold">Login</span>
    </button>
  );
};

export default LoginButton;
