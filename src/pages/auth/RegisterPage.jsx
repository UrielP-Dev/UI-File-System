import React from 'react';
import { Link } from 'react-router-dom';
import { RegisterForm } from '../../components/auth/RegisterForm';
import styles from './AuthPage.module.css';

export const RegisterPage = () => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.formContainer}>
        <h1>Create a Cloud Storage Account</h1>
        <p className={styles.description}>
          Sign up to access file storage and management features.
        </p>
        <RegisterForm />
        <div className={styles.linkContainer}>
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <img src="/assets/cloud-storage.svg" alt="Cloud Storage" />
      </div>
    </div>
  );
};

// También exportamos como default para compatibilidad
export default RegisterPage; 