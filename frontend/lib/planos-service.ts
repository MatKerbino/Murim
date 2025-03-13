import axios from "axios"
import { API_URL } from "./utils"

export interface Plano {
  id: number
  nome: string
  descricao: string
  valor: number
  duracao: number
  beneficios: string[]
  created_at: string
  updated_at: string
}

export const planosService = {
  async getPlanos(): Promise<Plano[]> {
    try {
      const response = await axios.get(`${API_URL}/planos`)
      return response.data.data || response.data
    } catch (error) {
      console.error("Error fetching planos:", error)
      throw error
    }
  },

  async getPlano(id: number): Promise<Plano> {
    try {
      const response = await axios.get(`${API_URL}/planos/${id}`)
      return response.data.data || response.data
    } catch (error) {
      console.error(`Error fetching plano with id ${id}:`, error)
      throw error
    }
  },

  async createPlano(plano: Omit<Plano, "id" | "created_at" | "updated_at">): Promise<Plano> {
    try {
      const response = await axios.post(`${API_URL}/planos`, plano)
      return response.data.data || response.data
    } catch (error) {
      console.error("Error creating plano:", error)
      throw error
    }
  },

  async updatePlano(id: number, plano: Partial<Plano>): Promise<Plano> {
    try {
      const response = await axios.post(`${API_URL}/planos/${id}?_method=PUT`, plano)
      return response.data.data || response.data
    } catch (error) {
      console.error(`Error updating plano with id ${id}:`, error)
      throw error
    }
  },

  async deletePlano(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/planos/${id}`)
    } catch (error) {
      console.error(`Error deleting plano with id ${id}:`, error)
      throw error
    }
  },
}

