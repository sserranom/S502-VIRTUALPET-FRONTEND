
import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/auth";
import { jwtDecode } from "jwt-decode"; 


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(localStorage.getItem("jwt_token"));
  const [loading, setLoading] = useState(true); 

 
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 > Date.now()) {
            setUser({
              username: decodedToken.sub,
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
            logout(); 
          }
        } catch (error) {
          console.error("Error al decodificar o validar el token:", error);
          logout(); 
        }
      }
      setLoading(false); 
    };

    initializeAuth();
  }, [token]); 

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await loginUser(username, password);
      const newJwtToken = response.data.jwt;
      localStorage.setItem("jwt_token", newJwtToken);
      setToken(newJwtToken); 
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

  const register = async (username, password, roles) => {
    setLoading(true);
    try {
      const response = await registerUser(username, password, roles);
      const newJwtToken = response.data.jwt;
      localStorage.setItem("jwt_token", newJwtToken);
      setToken(newJwtToken); 
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


  const logout = () => {
    localStorage.removeItem("jwt_token");
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const authContextValue = {
    user,
    isAuthenticated: !!user, 
    login,
    register,
    logout,
    loading, 
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
