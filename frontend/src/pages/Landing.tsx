import { useNavigate } from "react-router-dom";
import UploadFile from "../components/UploadFile";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '100px 50px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        marginBottom: '20px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Xin chào! 👋
      </h1>
      
      <p style={{ 
        fontSize: '1.5rem', 
        marginBottom: '40px',
        opacity: 0.9
      }}>
        Chào mừng bạn đến với ứng dụng của chúng tôi!
      </p>
      
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        padding: '30px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Bạn đã đăng nhập thành công!</h2>
        <p style={{ marginBottom: '30px' }}>
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
        </p>
        
        <UploadFile />
        
        <button 
          onClick={() => navigate('/')}
          style={{ 
            padding: '12px 30px', 
            fontSize: '16px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '25px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            margin: '0 10px'
          }}
          onMouseOver={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.3)';
            (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.2)';
            (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
          }}
        >
          Về trang chủ
        </button>
        
        <button 
          onClick={() => navigate('/auth/login')}
          style={{ 
            padding: '12px 30px', 
            fontSize: '16px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '25px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            margin: '0 10px'
          }}
          onMouseOver={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.3)';
            (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.2)';
            (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
          }}
        >
          Đăng nhập lại
        </button>
      </div>
    </div>
  );
}

export default Landing; 