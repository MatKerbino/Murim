import axios from "axios"
import { API_URL } from "./utils"

export interface Comentario {
  id: number
  dica_id: number
  user_id: number
  conteudo: string
  aprovado: boolean
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
  }
  dica?: {
    id: number
    titulo: string
  }
}

export const comentariosService = {
  async getComentarios(dicaId: number): Promise<Comentario[]> {
    try {
      const url = `${API_URL}/dicas/${dicaId}/comentarios`;
      console.log("URL chamada:", url);
      const response = await axios.get<{ status: string; data: Comentario[] }>(url);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Nenhum comentário encontrado para esta dica.");
        return [];
      }
      console.error("Erro ao buscar comentários:", error);
      throw error;
    }
  },

  async criarComentario(dicaId: number, conteudo: string): Promise<Comentario> {
    try {
      const response = await axios.post<{ status: string; data: Comentario }>(`${API_URL}/dicas/${dicaId}/comentarios`, {
        conteudo,
      })
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async excluirComentario(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/comentarios/${id}`)
    } catch (error) {
      throw error
    }
  },

  async listarTodosComentarios(): Promise<Comentario[]> {
    try {
      const response = await axios.get<{ status: string; data: Comentario[] }>(`${API_URL}/admin/comentarios`)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async aprovarComentario(id: number, aprovado: boolean): Promise<Comentario> {
    try {
      const response = await axios.post<{ status: string; data: Comentario }>(`${API_URL}/comentarios/${id}/aprovar`, {
        aprovado,
      })
      return response.data.data
    } catch (error) {
      throw error
    }
  },
}

