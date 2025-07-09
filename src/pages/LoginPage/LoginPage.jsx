
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./LoginPage.module.css";

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setErrorMessage(""); 
      const { success, error } = await login(values.username, values.password);
      if (success) {
      } else {
        setErrorMessage(error || "Invalid credentials. Please try again.");
      }
    },
  });

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.loginText}>Login</h2>
      <form className={styles.formStyles} onSubmit={formik.handleSubmit}>
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

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        <Button type="submit" disabled={formik.isSubmitting || authLoading}>
          {formik.isSubmitting ? <LoadingSpinner /> : "Login"}
        </Button>
      </form>
      <p className={styles.signupTextPer}>
        ¿No tienes cuenta?{" "}
        <a onClick={() => navigate("/register")} className={styles.link}>
          Regístrate aquí
        </a>
      </p>
    </div>
  );
};

export default LoginPage;
