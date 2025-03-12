import apiClient from "./api-client"

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
      const response = await apiClient.get<{ status: string; data: Aluno[] }>("/alunos")
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async getAluno(id: number): Promise<Aluno> {
    try {
      const response = await apiClient.get<{ status: string; data: Aluno }>(`/alunos/${id}`)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async createAluno(aluno: Omit<Aluno, "id" | "created_at" | "updated_at" | "plano">): Promise<Aluno> {
    try {
      const response = await apiClient.post<{ status: string; data: Aluno }>("/alunos", aluno)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async updateAluno(id: number, aluno: Partial<Aluno>): Promise<Aluno> {
    try {
      const response = await apiClient.put<{ status: string; data: Aluno }>(`/alunos/${id}`, aluno)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async deleteAluno(id: number): Promise<void> {
    try {
      await apiClient.delete(`/alunos/${id}`)
    } catch (error) {
      throw error
    }
  },
}

