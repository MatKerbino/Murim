import apiClient from "./api-client"

export interface Personal {
  id: number
  nome: string
  especialidade: string
  email: string
  telefone: string
  foto: string | null
  biografia: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}

export const personaisService = {
  async getPersonais(): Promise<Personal[]> {
    try {
      const response = await apiClient.get<{ status: string; data: Personal[] }>("/personais")
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async getPersonal(id: number): Promise<Personal> {
    try {
      const response = await apiClient.get<{ status: string; data: Personal }>(`/personais/${id}`)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async createPersonal(personal: FormData): Promise<Personal> {
    try {
      const response = await apiClient.post<{ status: string; data: Personal }>("/personais", personal, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async updatePersonal(id: number, personal: FormData): Promise<Personal> {
    try {
      const response = await apiClient.post<{ status: string; data: Personal }>(
        `/personais/${id}?_method=PUT`,
        personal,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async deletePersonal(id: number): Promise<void> {
    try {
      await apiClient.delete(`/personais/${id}`)
    } catch (error) {
      throw error
    }
  },
}

