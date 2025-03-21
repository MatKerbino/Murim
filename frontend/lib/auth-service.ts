import axiosInstance from "./axios"

const api = axiosInstance

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

export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
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
      const response = await api.post<AuthResponse>("/login", credentials)

      // Armazenar token e informações do usuário
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.data.access_token)
        localStorage.setItem("user", JSON.stringify(response.data.data.user))
      }

      return response.data.data.user
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data as ApiErrorResponse

        // Formatar mensagens de erro
        if (errorData.errors) {
          const formattedErrors: Record<string, string> = {}

          // Converter array de erros para string única por campo
          Object.entries(errorData.errors).forEach(([field, messages]) => {
            formattedErrors[field] = messages[0]
          })

          throw { message: errorData.message, errors: formattedErrors }
        }

        throw { message: errorData.message }
      }

      throw { message: "Ocorreu um erro ao fazer login. Tente novamente." }
    }
  },

  async register(credentials: RegisterCredentials): Promise<void> {
    try {
      await api.post("/register", credentials)
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data as ApiErrorResponse

        // Formatar mensagens de erro
        if (errorData.errors) {
          const formattedErrors: Record<string, string> = {}

          // Converter array de erros para string única por campo
          Object.entries(errorData.errors).forEach(([field, messages]) => {
            formattedErrors[field] = messages[0]
          })

          throw { message: errorData.message, errors: formattedErrors }
        }

        throw { message: errorData.message }
      }

      throw { message: "Ocorreu um erro ao fazer cadastro. Tente novamente." }
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/logout")
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

  getCurrentUser(): any {
    // Verifique se estamos no ambiente do cliente
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      
      // Se não houver token, o usuário não está autenticado
      if (!token) {
        return null;
      }
      
      // Obter informações do usuário do localStorage ou de um estado global
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          return JSON.parse(userString);
        } catch (error) {
          console.error('Erro ao obter informações do usuário:', error);
          return null;
        }
      }
    }
    
    return null;
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

