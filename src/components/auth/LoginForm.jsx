import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AuthForms.module.css';
import authService from '../../services/authService';

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const data = await authService.login(formData);
      
      localStorage.setItem('token', data.token);
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      console.log('Login successful', data);
      
      navigate('/dashboard');
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.authForm} onSubmit={handleSubmit}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <div className={styles.formGroup}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={loading}
          autoComplete="username"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <div className={styles.passwordWrapper}>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            autoComplete="current-password"
          />
          <Link to="/forgot-password" className={styles.forgotPassword}>Forgot password?</Link>
        </div>
      </div>

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}; 