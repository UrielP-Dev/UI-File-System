export const API_BASE_URL = import.meta.env.VITE_API_URL;

// Configuración base para las peticiones fetch
export const fetchConfig = {
    headers: {
        'Content-Type': 'application/json'
    }
};

// Función helper para manejar errores
export const handleApiError = (error) => {
    console.error('Error en la petición:', error);
    throw error;
};

// Función helper para verificar la respuesta
export const checkResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error en la petición');
    }
    return response.json();
}; 