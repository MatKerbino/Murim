import axios from "axios"
import { API_URL } from "./utils"

export interface Contato {
  id: number
  nome: string
  email: string
  telefone: string | null
  assunto: string
  mensagem: string
  status: "novo" | "lido" | "respondido"
  resposta: string | null
  data_resposta: string | null
  created_at: string
  updated_at: string
}

export interface ContatoForm {
  nome: string
  email: string
  telefone?: string
  assunto: string
  mensagem: string
}

export const contatoService = {
  async enviarContato(contato: Omit<Contato, "id" | "created_at" | "updated_at">): Promise<Contato> {
    try {
      const response = await axios.post(`${API_URL}/contatos`, contato)
      return response.data.data || response.data
    } catch (error) {
      console.error("Error sending contato:", error)
      throw error
    }
  },

  async getContatos(): Promise<Contato[]> {
    try {
      const response = await axios.get(`${API_URL}/contatos`)
      return response.data.data || response.data
    } catch (error) {
      console.error("Error fetching contatos:", error)
      throw error
    }
  },

  async getContato(id: number): Promise<Contato> {
    try {
      const response = await axios.get(`${API_URL}/contatos/${id}`)
      return response.data.data || response.data
    } catch (error) {
      console.error(`Error fetching contato with id ${id}:`, error)
      throw error
    }
  },

  async responderContato(id: number, resposta: string): Promise<Contato> {
    try {
      const response = await axios.post(`${API_URL}/contatos/${id}/responder`, { resposta })
      return response.data.data || response.data
    } catch (error) {
      console.error(`Error responding to contato with id ${id}:`, error)
      throw error
    }
  },

  async deleteContato(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/contatos/${id}`)
    } catch (error) {
      console.error(`Error deleting contato with id ${id}:`, error)
      throw error
    }
  },
}

