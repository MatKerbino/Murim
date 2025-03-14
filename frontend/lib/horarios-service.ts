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

export interface Horario {
  id: number
  dia_semana_id: number
  hora_inicio: string
  hora_fim: string
  tipo_aula?: string
  created_at: string
  updated_at: string
  dia_semana?: {
    id: number
    nome: string
  }
}

export const horariosService = {
  async getHorarios(): Promise<Horario[]> {
    try {
      const response = await axios.get<{ status: string; data: Horario[] }>(`${API_URL}/horarios`)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async getDiasSemana(): Promise<DiaSemana[]> {
    try {
      const response = await axios.get<{ status: string; data: DiaSemana[] }>(`${API_URL}/dias-semana`)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async createHorario(horario: Omit<Horario, "id" | "created_at" | "updated_at">): Promise<Horario> {
    try {
      const response = await axios.post<{ status: string; data: Horario }>(`${API_URL}/horarios`, horario)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async updateHorario(id: number, horario: Partial<Horario>): Promise<Horario> {
    try {
      const response = await axios.put<{ status: string; data: Horario }>(`${API_URL}/horarios/${id}`, horario)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async deleteHorario(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/horarios/${id}`)
    } catch (error) {
      throw error
    }
  },

  async getAulas(): Promise<Aula[]> {
    try {
      const response = await axios.get<{ status: string; data: Aula[] }>(`${API_URL}/aulas`)
      return response.data.data
    } catch (error) {
      throw error
    }
  },
}

