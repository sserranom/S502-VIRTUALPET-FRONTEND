
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getProtectedData } from "../../api/auth";
import Button from "../../components/Button/Button";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [protectedData, setProtectedData] = useState(null);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate, authLoading]);

  useEffect(() => {
    const fetchProtectedData = async () => {
      if (isAuthenticated) {
        try {
          const response = await getProtectedData();
          setProtectedData(response.data);
          setDataError("");
        } catch (error) {
          console.error("Error al obtener datos protegidos:", error);
          setDataError(
            "No se pudieron cargar los datos protegidos. ¿Permisos insuficientes?"
          );
        }
      }
    };
    fetchProtectedData();
  }, [isAuthenticated]);

  if (authLoading) {
    return <div className={styles.loading}>Cargando dashboard...</div>; 
  }


  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className={styles.dashboardContainer}>
      <h2>Bienvenido al Dashboard, {user?.username}!</h2>
      <p>Este es un área protegida. Tu JWT ha sido validado.</p>

      <h3>Tus Roles:</h3>
      <ul>
        {user?.roles?.map((role) => (
          <li key={role}>{role}</li>
        ))}
      </ul>

      <h3>Tus Permisos:</h3>
      <ul>
        {user?.permissions?.map((permission) => (
          <li key={permission}>{permission}</li>
        ))}
      </ul>

      <hr />

      <h3>Datos Protegidos (Ejemplo):</h3>
      {protectedData ? (
        <pre>{JSON.stringify(protectedData, null, 2)}</pre>
      ) : (
        <p>{dataError || "Cargando datos protegidos..."}</p>
      )}

      <Button onClick={logout} className={styles.logoutButton}>
        Cerrar Sesión
      </Button>
    </div>
  );
};

export default DashboardPage;
