import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartPredictingButton: React.FC = () => {
  const navigate = useNavigate();
  
  const handleClick = (): void => {
    // Kiểm tra xem user đã đăng nhập chưa
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/auth/login');
    } else {
      navigate('/auth/login');
    }
  };

  return (
    <div className="flex justify-center">
      <button
        className="flex flex-col items-center bg-[#AB9FF2] rounded-[50px] border-none pt-[16px] pb-[16px] pl-[32px] pr-[32px] text-center"
        onClick={handleClick}
      >
        <span className="text-white text-[20px] font-bold">
          Start Predicting
        </span>
      </button>
    </div>
  );
};

export default StartPredictingButton;
