import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Gọi về NestJS backend
});

export default api;
