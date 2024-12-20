import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});



api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("Unauthorized! Please log in again.");
    }
    return Promise.reject(error);
  }
);

export default api;
