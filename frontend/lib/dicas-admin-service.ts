import { createApiClient } from "./axios"
import axios, { isAxiosError } from "axios"

export interface CategoriaDica {
  id: number
  nome: string
  slug: string
  created_at: string
  updated_at: string
}

export interface Dica {
  id: number
  titulo: string
  slug: string
  conteudo: string
  imagem: string | null
  categoria_id: number
  categoria?: CategoriaDica
  autor_id: number
  autor?: {
    id: number
    name: string
  }
  publicado: boolean
  destaque: boolean
  created_at: string
  updated_at: string
}

const api = createApiClient()

export const dicasAdminService = {
  async getDicas(): Promise<Dica[]> {
    try {
      const response = await api.get("/dicas")
      return response.data.data || []
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Erro ao buscar dicas:", error.response?.data || error.message)
      } else {
        console.error("Erro inesperado:", error)
      }
      throw error
    }
  },

  async getDica(id: number): Promise<Dica> {
    try {
      const response = await api.get(`/dicas/${id}`)
      return response.data.data
    } catch (error) {
      console.error("Erro ao buscar dica:", error)
      throw error
    }
  },

  async createDica(dica: FormData): Promise<Dica> {
    try {
      const response = await api.post<Dica>("/dicas", dica, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data.data
    } catch (error) {
      console.error("Erro ao criar dica:", error)
      throw error
    }
  },

  async updateDica(id: number, dica: FormData): Promise<Dica> {
    try {
      const response = await api.post<Dica>(`/dicas/${id}?_method=PUT`, dica, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data.data
    } catch (error) {
      console.error("Erro ao atualizar dica:", error)
      throw error
    }
  },

  async deleteDica(id: number): Promise<void> {
    try {
      await api.delete(`/dicas/${id}`)
    } catch (error) {
      console.error("Erro ao excluir dica:", error)
      throw error
    }
  },

  async getCategorias(): Promise<CategoriaDica[]> {
    try {
      const response = await api.get("/categorias-dicas")
      return response.data.data
    } catch (error) {
      console.error("Erro ao buscar categorias:", error)
      throw error
    }
  },

  async getCategoria(id: number): Promise<CategoriaDica> {
    try {
      const response = await api.get(`/categorias-dicas/${id}`)
      return response.data.data
    } catch (error) {
      console.error("Erro ao buscar categoria:", error)
      throw error
    }
  },

  async createCategoria(categoria: { nome: string }): Promise<CategoriaDica> {
    try {
      const response = await api.post<CategoriaDica>("/categorias-dicas", categoria)
      return response.data.data
    } catch (error) {
      console.error("Erro ao criar categoria:", error)
      throw error
    }
  },

  async updateCategoria(id: number, categoria: { nome: string }): Promise<CategoriaDica> {
    try {
      const response = await api.put<CategoriaDica>(`/categorias-dicas/${id}`, categoria)
      return response.data.data
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error)
      throw error
    }
  },

  async deleteCategoria(id: number): Promise<void> {
    try {
      await api.delete(`/categorias-dicas/${id}`)
    } catch (error) {
      console.error("Erro ao excluir categoria:", error)
      throw error
    }
  },
}

