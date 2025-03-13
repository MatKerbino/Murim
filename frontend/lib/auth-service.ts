import axios from "axios"
import { API_URL } from "./utils"

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: number
  name: string
  email: string
  is_admin: boolean
}

export interface AuthResponse {
  status: string
  message: string
  data: {
    user: User
    access_token: string
    token_type: string
  }
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/login`, credentials)

      // Armazenar token e informações do usuário
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.data.access_token)
        localStorage.setItem("user", JSON.stringify(response.data.data.user))
      }

      return response.data.data.user
    } catch (error) {
      console.error("Error during login:", error)
      throw error
    }
  },

  async register(credentials: RegisterCredentials): Promise<void> {
    try {
      await axios.post(`${API_URL}/register`, credentials)
    } catch (error) {
      throw error
    }
  },

  async logout(): Promise<void> {
    try {
      await axios.post(`${API_URL}/logout`)
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
      // Remover token e informações do usuário mesmo se a requisição falhar
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    const userStr = localStorage.getItem("user")
    if (!userStr) return null

    try {
      return JSON.parse(userStr) as User
    } catch (error) {
      return null
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return !!this.getCurrentUser()
  },

  isAdmin(): boolean {
    if (typeof window === "undefined") return false
    const user = this.getCurrentUser()
    return user ? user.is_admin : false
  },
}

