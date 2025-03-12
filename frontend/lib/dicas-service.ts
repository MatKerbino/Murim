import apiClient from "./api-client"

export interface CategoriaDica {
  id: number
  nome: string
  slug: string
  descricao: string | null
  created_at: string
  updated_at: string
}

export interface Dica {
  id: number
  titulo: string
  slug: string
  descricao: string
  conteudo: string
  categoria_id: number
  autor: string
  imagem: string | null
  publicado: boolean
  created_at: string
  updated_at: string
  categoria?: CategoriaDica
}

export const dicasService = {
  async getDicas(): Promise<Dica[]> {
    try {
      const response = await apiClient.get<{ status: string; data: Dica[] }>("/dicas")
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async getDica(id: number): Promise<Dica> {
    try {
      const response = await apiClient.get<{ status: string; data: Dica }>(`/dicas/${id}`)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async createDica(dica: FormData): Promise<Dica> {
    try {
      const response = await apiClient.post<{ status: string; data: Dica }>("/dicas", dica, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async updateDica(id: number, dica: FormData): Promise<Dica> {
    try {
      const response = await apiClient.post<{ status: string; data: Dica }>(`/dicas/${id}?_method=PUT`, dica, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async deleteDica(id: number): Promise<void> {
    try {
      await apiClient.delete(`/dicas/${id}`)
    } catch (error) {
      throw error
    }
  },

  async getCategorias(): Promise<CategoriaDica[]> {
    try {
      const response = await apiClient.get<{ status: string; data: CategoriaDica[] }>("/categorias-dicas")
      return response.data.data
    } catch (error) {
      throw error
    }
  },
}

