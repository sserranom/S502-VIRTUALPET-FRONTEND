
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./RegisterPage.module.css";

const registerSchema = Yup.object().shape({
  username: Yup.string()
    .required("El nombre de usuario es requerido")
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password: Yup.string()
    .required("La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: Yup.string()
    .required("Confirma tu contraseña")
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden"),
});

const RegisterPage = () => {
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
  
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setErrorMessage("");
      setSuccessMessage("");

      const defaultRoles = ["USER"];

      const { success, error } = await register(
        values.username,
        values.password,
        defaultRoles
      );
      if (success) {
        setSuccessMessage("¡Registro exitoso! Redirigiendo...");
    
      } else {
        setErrorMessage(
          error || "Hubo un error en el registro. Inténtalo de nuevo."
        );
      }
    },
  });

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.registerContainer}>
      <h2>Registrarse</h2>
      <form onSubmit={formik.handleSubmit}>
        <InputField
          label="Nombre de Usuario"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && formik.errors.username}
        />
        <InputField
          label="Contraseña"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && formik.errors.password}
        />
        <InputField
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}

        <Button type="submit" disabled={formik.isSubmitting || authLoading}>
          {formik.isSubmitting ? <LoadingSpinner /> : "Registrarse"}
        </Button>
      </form>
      <p className={styles.loginText}>
        ¿Ya tienes cuenta?{" "}
        <a onClick={() => navigate("/login")} className={styles.link}>
          Inicia sesión aquí
        </a>
      </p>
    </div>
  );
};

export default RegisterPage;
