import apiClient from "./api-client"

export interface Produto {
  id: number
  nome: string
  descricao: string
  preco: number
  categoria_id: number
  imagem: string | null
  estoque: number
  ativo: boolean
  created_at: string
  updated_at: string
  categoria?: {
    id: number
    nome: string
  }
}

export interface CategoriaProduto {
  id: number
  nome: string
  descricao: string | null
  created_at: string
  updated_at: string
}

export const produtosService = {
  async getProdutos(): Promise<Produto[]> {
    try {
      const response = await apiClient.get<{ status: string; data: Produto[] }>("/produtos")
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async getProduto(id: number): Promise<Produto> {
    try {
      const response = await apiClient.get<{ status: string; data: Produto }>(`/produtos/${id}`)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async createProduto(produto: FormData): Promise<Produto> {
    try {
      const response = await apiClient.post<{ status: string; data: Produto }>("/produtos", produto, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async updateProduto(id: number, produto: FormData): Promise<Produto> {
    try {
      const response = await apiClient.post<{ status: string; data: Produto }>(`/produtos/${id}?_method=PUT`, produto, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  async deleteProduto(id: number): Promise<void> {
    try {
      await apiClient.delete(`/produtos/${id}`)
    } catch (error) {
      throw error
    }
  },

  async getCategorias(): Promise<CategoriaProduto[]> {
    try {
      const response = await apiClient.get<{ status: string; data: CategoriaProduto[] }>("/categorias-produtos")
      return response.data.data
    } catch (error) {
      throw error
    }
  },
}

