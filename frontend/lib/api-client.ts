import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Importante para cookies de autenticação
})

// Interceptor para adicionar o token de autenticação
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Interceptor para tratar erros de resposta
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Se o erro for 401 (não autorizado) e não for uma tentativa de login
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== "/login") {
      // Redirecionar para a página de login
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  },
)

// Define a type for API errors
export type ApiError = {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
};

// Generic data fetching class to handle API requests
export class ApiClient<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // Get all items
  async getAll(): Promise<T[]> {
    try {
      const response = await axios.get<{ data: T[] }>(this.endpoint);
      return response.data.data || [];
    } catch (error: any) {
      console.error(`Error fetching ${this.endpoint}:`, error);
      throw this.handleError(error);
    }
  }

  // Get a specific item by ID
  async getById(id: number | string): Promise<T> {
    try {
      const response = await axios.get<{ data: T }>(`${this.endpoint}/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error(`Error fetching ${this.endpoint}/${id}:`, error);
      throw this.handleError(error);
    }
  }

  // Create a new item
  async create(data: Partial<T>): Promise<T> {
    try {
      const response = await axios.post<{ data: T }>(this.endpoint, data);
      return response.data.data;
    } catch (error: any) {
      console.error(`Error creating ${this.endpoint}:`, error);
      throw this.handleError(error);
    }
  }

  // Update an existing item
  async update(id: number | string, data: Partial<T>): Promise<T> {
    try {
      const response = await axios.put<{ data: T }>(`${this.endpoint}/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      console.error(`Error updating ${this.endpoint}/${id}:`, error);
      throw this.handleError(error);
    }
  }

  // Delete an item
  async delete(id: number | string): Promise<void> {
    try {
      await axios.delete(`${this.endpoint}/${id}`);
    } catch (error: any) {
      console.error(`Error deleting ${this.endpoint}/${id}:`, error);
      throw this.handleError(error);
    }
  }

  // Error handling utility
  private handleError(error: any): ApiError {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        status: error.response.status,
        message: error.response.data.message || 'An error occurred',
        errors: error.response.data.errors
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        status: 0,
        message: 'No response from server. Please check your connection.'
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        status: 0,
        message: error.message || 'An unknown error occurred'
      };
    }
  }
}

export default apiClient

