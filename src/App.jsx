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
import CreatePetPage from "./pages/CreatePetPage/CreatePetPage"; // Importa la nueva página
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
          <Route // Nueva ruta para crear mascota
            path="/create-pet"
            element={
              <PrivateRoute>
                <CreatePetPage />
              </PrivateRoute>
            }
          />
          {/* Aquí puedes añadir más rutas protegidas */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
