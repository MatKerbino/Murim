import apiClient from "./api-client"

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
  async enviarContato(contato: ContatoForm): Promise<Contato> {
    try {
      const response = await apiClient.post<{ status: string; data: Contato }>("/contatos", contato)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async getContatos(): Promise<Contato[]> {
    try {
      const response = await apiClient.get<{ status: string; data: Contato[] }>("/contatos")
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async getContato(id: number): Promise<Contato> {
    try {
      const response = await apiClient.get<{ status: string; data: Contato }>(`/contatos/${id}`)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async responderContato(id: number, resposta: string): Promise<Contato> {
    try {
      const response = await apiClient.post<{ status: string; data: Contato }>(`/contatos/${id}/responder`, {
        resposta,
      })
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async deleteContato(id: number): Promise<void> {
    try {
      await apiClient.delete(`/contatos/${id}`)
    } catch (error) {
      throw error
    }
  },
}

