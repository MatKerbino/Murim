import axios from "axios"
import { API_URL } from "./utils"

export interface DiaSemana {
  id: number
  nome: string
  ordem: number
  aulas: Aula[]
}

export interface Aula {
  id: number
  nome: string
  descricao: string | null
  dia_semana_id: number
  horario_inicio: string
  horario_fim: string
  instrutor: string
  capacidade_maxima: number
  ativa: boolean
  created_at: string
  updated_at: string
}

export const horariosService = {
  async getHorarios(): Promise<DiaSemana[]> {
    try {
      const response = await axios.get(`${API_URL}/aulas`)
      return response.data.data || response.data
    } catch (error) {
      console.error("Error fetching horarios:", error)
      throw error
    }
  },

  async getDiasSemana(): Promise<DiaSemana[]> {
    try {
      const response = await axios.get(`${API_URL}/dias-semana`)
      return response.data.data || response.data
    } catch (error) {
      console.error("Error fetching dias da semana:", error)
      throw error
    }
  },

  async createAula(aula: Omit<Aula, "id" | "created_at" | "updated_at">): Promise<Aula> {
    try {
      const response = await axios.post(`${API_URL}/aulas`, aula)
      return response.data.data || response.data
    } catch (error) {
      console.error("Error creating aula:", error)
      throw error
    }
  },

  async updateAula(id: number, aula: Partial<Aula>): Promise<Aula> {
    try {
      const response = await axios.post(`${API_URL}/aulas/${id}?_method=PUT`, aula)
      return response.data.data || response.data
    } catch (error) {
      console.error(`Error updating aula with id ${id}:`, error)
      throw error
    }
  },

  async deleteAula(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/aulas/${id}`)
    } catch (error) {
      console.error(`Error deleting aula with id ${id}:`, error)
      throw error
    }
  },
}
// These files don't directly use localStorage, but they might be affected by the auth-service.
// The issue is likely in the api-client.ts file that's used by these services.
// No changes needed here as the issue is in the api-client.ts file.

