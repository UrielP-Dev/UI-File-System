import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthForms.module.css';
import authService from '../../services/authService';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    company: '',
    role: 'USER'  // Valor predeterminado
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando se modifica algún campo
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validación básica de campos
    if (!formData.username.trim() || !formData.email.trim() || !formData.company.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Preparar datos para enviar
    const dataToSubmit = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      company: formData.company,
      role: formData.role
    };
    
    try {
      setLoading(true);
      setError('');
      
      await authService.register(dataToSubmit);
      
      // Mostrar mensaje de éxito
      setSuccess(true);
      
      // Esperar 2 segundos y redirigir a la página de login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.authForm} onSubmit={handleSubmit}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>Registration successful! Redirecting to login...</div>}
      
      <div className={styles.formGroup}>
        <label htmlFor="email">Email address</label>
        <p className={styles.fieldDescription}>Used for account recovery and administrative functions</p>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading || success}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="username">Username</label>
        <p className={styles.fieldDescription}>Your unique identifier for this platform</p>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={loading || success}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="company">Company</label>
        <p className={styles.fieldDescription}>Your organization or company name</p>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
          disabled={loading || success}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading || success}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={loading || success}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="role">Role</label>
        <p className={styles.fieldDescription}>User permissions level</p>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className={styles.selectInput}
          disabled={loading || success}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={loading || success}
      >
        {loading ? 'Creating Account...' : success ? 'Account Created!' : 'Create Account'}
      </button>

      <div className={styles.divider}>
        <span>OR</span>
      </div>

      <div className={styles.signin}>
        <a href="/login" className={styles.signinLink}>
          Sign in to an existing account
        </a>
      </div>
    </form>
  );
}; 