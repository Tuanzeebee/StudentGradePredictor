import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Gọi về NestJS backend
});

// API functions
export const savePredictedScore = async (data: {
  semesterNumber: number;
  year: string;
  courseCode: string;
  predictedScore: number;
  weeklyStudyHours: number;
  attendancePercentage: number;
  commuteTimeMinutes: number;
  familySupport: number;
  studyFormat: string;
  creditsUnit: number;
}) => {
  const token = localStorage.getItem('token');
  return api.post('/scores/save', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getChartData = async () => {
  const token = localStorage.getItem('token');
  return api.get('/scores/chart-data', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getGPAStats = async () => {
  const token = localStorage.getItem('token');
  return api.get('/scores/gpa-stats', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const autoPredictMissingScores = async () => {
  const token = localStorage.getItem('token');
  return api.post('/scores/auto-predict', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fillMissingValues = async () => {
  const token = localStorage.getItem('token');
  return api.post('/scores/fill-missing-values', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const checkPredictionStatus = async () => {
  const token = localStorage.getItem('token');
  return api.get('/scores/prediction-status', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getLearningPath = async (courseCode: string) => {
  const token = localStorage.getItem('token');
  return api.get(`/scores/learning-path/${courseCode}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default api;
