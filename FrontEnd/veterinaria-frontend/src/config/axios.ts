import axios from 'axios';

// Crear instancia de Axios
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api', // Ajustar puerto si es necesario
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para inyectar token
axiosInstance.interceptors.request.use(
    (config: any) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
