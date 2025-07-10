
// src/pages/DashboardPage/DashboardPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getMyPets, updatePet } from "../../api/pets"; // Importa las funciones de la API de mascotas
import Button from "../../components/Button/Button";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import PetCard from "../../components/PetCard/PetCard"; // Importa el nuevo componente PetCard
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  // CRUCIAL: Inicializar pets como un array vacío
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [errorPets, setErrorPets] = useState("");
  const [updatingPetId, setUpdatingPetId] = useState(null); // Para saber qué mascota se está actualizando

  // Redirigir si el usuario no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate, authLoading]);

  // Función para cargar las mascotas del usuario
  const fetchUserPets = useCallback(async () => {
    if (!isAuthenticated) {
      setLoadingPets(false); // Si no está autenticado, no hay mascotas que cargar, terminar carga
      return;
    }

    setLoadingPets(true);
    setErrorPets("");
    try {
      const data = await getMyPets(); // getMyPets ahora devuelve directamente los datos
      setPets(data); // Asegurarse de que data sea un array
    } catch (error) {
      console.error("Error al obtener las mascotas:", error);
      setErrorPets("No se pudieron cargar tus mascotas. Inténtalo de nuevo.");
      setPets([]); // En caso de error, asegurar que pets sea un array vacío
    } finally {
      setLoadingPets(false);
    }
  }, [isAuthenticated]);

  // Cargar mascotas al montar el componente o al cambiar el estado de autenticación
  useEffect(() => {
    fetchUserPets();
  }, [fetchUserPets]);

  // Función para alimentar una mascota
  const handleFeed = async (petId) => {
    setUpdatingPetId(petId);
    setErrorPets("");
    try {
      // Lógica para aumentar el hambre (disminuir el nivel de hambre)
      const currentPet = pets.find((p) => p.id === petId);
      if (!currentPet) return;

      const newHungerLevel = Math.max(0, currentPet.hungerLevel - 20); // Disminuye el hambre en 20
      const newMood =
        newHungerLevel <= 20 && newHungerLevel >= 0 ? "HAPPY" : currentPet.mood; // Si el hambre es baja, está feliz

      const updatedPetData = await updatePet(petId, {
        hungerLevel: newHungerLevel,
        mood: newMood,
      });

      // Actualiza la mascota en el estado local
      setPets((prevPets) =>
        prevPets.map((p) => (p.id === petId ? updatedPetData : p))
      ); // updatePet ahora devuelve directamente los datos
    } catch (error) {
      console.error("Error al alimentar la mascota:", error);
      setErrorPets("No se pudo alimentar la mascota.");
    } finally {
      setUpdatingPetId(null);
    }
  };

  // Función para jugar con una mascota
  const handlePlay = async (petId) => {
    setUpdatingPetId(petId);
    setErrorPets("");
    try {
      // Lógica para aumentar la energía
      const currentPet = pets.find((p) => p.id === petId);
      if (!currentPet) return;

      const newEnergyLevel = Math.min(100, currentPet.energyLevel + 20); // Aumenta la energía en 20
      const newMood = newEnergyLevel >= 80 ? "EXCITED" : currentPet.mood; // Si la energía es alta, está emocionado

      const updatedPetData = await updatePet(petId, {
        energyLevel: newEnergyLevel,
        mood: newMood,
      });

      // Actualiza la mascota en el estado local
      setPets((prevPets) =>
        prevPets.map((p) => (p.id === petId ? updatedPetData : p))
      ); // updatePet ahora devuelve directamente los datos
    } catch (error) {
      console.error("Error al jugar con la mascota:", error);
      setErrorPets("No se pudo jugar con la mascota.");
    } finally {
      setUpdatingPetId(null);
    }
  };

  if (authLoading || loadingPets) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner /> <p>Cargando mascotas...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // El useEffect ya redirigió
  }

  return (
    <div className={styles.dashboardContainer}>
      <h2>¡Bienvenido, {user?.username}!</h2>
      <p className={styles.welcomeMessage}>
        Aquí están tus mascotas virtuales. ¡Cuídalas bien!
      </p>

      {errorPets && <p className={styles.errorMessage}>{errorPets}</p>}

      {pets.length === 0 ? (
        <p className={styles.noPetsMessage}>
          No tienes mascotas aún. ¡Crea una para empezar a jugar!
        </p>
      ) : (
        <div className={styles.petCardsGrid}>
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onFeed={handleFeed}
              onPlay={handlePlay}
              isUpdating={updatingPetId === pet.id}
            />
          ))}
        </div>
      )}

      <div className={styles.dashboardActions}>
        <Button onClick={logout} className={styles.logoutButton}>
          Cerrar Sesión
        </Button>
        {/* Botón para crear una nueva mascota */}
        <Button
          onClick={() => navigate("/create-pet")}
          className={styles.createPetButton}
        >
          Crear Nueva Mascota
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;



/* 
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
 */
