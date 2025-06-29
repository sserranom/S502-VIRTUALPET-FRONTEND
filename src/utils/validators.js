// src/utils/validators.js
// Puedes añadir funciones de validación aquí si las necesitas fuera de Yup.
// Por ejemplo:
export const isValidEmail = (email) => {
  // Regex simple para email
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ...otras funciones de utilidad
