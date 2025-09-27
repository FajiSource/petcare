import axios, { InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiService = axios.create({
    baseURL: API_BASE_URL,
});


apiService.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

apiService.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            console.error('API Error:', error.response.data);
        }
        return Promise.reject(error);
    }
);


export default apiService;
