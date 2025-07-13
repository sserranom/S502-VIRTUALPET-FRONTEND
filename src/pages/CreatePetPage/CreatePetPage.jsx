// src/pages/CreatePetPage/CreatePetPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createPet } from "../../api/pets"; // Importa la función de creación de mascotas
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styles from "./CreatePetPage.module.css";

// Esquema de validación con Yup
const createPetSchema = Yup.object().shape({
  name: Yup.string()
    .required("El nombre es obligatorio")
    .max(50, "El nombre no puede exceder los 50 caracteres."),
  // CORRECCIÓN: Cambiado 'type' a 'petType' para que coincida con el backend DTO
  petType: Yup.string()
    .required("El tipo de mascota es obligatorio")
    .oneOf(
      ["DRAGON", "UNICORN", "ALIEN", "SAN_BERNARDO"],
      "Tipo de mascota inválido"
    ), // Asegúrate de que coincida con tu PetTypeEnum
});

const CreatePetPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      // CORRECCIÓN: Cambiado 'type' a 'petType' en initialValues
      petType: "",
    },
    validationSchema: createPetSchema,
    onSubmit: async (values) => {
      setErrorMessage("");
      setSuccessMessage("");
      try {
        // values ahora contendrá { name: "...", petType: "..." }
        const newPet = await createPet(values);
        setSuccessMessage(
          `¡Mascota "${newPet.name}" creada exitosamente! Redirigiendo...`
        );
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch (error) {
        console.error("Error al crear mascota:", error);
        // --- MEJORA: Manejo de errores más detallado según la respuesta del backend ---
        let displayMessage = "Error desconocido al crear la mascota.";

        if (error && typeof error === "object") {
          // Si es un error de validación de Jakarta Bean Validation (tu GlobalExceptionHandler devuelve un mapa)
          // Ejemplo: { "name": "El nombre es obligatorio.", "type": "El tipo es obligatorio." }
          if (
            Object.keys(error).length > 0 &&
            Object.values(error).every((val) => typeof val === "string")
          ) {
            displayMessage =
              "Errores de validación: " + Object.values(error).join(", ");
          }
          // Si es un error de ResponseStatusException, BadCredentialsException, etc. (tu GlobalExceptionHandler devuelve un objeto con 'message')
          // Ejemplo: { "timestamp": ..., "status": 400, "error": "Bad Request", "message": "El tipo de mascota no puede ser nulo." }
          else if (error.message) {
            displayMessage = error.message;
          }
        } else if (typeof error === "string") {
          // Si el error es una cadena simple
          displayMessage = error;
        }
        setErrorMessage(displayMessage);
      }
    },
  });

  return (
    <div className={styles.createPetContainer}>
      <h2>Crear Nueva Mascota</h2>
      <form onSubmit={formik.handleSubmit}>
        <InputField
          label="Nombre de la Mascota"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
        />

        <div className={styles.selectGroup}>
          <label htmlFor="petType" className={styles.label}>
            {" "}
            {/* CORRECCIÓN: htmlFor a 'petType' */}
            Tipo de Mascota
          </label>
          <select
            id="petType" // CORRECCIÓN: id a 'petType'
            name="petType" // CORRECCIÓN: name a 'petType'
            value={formik.values.petType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${styles.select} ${
              formik.touched.petType && formik.errors.petType // CORRECCIÓN: formik.errors.petType
                ? styles.selectError
                : ""
            }`}
          >
            <option value="">Selecciona un tipo</option>
            <option value="DRAGON">Dragón</option>
            <option value="UNICORN">Unicornio</option>
            <option value="ALIEN">Extraterrestre</option>
            <option value="SAN_BERNARDO">San Bernardo</option>
          </select>
          {formik.touched.petType &&
            formik.errors.petType /* CORRECCIÓN: formik.errors.petType */ && (
              <span className={styles.errorMessage}>
                {formik.errors.petType}
              </span>
            )}
        </div>

        {errorMessage && (
          <p className={styles.formErrorMessage}>{errorMessage}</p>
        )}
        {successMessage && (
          <p className={styles.formSuccessMessage}>{successMessage}</p>
        )}

        <Button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? <LoadingSpinner /> : "Crear Mascota"}
        </Button>
        <Button
          type="button"
          onClick={() => navigate("/dashboard")}
          className={styles.backButton}
        >
          Volver al Dashboard
        </Button>
      </form>
    </div>
  );
};

export default CreatePetPage;
