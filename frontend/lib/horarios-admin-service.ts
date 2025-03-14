import { createApiClient } from "./axios"

export interface DiaSemana {
  id: number
  nome: string
  created_at: string
  updated_at: string
}

export interface Horario {
  id: number
  dia_semana_id: number
  hora_inicio: string
  hora_fim: string
  created_at: string
  updated_at: string
  dia_semana?: DiaSemana
}

const api = createApiClient()

export const horariosAdminService = {
  async getHorarios(): Promise<Horario[]> {
    try {
      const response = await api.get("/horarios")
      return response.data.data || []
    } catch (error) {
      console.error("Erro ao buscar horários:", error)
      throw error
    }
  },

  async getDiasSemana(): Promise<DiaSemana[]> {
    try {
      const response = await api.get("/dias-semana")
      return response.data.data || []
    } catch (error) {
      console.error("Erro ao buscar dias da semana:", error)
      throw error
    }
  },

  async createHorario(horario: Omit<Horario, "id" | "created_at" | "updated_at" | "dia_semana">): Promise<Horario> {
    try {
      const response = await api.post("/horarios", horario)
      return response.data.data
    } catch (error) {
      console.error("Erro ao criar horário:", error)
      throw error
    }
  },

  async updateHorario(id: number, horario: Partial<Horario>): Promise<Horario> {
    try {
      const response = await api.put(`/horarios/${id}`, horario)
      return response.data.data
    } catch (error) {
      console.error("Erro ao atualizar horário:", error)
      throw error
    }
  },

  async deleteHorario(id: number): Promise<void> {
    try {
      await api.delete(`/horarios/${id}`)
    } catch (error) {
      console.error("Erro ao excluir horário:", error)
      throw error
    }
  },
}

