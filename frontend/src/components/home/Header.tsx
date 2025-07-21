import React from 'react';
import LoginButton from './LoginButton';
import SignUpButton from './SignUpButton';

const Header: React.FC = () => {
  return (
    <div className="self-stretch flex items-center bg-white pt-[18px] pb-[18px] pl-[89px] pr-[45px] mb-[128px] shadow-[0px_1px_0px_#0000001A]">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
      <span className="text-[#3C315B] text-[20px] font-bold mr-[8px]">
        Our Features
      </span>
      <img
        src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/yzqyqjbx_expires_30_days.png"
        className="w-[12px] h-[6px] object-fill"
        alt="dropdown-icon"
      />
      <div className="flex-1 self-stretch" />
      <LoginButton />
      <SignUpButton />
    </div>
  );
};

export default Header;
