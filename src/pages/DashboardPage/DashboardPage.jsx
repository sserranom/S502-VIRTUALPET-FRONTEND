
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getMyPets, updatePet, deletePet } from "../../api/pets"; 
import Button from "../../components/Button/Button";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import PetCard from "../../components/PetCard/PetCard"; 
import styles from "./DashboardPage.module.css"; 

const DashboardPage = () => {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [errorPets, setErrorPets] = useState("");
  const [updatingPetId, setUpdatingPetId] = useState(null); 
  const [deletingPetId, setDeletingPetId] = useState(null); 

 
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate, authLoading]);

 
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

 
  useEffect(() => {
    fetchUserPets();
  }, [fetchUserPets]);

 
  const handleFeed = async (petId) => {
    setUpdatingPetId(petId);
    setErrorPets("");
    try {
      const currentPet = pets.find((p) => p.id === petId);
      if (!currentPet) return;

   
      const newHungerLevel = Math.max(0, currentPet.hungerLevel - 15);
      
      const newEnergyLevel = Math.min(100, currentPet.energyLevel + 10);

     
      let newMood = currentPet.mood;
      if (newHungerLevel <= 10 && newEnergyLevel >= 80) {
        newMood = "HAPPY"; 
      } else if (newHungerLevel <= 20) {
        newMood = "NEUTRAL"; 
      }

      const updatedPetData = await updatePet(petId, {
        hungerLevel: newHungerLevel,
        energyLevel: newEnergyLevel, 
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

 
  const handlePlay = async (petId) => {
    setUpdatingPetId(petId);
    setErrorPets("");
    try {
      const currentPet = pets.find((p) => p.id === petId);
      if (!currentPet) return;

     
      const newEnergyLevel = Math.max(0, currentPet.energyLevel - 15);
     
      const newHungerLevel = Math.min(100, currentPet.hungerLevel + 15);

     
      let newMood = currentPet.mood;
      if (newEnergyLevel <= 10) {
        newMood = "SAD"; 
      } else if (newHungerLevel >= 80) {
        newMood = "ANGRY"; 
      } else if (newEnergyLevel > 50 && newHungerLevel < 50) {
        newMood = "EXCITED"; 
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

  
  const handleDelete = async (petId) => {
    if (
      !window.confirm(
        "¿Estás seguro de que quieres eliminar esta mascota? Esta acción no se puede deshacer."
      )
    ) {
      return; 
    }

    setDeletingPetId(petId);
    setErrorPets("");
    try {
      await deletePet(petId);
      setPets((prevPets) => prevPets.filter((p) => p.id !== petId)); 
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
    return null; 
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
              onDelete={handleDelete} 
              isUpdating={updatingPetId === pet.id || deletingPetId === pet.id} 
            />
          ))}
        </div>
      )}

      <div className={styles.dashboardActions}>
        <Button
          onClick={() => navigate("/create-pet")}
          className={styles.createPetButton}
        >
          Crear Nueva Mascota
        </Button>
        <Button onClick={logout} className={styles.logoutButton}>
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
