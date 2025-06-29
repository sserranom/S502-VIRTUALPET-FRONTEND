// src/api/auth.js
import axios from "axios";

// Asegúrate de que esta URL coincida con la de tu backend
const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token JWT a todas las peticiones salientes (excepto login/signup)
api.interceptors.request.use(
  (config) => {
    // No añadir token para las rutas de autenticación
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

/**
 * Llama al endpoint de login de tu API.
 * @param {string} username - Nombre de usuario.
 * @param {string} password - Contraseña.
 * @returns {Promise<Object>} La respuesta de la API que contiene el JWT.
 */
export const loginUser = (username, password) => {
  return api.post("/auth/log-in", { username, password });
};

/**
 * Llama al endpoint de registro de tu API.
 * @param {string} username - Nombre de usuario.
 * @param {string} password - Contraseña.
 * @param {string[]} roleListName - Lista de nombres de roles (ej: ["ADMIN", "USER"]).
 * @returns {Promise<Object>} La respuesta de la API que contiene el JWT.
 */
export const registerUser = (username, password, roleListName) => {
  return api.post("/auth/sign-up", {
    username,
    password,
    roleRequestDTO: { roleListName },
  });
};

// Ejemplo de una petición protegida (para probar la autorización después del login)
// Puedes crear más funciones aquí para otras APIs de tu backend
export const getProtectedData = () => {
  return api.get("/api/protected-resource"); // Ajusta a una ruta protegida real de tu API
};
