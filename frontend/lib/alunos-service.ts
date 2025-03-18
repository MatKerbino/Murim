import axiosInstance from "./axios"
import axios, { isAxiosError } from "axios"

export interface Aluno {
  id: number
  nome: string
  email: string
  telefone: string
  data_nascimento: string
  matricula: string
  plano_id: number
  data_inicio: string
  data_fim: string | null
  status: "ativo" | "inativo" | "pendente"
  observacoes: string | null
  created_at: string
  updated_at: string
  plano?: {
    id: number
    nome: string
    valor: number
  }
}

const api = axiosInstance

export const alunosService = {
  async getAlunos(): Promise<Aluno[]> {
    try {
      const response = await api.get("/alunos")
      return response.data.data || response.data
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Error fetching alunos:", error.response?.data || error.message)
      } else {
        console.error("Unexpected error:", error)
      }
      throw error
    }
  },

  async getAluno(id: number): Promise<Aluno> {
    try {
      const response = await api.get(`/alunos/${id}`)
      return response.data.data
    } catch (error) {
      console.error("Erro ao buscar aluno:", error)
      throw error
    }
  },

  async createAluno(aluno: Omit<Aluno, "id" | "created_at" | "updated_at" | "plano">): Promise<Aluno> {
    try {
      const response = await api.post("/alunos", aluno)
      return response.data.data
    } catch (error) {
      console.error("Erro ao criar aluno:", error)
      throw error
    }
  },

  async updateAluno(id: number, aluno: Partial<Aluno>): Promise<Aluno> {
    try {
      const response = await api.put(`/alunos/${id}`, aluno)
      return response.data.data
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error)
      throw error
    }
  },

  async deleteAluno(id: number): Promise<void> {
    try {
      await api.delete(`/alunos/${id}`)
    } catch (error) {
      console.error("Erro ao excluir aluno:", error)
      throw error
    }
  },
}