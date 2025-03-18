import { API_BASE_URL, fetchConfig, checkResponse, handleApiError } from './api.config';

const authService = {
    login: async (credentials) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                ...fetchConfig,
                method: 'POST',
                body: JSON.stringify(credentials)
            });
            return await checkResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    register: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                ...fetchConfig,
                method: 'POST',
                body: JSON.stringify(userData)
            });
            return await checkResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    getMe: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                ...fetchConfig,
                headers: {
                    ...fetchConfig.headers,
                    'Authorization': `Bearer ${token}`
                }
            });
            return await checkResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    }
};

export default authService; 