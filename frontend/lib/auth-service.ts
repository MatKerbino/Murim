import apiClient from "./api-client"

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

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await apiClient.post<AuthResponse>("/login", credentials)

      // Armazenar token e informações do usuário
      localStorage.setItem("token", response.data.data.access_token)
      localStorage.setItem("user", JSON.stringify(response.data.data.user))

      return response.data.data.user
    } catch (error) {
      throw error
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/logout")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    } finally {
      // Remover token e informações do usuário mesmo se a requisição falhar
      localStorage.removeItem("token")
      localStorage.removeItem("user")
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

