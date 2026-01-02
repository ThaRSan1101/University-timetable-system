import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token header to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors (token expiration)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    const response = await axios.post('http://localhost:8000/api/auth/refresh/', {
                        refresh: refreshToken
                    });

                    const newAccessToken = response.data.access;
                    localStorage.setItem('access_token', newAccessToken);

                    // Update the header on the original request
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    // Update the default header for future requests
                    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Token refresh failed", refreshError);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            } else {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
