import { createApiClient } from "./axios"

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

const api = createApiClient()

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

