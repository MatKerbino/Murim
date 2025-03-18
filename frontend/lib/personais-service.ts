import axiosInstance from "./axios"

const api = axiosInstance

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
      const response = await api.get("/personais")
      if (response.data && response.data.data) {
        return response.data.data
      }
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getPersonal(id: number): Promise<Personal> {
    try {
      const response = await api.get(`/personais/${id}`)
      return response.data.data || response.data
    } catch (error) {
      console.error(`Error fetching personal with id ${id}:`, error)
      throw error
    }
  },

  async createPersonal(personal: FormData): Promise<Personal> {
    try {
      const response = await api.post("/personais", personal, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data.data || response.data
    } catch (error) {
      console.error("Error creating personal:", error)
      throw error
    }
  },

  async updatePersonal(id: number, personal: FormData): Promise<Personal> {
    try {
      const response = await api.post(
        `/personais/${id}?_method=PUT`,
        personal,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      return response.data.data || response.data
    } catch (error) {
      console.error(`Error updating personal with id ${id}:`, error)
      throw error
    }
  },

  async deletePersonal(id: number): Promise<void> {
    try {
      await api.delete(`/personais/${id}`)
    } catch (error) {
      console.error(`Error deleting personal with id ${id}:`, error)
      throw error
    }
  },
}

