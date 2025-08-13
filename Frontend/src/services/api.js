import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL 
});

// Add JWT token to every request if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
