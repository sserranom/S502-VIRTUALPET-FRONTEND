// src/components/LoadingSpinner/LoadingSpinner.jsx
import React from "react";
import styles from "./LoadingSpinner.module.css";

/**
 * Componente simple de spinner de carga.
 */
const LoadingSpinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingSpinner;
