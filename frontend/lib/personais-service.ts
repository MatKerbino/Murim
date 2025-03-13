import axios from "axios"
import { API_URL } from "./utils"

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
      const response = await axios.get(`${API_URL}/personais`)
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
      const response = await axios.get(`${API_URL}/personais/${id}`)
      return response.data.data || response.data
    } catch (error) {
      console.error(`Error fetching personal with id ${id}:`, error)
      throw error
    }
  },

  async createPersonal(personal: FormData): Promise<Personal> {
    try {
      const response = await axios.post(`${API_URL}/personais`, personal, {
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
      const response = await axios.post(
        `${API_URL}/personais/${id}?_method=PUT`,
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
      await axios.delete(`${API_URL}/personais/${id}`)
    } catch (error) {
      console.error(`Error deleting personal with id ${id}:`, error)
      throw error
    }
  },
}

