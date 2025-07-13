// src/pages/DashboardPage/DashboardPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getMyPets, updatePet, deletePet } from "../../api/pets"; // Importa la función deletePet
import Button from "../../components/Button/Button";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import PetCard from "../../components/PetCard/PetCard"; // Importa el nuevo componente PetCard
import styles from "./DashboardPage.module.css"; // Importa el objeto de estilos

const DashboardPage = () => {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [errorPets, setErrorPets] = useState("");
  const [updatingPetId, setUpdatingPetId] = useState(null); // Para saber qué mascota se está actualizando
  const [deletingPetId, setDeletingPetId] = useState(null); // Para saber qué mascota se está eliminando

  // Redirigir si el usuario no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate, authLoading]);

  // Función para cargar las mascotas del usuario
  const fetchUserPets = useCallback(async () => {
    if (!isAuthenticated) {
      setLoadingPets(false);
      return;
    }

    setLoadingPets(true);
    setErrorPets("");
    try {
      const data = await getMyPets();
      setPets(data);
    } catch (error) {
      console.error("Error al obtener las mascotas:", error);
      setErrorPets("No se pudieron cargar tus mascotas. Inténtalo de nuevo.");
      setPets([]);
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
      const currentPet = pets.find((p) => p.id === petId);
      if (!currentPet) return;

      // Al alimentar:
      // 1. El hambre disminuye en 15 (min 0)
      const newHungerLevel = Math.max(0, currentPet.hungerLevel - 15);
      // 2. La energía aumenta en 10 (max 100)
      const newEnergyLevel = Math.min(100, currentPet.energyLevel + 10);

      // Ajuste del estado de ánimo
      let newMood = currentPet.mood;
      if (newHungerLevel <= 10 && newEnergyLevel >= 80) {
        newMood = "HAPPY"; // Muy feliz si no tiene hambre y tiene mucha energía
      } else if (newHungerLevel <= 20) {
        newMood = "NEUTRAL"; // Si solo el hambre está baja, se siente neutral
      }

      const updatedPetData = await updatePet(petId, {
        hungerLevel: newHungerLevel,
        energyLevel: newEnergyLevel, // Incluir el nuevo nivel de energía
        mood: newMood,
      });

      setPets((prevPets) =>
        prevPets.map((p) => (p.id === petId ? updatedPetData : p))
      );
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
      const currentPet = pets.find((p) => p.id === petId);
      if (!currentPet) return;

      // Al jugar:
      // 1. La energía baja en 15 (min 0)
      const newEnergyLevel = Math.max(0, currentPet.energyLevel - 15);
      // 2. El hambre sube en 15 (max 100)
      const newHungerLevel = Math.min(100, currentPet.hungerLevel + 15);

      // Ajuste del estado de ánimo
      let newMood = currentPet.mood;
      if (newEnergyLevel <= 10) {
        newMood = "SAD"; // Muy triste si la energía es muy baja
      } else if (newHungerLevel >= 80) {
        newMood = "ANGRY"; // Enojado si el hambre es muy alta
      } else if (newEnergyLevel > 50 && newHungerLevel < 50) {
        newMood = "EXCITED"; // Emocionado si tiene buena energía y no mucha hambre
      }

      const updatedPetData = await updatePet(petId, {
        energyLevel: newEnergyLevel,
        hungerLevel: newHungerLevel,
        mood: newMood,
      });

      setPets((prevPets) =>
        prevPets.map((p) => (p.id === petId ? updatedPetData : p))
      );
    } catch (error) {
      console.error("Error al jugar con la mascota:", error);
      setErrorPets("No se pudo jugar con la mascota.");
    } finally {
      setUpdatingPetId(null);
    }
  };

  // Función para eliminar una mascota
  const handleDelete = async (petId) => {
    if (
      !window.confirm(
        "¿Estás seguro de que quieres eliminar esta mascota? Esta acción no se puede deshacer."
      )
    ) {
      return; // Si el usuario cancela, no hacer nada
    }

    setDeletingPetId(petId);
    setErrorPets("");
    try {
      await deletePet(petId);
      setPets((prevPets) => prevPets.filter((p) => p.id !== petId)); // Eliminar la mascota del estado local
    } catch (error) {
      console.error("Error al eliminar la mascota:", error);
      setErrorPets(
        "No se pudo eliminar la mascota. Asegúrate de tener los permisos."
      );
    } finally {
      setDeletingPetId(null);
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
              onDelete={handleDelete} // Pasa la función handleDelete al PetCard
              isUpdating={updatingPetId === pet.id || deletingPetId === pet.id} // Actualizar o eliminar
            />
          ))}
        </div>
      )}

      <div className={styles.dashboardActions}>
        <Button onClick={logout} className={styles.logoutButton}>
          Cerrar Sesión
        </Button>
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
