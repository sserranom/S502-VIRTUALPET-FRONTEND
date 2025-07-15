
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext"; 
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import CreatePetPage from "./pages/CreatePetPage/CreatePetPage"; 
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner"; 
import "./App.css"; 

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />; 
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        {" "}
        {}
        <Routes>
          {}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />{" "}
          {}
          {}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route 
            path="/create-pet"
            element={
              <PrivateRoute>
                <CreatePetPage />
              </PrivateRoute>
            }
          />
          {}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
