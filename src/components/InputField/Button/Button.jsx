// src/components/Button/Button.jsx
import React from "react";
import styles from "./Button.module.css";

/**
 * Componente de botón reutilizable.
 * @param {Object} props - Propiedades del componente.
 * @param {string} [props.type='button'] - Tipo del botón (ej: 'submit', 'button').
 * @param {boolean} [props.disabled=false] - Si el botón está deshabilitado.
 * @param {function} [props.onClick] - Manejador de clic del botón.
 * @param {React.ReactNode} props.children - Contenido del botón.
 */
const Button = ({ type = "button", disabled = false, onClick, children }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={styles.button}
    >
      {children}
    </button>
  );
};

export default Button;
