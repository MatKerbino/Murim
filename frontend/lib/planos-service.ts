import axios from "axios"
import { API_URL } from "./utils"

export interface Plano {
  id: number
  nome: string
  descricao: string
  valor: number
  duracao: number
  beneficios: string[]
  imagem?: string | null
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

export const planosService = {
  async getPlanos(): Promise<Plano[]> {
    try {
      const response = await axios.get(`${API_URL}/planos`)
      return response.data.data || []
    } catch (error) {
      console.error("Erro ao buscar planos:", error)
      throw error
    }
  },

  async getPlano(id: number): Promise<Plano> {
    try {
      const response = await axios.get(`${API_URL}/planos/${id}`)
      return response.data.data
    } catch (error) {
      console.error(`Erro ao buscar plano ${id}:`, error)
      throw error
    }
  },

  async createPlano(plano: Omit<Plano, "id" | "created_at" | "updated_at">): Promise<Plano> {
    try {
      const response = await api.post("/planos", plano)
      return response.data.data
    } catch (error) {
      console.error("Erro ao criar plano:", error)
      throw error
    }
  },

  async updatePlano(id: number, plano: Partial<Plano>): Promise<Plano> {
    try {
      const response = await api.put(`/planos/${id}`, plano)
      return response.data.data
    } catch (error) {
      console.error("Erro ao atualizar plano:", error)
      throw error
    }
  },

  async deletePlano(id: number): Promise<void> {
    try {
      await api.delete(`/planos/${id}`)
    } catch (error) {
      console.error("Erro ao excluir plano:", error)
      throw error
    }
  },

  async getMeusPlanos(): Promise<Plano[]> {
    try {
      const response = await api.get("/meus-planos")
      return response.data.data || []
    } catch (error) {
      console.error("Erro ao buscar meus planos:", error)
      throw error
    }
  },

  async assinarPlano(planoId: number): Promise<any> {
    try {
      const response = await api.post(`/planos/${planoId}/assinar`)
      return response.data.data
    } catch (error) {
      console.error("Erro ao assinar plano:", error)
      throw error
    }
  },
}

