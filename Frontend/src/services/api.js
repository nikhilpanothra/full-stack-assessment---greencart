import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api" // Change to your backend deploy URL later
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
