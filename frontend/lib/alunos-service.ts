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

const getAxiosConfig = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  console.log("Token retrieved:", token); // Debugging line to check token retrieval
  return {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
}

export const alunosService = {
  async getAlunos(): Promise<Aluno[]> {
    try {
      const response = await axios.get(`${API_URL}/alunos`, getAxiosConfig())
      return response.data.data || response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching alunos:", error.response?.data || error.message)
      } else {
        console.error("Unexpected error:", error)
      }
      throw error
    }
  },

  async getAluno(id: number): Promise<Aluno> {
    try {
      const response = await axios.get(`${API_URL}/alunos/${id}`, getAxiosConfig())
      return response.data.data
    } catch (error) {
      console.error("Erro ao buscar aluno:", error)
      throw error
    }
  },

  async createAluno(aluno: Omit<Aluno, "id" | "createdAt" | "updatedAt" | "plano">): Promise<Aluno> {
    try {
      const response = await axios.post(`${API_URL}/alunos`, aluno, getAxiosConfig())
      return response.data.data
    } catch (error) {
      console.error("Erro ao criar aluno:", error)
      throw error
    }
  },

  async updateAluno(id: number, aluno: Partial<Aluno>): Promise<Aluno> {
    try {
      const response = await axios.put(`${API_URL}/alunos/${id}`, aluno, getAxiosConfig())
      return response.data.data
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error)
      throw error
    }
  },

  async deleteAluno(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/alunos/${id}`, getAxiosConfig())
    } catch (error) {
      console.error("Erro ao excluir aluno:", error)
      throw error
    }
  },
}