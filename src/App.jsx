// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext"; // Importa el AuthProvider y useAuth
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner"; // Para el estado inicial
import "./App.css"; // Si tienes estilos específicos de App

// Componente para proteger rutas
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />; // Muestra un spinner mientras se carga el estado de autenticación
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        {" "}
        {/* Envuelve toda la aplicación con el proveedor de autenticación */}
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />{" "}
          {/* Redirige la raíz a login */}
          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          {/* Aquí puedes añadir más rutas protegidas */}
          {/* <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          /> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
