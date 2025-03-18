import { API_BASE_URL, fetchConfig, checkResponse, handleApiError } from './api.config';

const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No se encontró el token de autenticación');
    }
    return token;
};

export const fileService = {
    // Obtener todos los archivos
    getAllFiles: async () => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_BASE_URL}/files`, {
                ...fetchConfig,
                headers: {
                    ...fetchConfig.headers,
                    'Authorization': `Bearer ${token}`
                }
            });
            return await checkResponse(response);
        } catch (error) {
            console.error('Get files error details:', error);
            throw error;
        }
    },

    // Crear un nuevo archivo
    createFile: async (fileData) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_BASE_URL}/files`, {
                ...fetchConfig,
                method: 'POST',
                headers: {
                    ...fetchConfig.headers,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(fileData)
            });
            return await checkResponse(response);
        } catch (error) {
            console.error('Create file error details:', error);
            throw error;
        }
    },

    // Actualizar un archivo
    updateFile: async (fileId, fileData) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
                ...fetchConfig,
                method: 'PUT',
                headers: {
                    ...fetchConfig.headers,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(fileData)
            });
            return await checkResponse(response);
        } catch (error) {
            console.error('Update file error details:', error);
            throw error;
        }
    },

    // Eliminar un archivo
    deleteFile: async (fileId) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No tienes permisos para eliminar este archivo');
            }

            return await response.json();
        } catch (error) {
            console.error('Delete file error details:', error);
            if (error.message.includes('token')) {
                throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            }
            throw error;
        }
    }
}; 