import axios from "axios"
import { API_URL } from "./utils"

export interface CategoriaDica {
  id: number
  nome: string
  created_at: string
  updated_at: string
}

export interface Dica {
  id: number
  titulo: string
  conteudo: string
  imagem: string | null
  categoria_id: number
  user_id: number
  created_at: string
  updated_at: string
  categoria?: CategoriaDica
  user?: {
    id: number
    name: string
  }
  comentarios_count?: number
  curtidas_count?: number
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

export const dicasAdminService = {
  async getDicas(): Promise<Dica[]> {
    try {
      const response = await api.get("/dicas")
      return response.data.data || []
    } catch (error) {
      console.error("Erro ao buscar dicas:", error)
      throw error
    }
  },

  async getDica(id: number): Promise<Dica> {
    try {
      const response = await api.get(`/dicas/${id}`)
      return response.data.data
    } catch (error) {
      console.error(`Erro ao buscar dica ${id}:`, error)
      throw error
    }
  },

  async getCategorias(): Promise<CategoriaDica[]> {
    try {
      const response = await api.get("/categorias-dicas")
      return response.data.data || []
    } catch (error) {
      console.error("Erro ao buscar categorias de dicas:", error)
      throw error
    }
  },

  async createDica(dica: FormData): Promise<Dica> {
    try {
      const response = await api.post("/dicas", dica, {
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
      const response = await api.post(`/dicas/${id}`, dica, {
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

  async createCategoria(categoria: { nome: string }): Promise<CategoriaDica> {
    try {
      const response = await api.post("/categorias-dicas", categoria)
      return response.data.data
    } catch (error) {
      console.error("Erro ao criar categoria:", error)
      throw error
    }
  },

  async updateCategoria(id: number, categoria: { nome: string }): Promise<CategoriaDica> {
    try {
      const response = await api.put(`/categorias-dicas/${id}`, categoria)
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

