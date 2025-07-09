
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
    .required("Username is required")
    .min(3, "The username must be at least 3 characters long."),
  password: Yup.string()
    .required("Password is required")
    .min(6, "The password must be at least 6 characters long."),
  confirmPassword: Yup.string()
    .required("Confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords do not match"),
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
        setSuccessMessage("Registration successful! Redirecting...");
    
      } else {
        setErrorMessage(
          error || "There was an error during registration. Please try again."
        );
      }
    },
  });

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.registerContainer}>
      <h2>Register</h2>
      <form onSubmit={formik.handleSubmit} className={styles.formRegister}>
        <InputField
          label="Username"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && formik.errors.username}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && formik.errors.password}
        />
        <InputField
          label="Confirm Password"
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
          {formik.isSubmitting ? <LoadingSpinner /> : "Register"}
        </Button>
      </form>
      <p className={styles.loginText}>
        Already have an account?{" "}
        <a onClick={() => navigate("/login")} className={styles.link}>
          Sign in here
        </a>
      </p>
    </div>
  );
};

export default RegisterPage;
