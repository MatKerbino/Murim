import axios from "axios"
import { API_URL } from "./utils"

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

export const alunosService = {
  async getAlunos(): Promise<Aluno[]> {
    try {
      const response = await axios.get(`${API_URL}/alunos`)
      return response.data.data || response.data
    } catch (error) {
      console.error("Error fetching alunos:", error)
      throw error
    }
  },

  async getAluno(id: number): Promise<Aluno> {
    try {
      const response = await axios.get(`${API_URL}/alunos/${id}`)
      return response.data.data || response.data
    } catch (error) {
      console.error(`Error fetching aluno with id ${id}:`, error)
      throw error
    }
  },

  async createAluno(aluno: Omit<Aluno, "id" | "created_at" | "updated_at" | "plano">): Promise<Aluno> {
    try {
      const response = await axios.post(`${API_URL}/alunos`, aluno)
      return response.data.data || response.data
    } catch (error) {
      console.error("Error creating aluno:", error)
      throw error
    }
  },

  async updateAluno(id: number, aluno: Partial<Aluno>): Promise<Aluno> {
    try {
      const response = await axios.post(`${API_URL}/alunos/${id}?_method=PUT`, aluno)
      return response.data.data || response.data
    } catch (error) {
      console.error(`Error updating aluno with id ${id}:`, error)
      throw error
    }
  },

  async deleteAluno(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/alunos/${id}`)
    } catch (error) {
      console.error(`Error deleting aluno with id ${id}:`, error)
      throw error
    }
  },
}

