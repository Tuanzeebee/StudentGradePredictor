import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import ScoreChartPage from "./pages/ScoreChartPage";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to Our App</h1>
      <div style={{ marginTop: '30px' }}>
        <button 
          onClick={() => navigate('/auth/login')}
          style={{ 
            margin: '10px', 
            padding: '10px 20px', 
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
          Login
        </button>
        <button 
          onClick={() => navigate('/auth/register')}
          style={{ 
            margin: '10px', 
            padding: '10px 20px', 
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
          Register
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/score-chart" element={<ScoreChartPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
