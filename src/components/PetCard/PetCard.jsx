// src/components/PetCard/PetCard.jsx
import React from "react";
import Button from "../Button/Button"; // Reutilizamos el componente Button
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"; // Reutilizamos el componente LoadingSpinner
import styles from "./PetCard.module.css";

/**
 * Componente PetCard para mostrar información de una mascota y permitir interacciones.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.pet - Objeto de la mascota a mostrar.
 * @param {function} props.onFeed - Función a llamar al alimentar la mascota.
 * @param {function} props.onPlay - Función a llamar al jugar con la mascota.
 * @param {boolean} props.isUpdating - Indica si la mascota está en proceso de actualización.
 */
const PetCard = ({ pet, onFeed, onPlay, isUpdating }) => {
  // Función para obtener la imagen de la mascota según su tipo
  const getPetImage = (type) => {
    switch (type) {
      case "DRAGON": // Tipo de mascota: Dragón
        return "https://placehold.co/150x150/FF5733/FFFFFF?text=DRAGON"; // Imagen de marcador de posición
      case "UNICORN": // Tipo de mascota: Unicornio
        return "https://placehold.co/150x150/8A2BE2/FFFFFF?text=UNICORN"; // Imagen de marcador de posición
      case "ALIEN": // Tipo de mascota: Extraterrestre
        return "https://placehold.co/150x150/32CD32/FFFFFF?text=ALIEN"; // Imagen de marcador de posición
      case "SAN_BERNARDO": // Nuevo tipo de mascota: San Bernardo
        return "https://placehold.co/150x150/A0522D/FFFFFF?text=SAN_BERNARDO"; // Imagen de marcador de posición para San Bernardo
      default:
        return "https://placehold.co/150x150/CCCCCC/FFFFFF?text=PET"; // Imagen de marcador de posición genérica
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.petName}>{pet.name}</h3>
      <img
        src={getPetImage(pet.type)}
        alt={pet.name}
        className={styles.petImage}
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
                width: `${pet.energyLevel}%`,
                backgroundColor:
                  pet.energyLevel > 50
                    ? "#28a745"
                    : pet.energyLevel > 20
                    ? "#ffc107"
                    : "#dc3545",
              }}
            ></div>
            <span className={styles.progressText}>{pet.energyLevel}%</span>
          </div>
        </div>
        <div className={styles.levelBar}>
          <span className={styles.levelLabel}>Hambre:</span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${pet.hungerLevel}%`,
                backgroundColor:
                  pet.hungerLevel < 50
                    ? "#28a745"
                    : pet.hungerLevel < 80
                    ? "#ffc107"
                    : "#dc3545",
              }}
            ></div>
            <span className={styles.progressText}>{pet.hungerLevel}%</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button onClick={() => onFeed(pet.id)} disabled={isUpdating}>
          {isUpdating ? <LoadingSpinner /> : "Alimentar"}
        </Button>
        <Button onClick={() => onPlay(pet.id)} disabled={isUpdating}>
          {isUpdating ? <LoadingSpinner /> : "Jugar"}
        </Button>
      </div>
    </div>
  );
};

export default PetCard;

