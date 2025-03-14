import { createApiClient } from "./axios"
import axios, { isAxiosError } from "axios"

export interface PerfilUser {
  id: number
  name: string
  email: string
  telefone: string
  foto: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface UpdatePerfilData {
  name?: string
  email?: string
  current_password?: string
  password?: string
  password_confirmation?: string
  foto?: File | string | null
}

const api = createApiClient()

export const perfilService = {
  async getPerfil(): Promise<PerfilUser> {
    try {
      const response = await api.get<{ status: string; data: PerfilUser }>("/perfil")
      return response.data.data
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Erro ao buscar perfil:", error.response?.data || error.message)
      } else {
        console.error("Erro inesperado:", error)
      }
      throw error
    }
  },

  async updatePerfil(data: UpdatePerfilData): Promise<PerfilUser> {
    try {
      // Criar FormData para enviar dados, incluindo possível imagem
      const formData = new FormData()

      // Adicionar campos de texto
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && key !== "foto") {
          formData.append(key, value as string)
        }
      })

      // Adicionar foto se existir
      if (data.foto) {
        if (typeof data.foto === "string" && data.foto.startsWith("data:")) {
          // Converter base64 para blob
          const response = await fetch(data.foto)
          const blob = await response.blob()
          formData.append("foto", blob, "profile.jpg")
        } else if (typeof data.foto !== "string") {
          // É um arquivo
          formData.append("foto", data.foto)
        } else {
          // É uma URL
          formData.append("foto", data.foto)
        }
      }

      const response = await api.post<{ status: string; data: PerfilUser }>("/perfil?_method=PUT", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data.data
    } catch (error) {
      throw error
    }
  },
}

