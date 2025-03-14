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

export const agendamentosService = {
  async getAgendamentos(): Promise<Agendamento[]> {
    try {
      const response = await api.get("/agendamentos")
      if (response.data && response.data.data) {
        return response.data.data
      }
      return response.data || []
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error)
      throw error
    }
  },

  async getMeusAgendamentos(): Promise<Agendamento[]> {
    try {
      const response = await api.get("/meus-agendamentos")
      return response.data.data || []
    } catch (error) {
      console.error("Erro ao buscar meus agendamentos:", error)
      throw error
    }
  },

  async createAgendamento(
    agendamento: Omit<Agendamento, "id" | "created_at" | "updated_at" | "aluno" | "personal">,
  ): Promise<Agendamento> {
    try {
      const response = await api.post("/agendamentos", agendamento)
      return response.data.data
    } catch (error) {
      console.error("Erro ao criar agendamento:", error)
      throw error
    }
  },

  async updateAgendamento(id: number, agendamento: Partial<Agendamento>): Promise<Agendamento> {
    try {
      const response = await api.put(`/agendamentos/${id}`, agendamento)
      return response.data.data
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error)
      throw error
    }
  },

  async deleteAgendamento(id: number): Promise<void> {
    try {
      await api.delete(`/agendamentos/${id}`)
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error)
      throw error
    }
  },

  async aprovarAgendamento(id: number, status: "confirmado" | "cancelado"): Promise<Agendamento> {
    try {
      const response = await api.post(`/agendamentos/${id}/aprovar`, { status })
      return response.data.data
    } catch (error) {
      console.error("Erro ao aprovar agendamento:", error)
      throw error
    }
  },
}

