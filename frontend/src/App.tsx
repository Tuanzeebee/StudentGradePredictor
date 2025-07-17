import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import LandingPage from "./pages/LandingPage";
import ScoreChartPage from "./pages/ScoreChartPage";
import PredictionDetailsPage from "./pages/PredictionDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/score-chart" element={<ScoreChartPage />} />
        <Route path="/prediction-details" element={<PredictionDetailsPage />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
