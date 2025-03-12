import apiClient from "./api-client"

export interface Plano {
  id: number
  nome: string
  descricao: string
  valor: number
  duracao: number
  beneficios: string[]
  created_at: string
  updated_at: string
}

export const planosService = {
  async getPlanos(): Promise<Plano[]> {
    try {
      const response = await apiClient.get<{ status: string; data: Plano[] }>("/planos")
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async getPlano(id: number): Promise<Plano> {
    try {
      const response = await apiClient.get<{ status: string; data: Plano }>(`/planos/${id}`)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async createPlano(plano: Omit<Plano, "id" | "created_at" | "updated_at">): Promise<Plano> {
    try {
      const response = await apiClient.post<{ status: string; data: Plano }>("/planos", plano)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async updatePlano(id: number, plano: Partial<Plano>): Promise<Plano> {
    try {
      const response = await apiClient.put<{ status: string; data: Plano }>(`/planos/${id}`, plano)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async deletePlano(id: number): Promise<void> {
    try {
      await apiClient.delete(`/planos/${id}`)
    } catch (error) {
      throw error
    }
  },
}

