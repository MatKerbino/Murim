import axios from "axios"
import { API_URL } from "./utils"

export interface Agendamento {
  id: number
  aluno_id: number
  personal_id: number
  data: string
  horario: string
  status: "pendente" | "confirmado" | "cancelado"
  observacoes: string | null
  created_at: string
  updated_at: string
  aluno?: {
    id: number
    nome: string
  }
  personal?: {
    id: number
    nome: string
    especialidade: string
  }
}

export const agendamentosService = {
  async getAgendamentos(): Promise<Agendamento[]> {
    try {
      const response = await axios.get(`${API_URL}/agendamentos`)
      if (response.data && response.data.data) {
        return response.data.data
      }
      return response.data
    } catch (error) {
      console.error("Error fetching agendamentos:", error)
      throw error
    }
  },

  async getAgendamento(id: number): Promise<Agendamento> {
    try {
      const response = await axios.get(`${API_URL}/agendamentos/${id}`)
      return response.data.data || response.data
    } catch (error) {
      console.error(`Error fetching agendamento with id ${id}:`, error)
      throw error
    }
  },

  async createAgendamento(agendamento: Omit<Agendamento, "id" | "created_at" | "updated_at">): Promise<Agendamento> {
    try {
      const response = await axios.post(`${API_URL}/agendamentos`, agendamento)
      return response.data.data || response.data
    } catch (error) {
      console.error("Error creating agendamento:", error)
      throw error
    }
  },

  async updateAgendamento(id: number, agendamento: Partial<Agendamento>): Promise<Agendamento> {
    try {
      const response = await axios.post(
        `${API_URL}/agendamentos/${id}?_method=PUT`,
        agendamento
      )
      return response.data.data || response.data
    } catch (error) {
      console.error(`Error updating agendamento with id ${id}:`, error)
      throw error
    }
  },

  async deleteAgendamento(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/agendamentos/${id}`)
    } catch (error) {
      console.error(`Error deleting agendamento with id ${id}:`, error)
      throw error
    }
  },
}

