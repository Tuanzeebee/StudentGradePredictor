import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderSection: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth/login');
  };

  const handleSignUp = () => {
    navigate('/auth/register');
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 50px',
      backgroundColor: 'white',
      boxShadow: '0px 1px 0px rgba(0,0,0,0.1)',
      marginBottom: '47px'
    }}>
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
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#3C315B', fontSize: '20px', fontWeight: 'bold' }}>
          Our Features
        </span>
        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N1bPFEGoXY/ijefief7_expires_30_days.png"
          style={{ width: '12px', height: '7px' }}
          alt="arrow"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
        <button style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: '8px 37px',
          marginRight: '24px',
          borderRadius: '50px',
          border: '1px solid black',
          cursor: 'pointer'
        }}
        onClick={handleLogin}>
          <span style={{ color: 'black', fontSize: '20px', fontWeight: 'bold' }}>
            Login
          </span>
        </button>
        <button style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#AB9FF2',
          padding: '8px 25px',
          borderRadius: '50px',
          border: 'none',
          cursor: 'pointer'
        }}
        onClick={handleSignUp}>
          <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
            Sign Up
          </span>
        </button>
      </div>
    </div>
  );
};

export default HeaderSection;
