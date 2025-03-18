import axiosInstance from "./axios"

const api = axiosInstance

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
      const response = await api.get<{ status: string; data: Horario[] }>('/horarios')
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async getDiasSemana(): Promise<DiaSemana[]> {
    try {
      const response = await api.get<{ status: string; data: DiaSemana[] }>('/dias-semana')
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async createHorario(horario: Omit<Horario, "id" | "created_at" | "updated_at">): Promise<Horario> {
    try {
      const response = await api.post<{ status: string; data: Horario }>('/horarios', horario)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async updateHorario(id: number, horario: Partial<Horario>): Promise<Horario> {
    try {
      const response = await api.put<{ status: string; data: Horario }>('/horarios/' + id, horario)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async deleteHorario(id: number): Promise<void> {
    try {
      await api.delete('/horarios/' + id)
    } catch (error) {
      throw error
    }
  },

  async getAulas(): Promise<Aula[]> {
    try {
      const response = await api.get<{ status: string; data: Aula[] }>('/aulas')
      return response.data.data
    } catch (error) {
      throw error
    }
  },
}

