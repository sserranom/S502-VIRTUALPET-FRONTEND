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
 * @param {function} props.onDelete - Función a llamar al eliminar la mascota.
 * @param {boolean} props.isUpdating - Indica si la mascota está en proceso de actualización.
 */
const PetCard = ({ pet, onFeed, onPlay, onDelete, isUpdating }) => {
  // Función para obtener la imagen de la mascota según su tipo
  const getPetImage = (type) => {
    // Las imágenes deben estar en la carpeta public/assets/ de tu proyecto frontend
    // Por ejemplo: public/assets/goku.png, public/assets/vegeta.png, etc.
    switch (type) {
      case "VEGETA":
        return "/assets/vegeta.png"; // Ruta relativa a la carpeta public
      case "FREZER":
        return "/assets/frezer.png"; // Ruta relativa a la carpeta public
      case "KRILLIN": // Asegúrate de que el nombre del enum sea KRILLIN (mayúsculas)
        return "/assets/krillin.png"; // Ruta relativa a la carpeta public
      case "GOKU":
        return "/assets/goku.png"; // Ruta relativa a la carpeta public
      case "SAN_BERNARDO": // Si mantienes este tipo de mascota
        return "/assets/san_bernardo.png"; // Asumiendo que tienes una imagen para San Bernardo
      default:
        // Una imagen por defecto si el tipo no coincide o la imagen no se encuentra
        return "/assets/default_pet.png"; // Asegúrate de tener esta imagen también
    }
  };

  // Aseguramos que los niveles sean números válidos para el estilo CSS
  const energyLevel = typeof pet.energyLevel === "number" ? pet.energyLevel : 0;
  const hungerLevel = typeof pet.hungerLevel === "number" ? pet.hungerLevel : 0;

  return (
    <div className={styles.card}>
      <h3 className={styles.petName}>{pet.name}</h3>
      <img
        src={getPetImage(pet.type)}
        alt={pet.name}
        className={styles.petImage}
        // Manejo de error para la imagen: si la imagen no carga, muestra un placeholder
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
                backgroundColor:
                  energyLevel > 50
                    ? "#28a745"
                    : energyLevel > 20
                    ? "#ffc107"
                    : "#dc3545",
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
                backgroundColor:
                  hungerLevel < 50
                    ? "#28a745"
                    : hungerLevel < 80
                    ? "#ffc107"
                    : "#dc3545",
              }}
            ></div>
            <span className={styles.progressText}>{hungerLevel}%</span>
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
