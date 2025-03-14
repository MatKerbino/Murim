import axios from "axios"
import { API_URL } from "./utils"

export interface CartItem {
  id: number
  user_id: number
  produto_id: number
  quantidade: number
  created_at: string
  updated_at: string
  produto?: {
    id: number
    nome: string
    preco: number
    imagem: string | null
  }
}

// Configuração do cliente axios com interceptor para token
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Adiciona o token em todas as requisições
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export const carrinhoService = {
  async getCartItems(): Promise<CartItem[]> {
    try {
      const response = await api.get("/carrinho")
      return response.data.data || []
    } catch (error) {
      console.error("Erro ao buscar itens do carrinho:", error)
      return []
    }
  },

  async addToCart(produto_id: number, quantidade = 1): Promise<CartItem> {
    try {
      const response = await api.post("/carrinho", { produto_id, quantidade })
      return response.data.data
    } catch (error) {
      console.error("Erro ao adicionar item ao carrinho:", error)
      throw error
    }
  },

  async updateCartItem(id: number, quantidade: number): Promise<CartItem> {
    try {
      const response = await api.put(`/carrinho/${id}`, { quantidade })
      return response.data.data
    } catch (error) {
      console.error("Erro ao atualizar item do carrinho:", error)
      throw error
    }
  },

  async removeFromCart(id: number): Promise<void> {
    try {
      await api.delete(`/carrinho/${id}`)
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error)
      throw error
    }
  },

  async clearCart(): Promise<void> {
    try {
      await api.delete("/carrinho")
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error)
      throw error
    }
  },

  async checkout(): Promise<{ id: number }> {
    try {
      const response = await api.post("/checkout")
      return response.data.data
    } catch (error) {
      console.error("Erro ao finalizar compra:", error)
      throw error
    }
  },
}

