import { API_BASE_URL, fetchConfig, checkResponse, handleApiError } from './api.config';

export const fileService = {
    // Obtener todos los archivos
    getAllFiles: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/files`, fetchConfig);
            return await checkResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Crear un nuevo archivo
    createFile: async (fileData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/files`, {
                ...fetchConfig,
                method: 'POST',
                body: JSON.stringify(fileData)
            });
            return await checkResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Actualizar un archivo
    updateFile: async (fileId, fileData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
                ...fetchConfig,
                method: 'PUT',
                body: JSON.stringify(fileData)
            });
            return await checkResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Eliminar un archivo
    deleteFile: async (fileId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
                ...fetchConfig,
                method: 'DELETE'
            });
            return await checkResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    }
}; 