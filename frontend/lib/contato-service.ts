import { createApiClient } from "./axios"

const api = createApiClient()

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

const getAxiosConfig = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  return {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
}

export const contatoService = {
  async enviarContato(contato: ContatoForm): Promise<Contato> {
    try {
      const response = await api.post("/contatos", contato, getAxiosConfig())
      return response.data.data
    } catch (error) {
      console.error("Erro ao enviar contato:", error)
      throw error
    }
  },

  async getContatos(): Promise<Contato[]> {
    try {
      const response = await api.get("/contatos", getAxiosConfig())
      return response.data.data || []
    } catch (error) {
      console.error("Erro ao buscar contatos:", error)
      throw error
    }
  },

  async getContato(id: number): Promise<Contato> {
    try {
      const response = await api.get(`/contatos/${id}`, getAxiosConfig())
      return response.data.data
    } catch (error) {
      console.error("Erro ao buscar contato:", error)
      throw error
    }
  },

  async responderContato(id: number, resposta: string): Promise<Contato> {
    try {
      const response = await api.post(`/contatos/${id}/responder`, { resposta }, getAxiosConfig())
      return response.data.data
    } catch (error) {
      console.error("Erro ao responder contato:", error)
      throw error
    }
  },

  async deleteContato(id: number): Promise<void> {
    try {
      await api.delete(`/contatos/${id}`, getAxiosConfig())
    } catch (error) {
      console.error("Erro ao excluir contato:", error)
      throw error
    }
  },
}
