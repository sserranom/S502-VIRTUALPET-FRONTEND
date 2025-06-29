// src/components/InputField/InputField.jsx
import React from "react";
import styles from "./InputField.module.css";

/**
 * Componente de campo de entrada reutilizable.
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.label - Etiqueta del campo de entrada.
 * @param {string} props.name - Nombre del campo (para formularios).
 * @param {string} [props.type='text'] - Tipo de entrada (ej: 'text', 'password', 'email').
 * @param {string} props.value - Valor actual del campo.
 * @param {function} props.onChange - Manejador de cambio del campo.
 * @param {function} [props.onBlur] - Manejador de desenfoque del campo.
 * @param {string} [props.error] - Mensaje de error a mostrar.
 */
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
}) => {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default InputField;
