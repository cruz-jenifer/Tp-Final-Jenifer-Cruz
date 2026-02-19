import { store } from '../store';

const BASE_URL = 'http://localhost:3001/api';

// TIPO GENERICO PARA LA RESPUESTA DE LA API
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
}

// FUNCION AUXILIAR PARA MANEJAR RESPUESTAS
async function handleResponse(response: Response) {
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }

    return data;
}

// WRAPPER DE FETCH API
export const api = {
    get: async <T>(url: string): Promise<T> => {
        const state = store.getState();
        const token = state.auth.token || localStorage.getItem('token');

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        };

        const response = await fetch(`${BASE_URL}${url}`, requestOptions);
        return handleResponse(response);
    },

    post: async <T>(url: string, body: unknown): Promise<T> => {
        const state = store.getState();
        const token = state.auth.token || localStorage.getItem('token');

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(body)
        };

        const response = await fetch(`${BASE_URL}${url}`, requestOptions);
        return handleResponse(response);
    },

    put: async <T>(url: string, body: unknown): Promise<T> => {
        const state = store.getState();
        const token = state.auth.token || localStorage.getItem('token');

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(body)
        };

        const response = await fetch(`${BASE_URL}${url}`, requestOptions);
        return handleResponse(response);
    },

    delete: async <T>(url: string): Promise<T> => {
        const state = store.getState();
        const token = state.auth.token || localStorage.getItem('token');

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        };

        const response = await fetch(`${BASE_URL}${url}`, requestOptions);
        return handleResponse(response);
    }
};
