// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/auth";
import { jwtDecode } from "jwt-decode"; // Para decodificar JWTs

// Crea el contexto
const AuthContext = createContext(null);

/**
 * Provee el estado y las funciones de autenticación a los componentes hijos.
 * Maneja el token JWT en localStorage y la decodificación del usuario.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Contiene { username, roles, permissions }
  const [token, setToken] = useState(localStorage.getItem("jwt_token"));
  const [loading, setLoading] = useState(true); // Para saber si estamos cargando el estado inicial de auth

  // Efecto para inicializar el estado del usuario desde el token guardado
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          // Verificar expiración del token (exp está en segundos, Date.now() en milisegundos)
          if (decodedToken.exp * 1000 > Date.now()) {
            setUser({
              username: decodedToken.sub,
              // Asume que las autoridades se guardan como una cadena separada por comas en el claim 'authorities'
              roles: decodedToken.authorities
                ? decodedToken.authorities
                    .split(",")
                    .filter((auth) => auth.startsWith("ROLE_"))
                    .map((auth) => auth.replace("ROLE_", ""))
                : [],
              permissions: decodedToken.authorities
                ? decodedToken.authorities
                    .split(",")
                    .filter((auth) => !auth.startsWith("ROLE_"))
                : [],
            });
          } else {
            logout(); // Token expirado, cierra sesión
          }
        } catch (error) {
          console.error("Error al decodificar o validar el token:", error);
          logout(); // Token inválido, cierra sesión
        }
      }
      setLoading(false); // La inicialización ha terminado
    };

    initializeAuth();
  }, [token]); // Depende solo del token, para reaccionar si cambia

  /**
   * Intenta iniciar sesión con el nombre de usuario y la contraseña.
   * Guarda el token si es exitoso.
   */
  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await loginUser(username, password);
      const newJwtToken = response.data.jwt;
      localStorage.setItem("jwt_token", newJwtToken);
      setToken(newJwtToken); // Esto disparará el useEffect para decodificar el nuevo token
      return { success: true };
    } catch (error) {
      setLoading(false);
      console.error(
        "Fallo el login:",
        error.response?.data?.message || error.message
      );
      return {
        success: false,
        error: error.response?.data?.message || "Error de inicio de sesión",
      };
    }
  };

  /**
   * Intenta registrar un nuevo usuario.
   * Guarda el token si es exitoso (asume que el registro también loguea).
   */
  const register = async (username, password, roles) => {
    setLoading(true);
    try {
      const response = await registerUser(username, password, roles);
      const newJwtToken = response.data.jwt;
      localStorage.setItem("jwt_token", newJwtToken);
      setToken(newJwtToken); // Loguea al usuario automáticamente al registrarse
      return { success: true };
    } catch (error) {
      setLoading(false);
      console.error(
        "Fallo el registro:",
        error.response?.data?.message || error.message
      );
      return {
        success: false,
        error: error.response?.data?.message || "Error de registro",
      };
    }
  };

  /**
   * Cierra la sesión del usuario.
   * Elimina el token de localStorage.
   */
  const logout = () => {
    localStorage.removeItem("jwt_token");
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  // Valor exportado por el contexto
  const authContextValue = {
    user,
    isAuthenticated: !!user, // Booleano que indica si hay un usuario logueado
    login,
    register,
    logout,
    loading, // Para mostrar un spinner mientras se carga el estado de autenticación
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
