import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import ScoreChartPage from "./pages/ScoreChartPage";
import PredictionDetailsPage from "./pages/PredictionDetailsPage";
import Learningpath from "./pages/Learningpath";
import CourseDetailPage from "./pages/CourseDetailPage";
import Studywithme from "./pages/Studywithme";
import AdminDashboardNew from "./pages/admin/AdminDashboardNew";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/learning-path" element={<Learningpath />} />
        <Route path="/course-detail" element={<CourseDetailPage />} />
        <Route path="/score-chart" element={<ScoreChartPage />} />
        <Route path="/prediction-details" element={<PredictionDetailsPage />} />
        <Route path="/study-with-me" element={<Studywithme />} />
        <Route path="/admin" element={<AdminDashboardNew />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
