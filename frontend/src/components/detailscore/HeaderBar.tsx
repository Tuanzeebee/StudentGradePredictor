import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div
      className="flex items-start bg-white py-2.5 mb-[38px]"
      style={{ boxShadow: "0px 1px 0px #0000001A" }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="shrink-0 mr-[76px] cursor-pointer" onClick={handleGoHome}>
        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/gag6rxpd_expires_30_days.png"
          style={{ width: '105px', height: '66px', objectFit: 'fill' }}
          alt="Logo"
        />
        <span style={{ 
          color: '#3C315B', 
          fontSize: '25px', 
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: '1.2'
        }}>
          SCORE<br/>PREDICT
        </span>
      </div>

      <span className="text-[#3C315B] text-xl font-bold my-5 mr-2">
        Chi tiết phân tích điểm
      </span>

      <img
        src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/mypwreh0_expires_30_days.png"
        className="w-3 h-1.5 mt-[33px] object-fill"
        alt="Separator Icon"
      />

      <div className="flex-1 self-stretch" />
      
      <button
        className="flex flex-col shrink-0 items-start bg-white text-left py-2 px-[37px] mt-2 mr-6 rounded-[50px] border border-solid border-gray-300"
        onClick={handleGoHome}
      >
        <span className="text-gray-700 text-xl font-bold">← Trang chủ</span>
      </button>
      <button
        className="flex flex-col shrink-0 items-start bg-[#AB9FF2] text-left py-2 px-[25px] mt-2 rounded-[50px] border border-solid border-[#00000000]"
        onClick={handleLogout}
      >
        <span className="text-white text-xl font-bold">Đăng xuất</span>
      </button>
    </div>
  );
};

export default HeaderBar;
