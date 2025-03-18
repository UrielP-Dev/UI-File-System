// Funciones para manejar tokens JWT y autenticación

// Verificar si el token JWT ha expirado
export const isTokenExpired = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    const { exp } = JSON.parse(jsonPayload);
    const expired = Date.now() >= exp * 1000;
    
    return expired;
  } catch (error) {
    return true; // Si hay algún error, consideramos que el token ha expirado
  }
};

// Parseamos información del token
export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Obtener roles de usuario desde el token
export const getUserRoles = (token) => {
  try {
    const decoded = parseJwt(token);
    return decoded?.role || 'USER';
  } catch (error) {
    return 'USER';
  }
};

// Verificar si el usuario tiene un rol específico
export const hasRole = (token, requiredRole) => {
  try {
    const userRole = getUserRoles(token);
    return userRole === requiredRole;
  } catch (error) {
    return false;
  }
};

export default {
  isTokenExpired,
  parseJwt,
  getUserRoles,
  hasRole
}; 