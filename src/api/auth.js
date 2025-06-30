
import axios from "axios";
const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (!config.url.includes("/auth/")) {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = (username, password) => {
  return api.post("/auth/log-in", { username, password });
};

export const registerUser = (username, password, roleListName) => {
  return api.post("/auth/sign-up", {
    username,
    password,
    roleRequestDTO: { roleListName },
  });
};
export const getProtectedData = () => {
  return api.get("/api/protected-resource"); 
};
