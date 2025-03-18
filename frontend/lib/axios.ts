import axios from 'axios';
export const API_URL = process.env.NEXT_PUBLIC_API_URL

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // Base URL of your Laravel API
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor for authentication tokens if needed
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log("Token enviado:", token); // Log para verificar o token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login page)
      console.error('Unauthorized access. Please log in again.');
      // Optionally clear local storage or redirect
    }
    
    // Log errors for debugging
    console.error('API Error:', error.response?.data || error.message);
    
    return Promise.reject(error);
  }
);

// Function to create a new Axios client
export const createApiClient = () => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    withCredentials: true, // Isso garante que cookies serão enviados com as requisições
  });
  
  return api;
};

export default axiosInstance; 