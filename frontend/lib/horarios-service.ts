import apiClient from "./api-client"

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

export const horariosService = {
  async getHorarios(): Promise<DiaSemana[]> {
    try {
      const response = await apiClient.get<{ status: string; data: DiaSemana[] }>("/aulas")
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async getDiasSemana(): Promise<DiaSemana[]> {
    try {
      const response = await apiClient.get<{ status: string; data: DiaSemana[] }>("/dias-semana")
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async createAula(aula: Omit<Aula, "id" | "created_at" | "updated_at">): Promise<Aula> {
    try {
      const response = await apiClient.post<{ status: string; data: Aula }>("/aulas", aula)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async updateAula(id: number, aula: Partial<Aula>): Promise<Aula> {
    try {
      const response = await apiClient.put<{ status: string; data: Aula }>(`/aulas/${id}`, aula)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async deleteAula(id: number): Promise<void> {
    try {
      await apiClient.delete(`/aulas/${id}`)
    } catch (error) {
      throw error
    }
  },
}
// These files don't directly use localStorage, but they might be affected by the auth-service.
// The issue is likely in the api-client.ts file that's used by these services.
// No changes needed here as the issue is in the api-client.ts file.

