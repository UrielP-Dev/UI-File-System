const API_URL = 'http://localhost:8080';

/**
 * Función para hacer peticiones HTTP autenticadas
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} options - Opciones de fetch (method, body, etc.)
 * @returns {Promise} - Promesa con la respuesta
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Si la respuesta es 401 (Unauthorized), redirigir a login
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Servicios de autenticación
 */
export const authService = {
  login: async (credentials) => {
    return fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    }).then(res => {
      if (!res.ok) {
        return res.json().then(err => { throw new Error(err.message || 'Invalid credentials'); });
      }
      return res.json();
    });
  },
  
  register: async (userData) => {
    return fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    }).then(res => {
      if (!res.ok) {
        return res.json().then(err => { throw new Error(err.message || 'Registration failed'); });
      }
      return res.json();
    });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default { apiRequest, authService }; 