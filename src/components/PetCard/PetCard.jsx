
import React from "react";
import Button from "../Button/Button"; 
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"; 
import styles from "./PetCard.module.css";

/**
 * Componente PetCard para mostrar información de una mascota y permitir interacciones.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.pet - Objeto de la mascota a mostrar.
 * @param {function} props.onFeed - Función a llamar al alimentar la mascota.
 * @param {function} props.onPlay - Función a llamar al jugar con la mascota.
 * @param {function} props.onDelete - Función a llamar al eliminar la mascota.
 * @param {boolean} props.isUpdating - Indica si la mascota está en proceso de actualización.
 */
const PetCard = ({ pet, onFeed, onPlay, onDelete, isUpdating }) => {
 
  const energyLevel = typeof pet.energyLevel === "number" ? pet.energyLevel : 0;
  const hungerLevel = typeof pet.hungerLevel === "number" ? pet.hungerLevel : 0;

 
  const getPetImage = (type, currentEnergyLevel) => {
  
    if (currentEnergyLevel <= 70) {
      switch (type) {
        case "VEGETA":
          return "/assets/vegeta_ss.png"; 
        case "FREZER":
          return "/assets/frezer_ss.png"; 
        case "KRILLIN":
          return "/assets/krillin_full_energy.png"; 
        case "GOKU":
          return "/assets/goku_ss.png"; 
        case "MR_SATAN":
          return "/assets/mr_satan_ss.png"; 
        default:
          return "/assets/default_happy_pet.png"; 
      }
    }

   
    switch (type) {
      case "VEGETA":
        return "/assets/vegeta.png";
      case "FREZER":
        return "/assets/frezer.png";
      case "KRILLIN":
        return "/assets/krillin.png";
      case "GOKU":
        return "/assets/goku.png";
      case "MR_SATAN":
        return "/assets/mr_satan.png";
      default:
        return "/assets/default_pet.png"; 
    }
  };

  

  return (
    <div className={styles.card}>
      <h3 className={styles.petName}>{pet.name}</h3>
      <img
        src={getPetImage(pet.type, energyLevel)}
        alt={pet.name}
        className={styles.petImage}
      
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/assets/default_pet.png";
        }}
      />
      <p className={styles.petType}>Tipo: {pet.type}</p>
      <p className={styles.petMood}>Ánimo: {pet.mood}</p>

      <div className={styles.levels}>
        <div className={styles.levelBar}>
          <span className={styles.levelLabel}>Energía:</span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${energyLevel}%`,
                background:
                  energyLevel > 50
                    ? "linear-gradient(90deg, #22c55e, #16a34a)"
                    : energyLevel > 20
                    ? "linear-gradient(90deg, #facc15, #eab308)"
                    : "linear-gradient(90deg, #ef4444, #b91c1c)",
              }}
            ></div>
            <span className={styles.progressText}>{energyLevel}%</span>
          </div>
        </div>
        <div className={styles.levelBar}>
          <span className={styles.levelLabel}>Hambre:</span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${hungerLevel}%`,
                background:
                  hungerLevel < 50
                    ? "linear-gradient(90deg, #22c55e, #16a34a)"
                    : hungerLevel < 80
                    ? "linear-gradient(90deg, #facc15, #eab308)"
                    : "linear-gradient(90deg, #ef4444, #b91c1c)",
              }}
            ></div>
            <span className={styles.progressText}>{hungerLevel}%</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          onClick={() => onFeed(pet.id)}
          disabled={isUpdating}
          className={styles.feedButton}
        >
          {isUpdating ? <LoadingSpinner /> : "Alimentar"}
        </Button>
        <Button
          onClick={() => onPlay(pet.id)}
          disabled={isUpdating}
          className={styles.playButton}
        >
          {isUpdating ? <LoadingSpinner /> : "Entrenar"}
        </Button>
      </div>
      <Button
        onClick={() => onDelete(pet.id)}
        disabled={isUpdating}
        className={styles.deleteButton}
      >
        {isUpdating ? <LoadingSpinner /> : "Eliminar"}
      </Button>
    </div>
  );
};

export default PetCard;
