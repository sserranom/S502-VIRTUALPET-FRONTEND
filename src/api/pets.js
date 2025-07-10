// src/api/pets.js
import axios from "axios";

// --- Mejora 1: Configuración de la URL base desde variables de entorno ---
// Esto hace que la URL sea configurable para diferentes entornos (desarrollo, producción)
// En un proyecto Vite/Create React App, se accede a las variables de entorno con import.meta.env.VITE_API_BASE_URL
// Asegúrate de definir VITE_API_BASE_URL en tu archivo .env (ej. .env.development, .env.production)
// Ejemplo: VITE_API_BASE_URL=http://localhost:8080
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Mejora 2: Interceptor de Peticiones para añadir el token JWT ---
// Este interceptor asegura que el token se adjunte automáticamente a todas las peticiones
// que no sean de autenticación, siguiendo el estándar Bearer.
api.interceptors.request.use(
  (config) => {
    // Excluir rutas de autenticación de añadir el token
    if (!config.url.includes("/auth/")) {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // Propagar cualquier error de configuración de la petición
    return Promise.reject(error);
  }
);

// --- Mejora 3: Interceptor de Respuestas para manejo centralizado de errores (opcional pero recomendado) ---
// Este interceptor puede manejar errores HTTP comunes como 401 (Unauthorized) o 403 (Forbidden)
// Por ejemplo, para redirigir al login si el token expira o es inválido.
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si la respuesta es un error 401 o 403, y no es una ruta de auth, podríamos forzar un logout.
    // Esto es una lógica común para manejar tokens expirados o inválidos de forma global.
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      if (!error.config.url.includes("/auth/")) {
        console.error(
          "API Error: Token expirado o acceso denegado. Forzando logout."
        );
        // Aquí podrías disparar un evento global o usar un callback para hacer logout
        // Por ejemplo: window.dispatchEvent(new Event('tokenExpired'));
        // En este ejemplo, solo logueamos, la lógica de logout ya está en AuthContext.
      }
    }
    // Propagar el error para que sea manejado por el componente que hizo la llamada
    return Promise.reject(error);
  }
);

/**
 * Obtiene todas las mascotas del usuario autenticado.
 * @returns {Promise<Object[]>} Una promesa que resuelve con un array de objetos de mascotas.
 */
export const getMyPets = async () => {
  try {
    const response = await api.get("/api/pets/my-pets");
    return response.data; // Devolver directamente los datos, no el objeto de respuesta completo
  } catch (error) {
    console.error(
      "Error fetching user pets:",
      error.response?.data || error.message
    );
    throw error; // Relanzar el error para que el componente que llama lo maneje
  }
};

/**
 * Actualiza el estado de una mascota (ej. alimentar, jugar).
 * @param {number} petId - El ID de la mascota a actualizar.
 * @param {object} updateData - Un objeto con los campos a actualizar (ej. { hungerLevel: 80, energyLevel: 50 }).
 * @returns {Promise<Object>} Una promesa que resuelve con el objeto de la mascota actualizada.
 */
export const updatePet = async (petId, updateData) => {
  try {
    const response = await api.put(`/api/pets/${petId}`, updateData);
    return response.data; // Devolver directamente los datos actualizados
  } catch (error) {
    console.error(
      `Error updating pet ${petId}:`,
      error.response?.data || error.message
    );
    throw error; // Relanzar el error
  }
};

// --- Mejora 4: Añadir funciones para otras operaciones CRUD de mascotas ---
// Aunque no se usan en el dashboard actual, son buenas prácticas tenerlas aquí.

/**
 * Crea una nueva mascota.
 * @param {object} petData - Objeto con los datos de la nueva mascota (name, type).
 * @returns {Promise<Object>} La mascota creada.
 */
export const createPet = async (petData) => {
  try {
    const response = await api.post("/api/pets", petData);
    return response.data;
  } catch (error) {
    console.error("Error creating pet:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Obtiene una mascota específica por su ID.
 * @param {number} petId - El ID de la mascota.
 * @returns {Promise<Object>} La mascota.
 */
export const getPetById = async (petId) => {
  try {
    const response = await api.get(`/api/pets/${petId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching pet ${petId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Elimina una mascota por su ID.
 * @param {number} petId - El ID de la mascota a eliminar.
 * @returns {Promise<void>}
 */
export const deletePet = async (petId) => {
  try {
    await api.delete(`/api/pets/${petId}`);
  } catch (error) {
    console.error(
      `Error deleting pet ${petId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Obtiene todas las mascotas del sistema (normalmente solo para ADMIN).
 * @returns {Promise<Object[]>} Lista de todas las mascotas.
 */
export const getAllPets = async () => {
  try {
    const response = await api.get("/api/pets/all");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all pets (admin):",
      error.response?.data || error.message
    );
    throw error;
  }
};
