import axios from "axios"
import { API_URL } from "./utils"

export interface Pagamento {
  id: number
  aluno_id: number
  plano_id: number
  valor: number
  data_pagamento: string
  metodo_pagamento: string
  status: string
  observacoes?: string
  created_at: string
  updated_at: string
  aluno?: {
    id: number
    nome: string
    email: string
  }
  plano?: {
    id: number
    nome: string
    valor: number
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

export const pagamentosService = {
  async getPagamentos(): Promise<Pagamento[]> {
    try {
      const response = await api.get("/pagamentos")
      return response.data.data || []
    } catch (error) {
      console.error("Erro ao buscar pagamentos:", error)
      throw error
    }
  },

  async getPagamento(id: number): Promise<Pagamento> {
    try {
      const response = await api.get(`/pagamentos/${id}`)
      return response.data.data
    } catch (error) {
      console.error(`Erro ao buscar pagamento ${id}:`, error)
      throw error
    }
  },

  async createPagamento(pagamento: Omit<Pagamento, "id" | "created_at" | "updated_at">): Promise<Pagamento> {
    try {
      const response = await api.post("/pagamentos", pagamento)
      return response.data.data
    } catch (error) {
      console.error("Erro ao criar pagamento:", error)
      throw error
    }
  },

  async updatePagamento(id: number, pagamento: Partial<Pagamento>): Promise<Pagamento> {
    try {
      const response = await api.put(`/pagamentos/${id}`, pagamento)
      return response.data.data
    } catch (error) {
      console.error("Erro ao atualizar pagamento:", error)
      throw error
    }
  },

  async deletePagamento(id: number): Promise<void> {
    try {
      await api.delete(`/pagamentos/${id}`)
    } catch (error) {
      console.error("Erro ao excluir pagamento:", error)
      throw error
    }
  },

  async getPagamentosByAluno(alunoId: number): Promise<Pagamento[]> {
    try {
      const response = await api.get(`/alunos/${alunoId}/pagamentos`)
      return response.data.data || []
    } catch (error) {
      console.error(`Erro ao buscar pagamentos do aluno ${alunoId}:`, error)
      throw error
    }
  },
}

