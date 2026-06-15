import axios from 'axios';

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
const API_URL = `${BACKEND_URL}/api/v1`;

export const getFileUrl = (path?: string) => {
    if (!path) return '/images/placeholder.png';
    if (path.startsWith('http')) return path;
    return `${BACKEND_URL}${path}`;
};

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the JWT token to headers
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('truckdorkar-access-token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('truckdorkar-refresh-token');

            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
                    const { accessToken } = response.data;

                    localStorage.setItem('truckdorkar-access-token', accessToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    // If refresh token fails, logout user
                    localStorage.removeItem('truckdorkar-access-token');
                    localStorage.removeItem('truckdorkar-refresh-token');
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
