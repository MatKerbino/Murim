import axios from "axios"
import { API_URL } from "./utils"

export interface Usuario {
  id: number
  name: string
  email: string
  is_admin: boolean
  is_aluno: boolean
  is_online: boolean
  last_login: string | null
  created_at: string
  updated_at: string
}

// Configuração do cliente axios com interceptor para token
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Adiciona o token em todas as requisições
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export const usuariosService = {
  async getUsuarios(): Promise<Usuario[]> {
    try {
      const response = await api.get("/admin/usuarios")
      return response.data.data
    } catch (error) {
      console.error("Erro ao buscar usuários:", error)
      throw error
    }
  },

  async getUsuario(id: number): Promise<Usuario> {
    try {
      const response = await api.get(`/admin/usuarios/${id}`)
      return response.data.data
    } catch (error) {
      console.error(`Erro ao buscar usuário ${id}:`, error)
      throw error
    }
  },

  async toggleAdminStatus(id: number, isAdmin: boolean): Promise<Usuario> {
    try {
      const response = await api.put(`/admin/usuarios/${id}/admin`, { is_admin: isAdmin })
      return response.data.data
    } catch (error) {
      console.error("Erro ao alterar status de admin:", error)
      throw error
    }
  },

  async getUsuariosLogados(): Promise<Usuario[]> {
    try {
      const response = await api.get("/admin/usuarios/online")
      return response.data.data
    } catch (error) {
      console.error("Erro ao buscar usuários online:", error)
      throw error
    }
  },
}

