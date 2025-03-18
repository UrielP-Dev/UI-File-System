import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../../components/auth/LoginForm';
import styles from './AuthPage.module.css';

export const LoginPage = () => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.formContainer}>
        <h1>Sign in to Cloud Storage</h1>
        <p className={styles.description}>
          Enter your username and password to access your files and storage.
        </p>
        <LoginForm />
        <div className={styles.linkContainer}>
          <p>
            New to Cloud Storage? <Link to="/register">Create an account</Link>
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
export default LoginPage; 