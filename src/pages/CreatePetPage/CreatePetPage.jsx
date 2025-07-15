
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createPet } from "../../api/pets";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styles from "./CreatePetPage.module.css";


const createPetSchema = Yup.object().shape({
  name: Yup.string()
    .required("El nombre es obligatorio")
    .max(50, "El nombre no puede exceder los 50 caracteres."),
 
  petType: Yup.string()
    .required("El tipo de mascota es obligatorio")
    .oneOf(
      ["VEGETA", "FREZER", "MR_SATAN", "GOKU"],
      "Tipo de mascota inválido"
    ), 
});

const CreatePetPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
    
      petType: "",
    },
    validationSchema: createPetSchema,
    onSubmit: async (values) => {
      setErrorMessage("");
      setSuccessMessage("");
      try {
       
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
          
          else if (error.message) {
            displayMessage = error.message;
          }
        } else if (typeof error === "string") {
          
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
            <option value="VEGETA">Vegeta</option>
            <option value="FREZER">Frezer</option>
            <option value="MR_SATAN">Mr Satan</option>
            <option value="GOKU">Goku</option>
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
