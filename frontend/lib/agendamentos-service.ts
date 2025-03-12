import apiClient from "./api-client"

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
      const response = await apiClient.get<{ status: string; data: Agendamento[] }>("/agendamentos")
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async getMeusAgendamentos(): Promise<Agendamento[]> {
    try {
      const response = await apiClient.get<{ status: string; data: Agendamento[] }>("/meus-agendamentos")
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async createAgendamento(
    agendamento: Omit<Agendamento, "id" | "created_at" | "updated_at" | "aluno" | "personal">,
  ): Promise<Agendamento> {
    try {
      const response = await apiClient.post<{ status: string; data: Agendamento }>("/agendamentos", agendamento)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async updateAgendamento(id: number, agendamento: Partial<Agendamento>): Promise<Agendamento> {
    try {
      const response = await apiClient.put<{ status: string; data: Agendamento }>(`/agendamentos/${id}`, agendamento)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async deleteAgendamento(id: number): Promise<void> {
    try {
      await apiClient.delete(`/agendamentos/${id}`)
    } catch (error) {
      throw error
    }
  },
}

