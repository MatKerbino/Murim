import axiosInstance from "./axios"

const api = axiosInstance

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
      const response = await api.get("/produtos")
      return response.data.data || response.data
    } catch (error) {
      console.error("Error fetching produtos:", error)
      throw error
    }
  },

  async getProduto(id: number): Promise<Produto> {
    try {
      const response = await api.get(`/produtos/${id}`)
      return response.data.data || response.data
    } catch (error) {
      console.error(`Error fetching produto with id ${id}:`, error)
      throw error
    }
  },

  async createProduto(produto: Omit<Produto, "id" | "created_at" | "updated_at">): Promise<Produto> {
    try {
      const response = await api.post("/produtos", produto)
      return response.data.data || response.data
    } catch (error) {
      console.error("Error creating produto:", error)
      throw error
    }
  },

  async updateProduto(id: number, produto: Partial<Produto>): Promise<Produto> {
    try {
      const response = await api.post(`/produtos/${id}?_method=PUT`, produto)
      return response.data.data || response.data
    } catch (error) {
      console.error(`Error updating produto with id ${id}:`, error)
      throw error
    }
  },

  async deleteProduto(id: number): Promise<void> {
    try {
      await api.delete(`/produtos/${id}`)
    } catch (error) {
      console.error(`Error deleting produto with id ${id}:`, error)
      throw error
    }
  },

  async getCategorias(): Promise<CategoriaProduto[]> {
    try {
      const response = await api.get<{ status: string; data: CategoriaProduto[] }>("/categorias-produtos")
      return response.data.data
    } catch (error) {
      throw error
    }
  },
}

