import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

// Crear contexto
const AuthContext = createContext(null);

// Proveedor de contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Cargar usuario desde localStorage al inicio
  useEffect(() => {
    // Check if user is already logged in (token exists in localStorage)
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Error parsing user data', e);
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (username, password) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }
      
      // Save token and user data
      localStorage.setItem('token', data.token);
      
      // Fetch user info if not returned directly
      if (!data.user) {
        const userResponse = await fetch('http://localhost:8080/auth/me', {
          headers: {
            'Authorization': `Bearer ${data.token}`
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        } else {
          const userData = { username };
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
      } else {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
      
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para registrarse
  const register = async (userData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 