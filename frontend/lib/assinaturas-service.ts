import axiosInstance from "./axios"
import type { Plano } from "./planos-service"

const api = axiosInstance

export interface Assinatura {
  id: number
  user_id: number
  plano_id: number
  data_inicio: string
  data_fim: string
  ativa: boolean
  valor_pago: number
  status_pagamento: string
  created_at: string
  updated_at: string
  plano?: Plano
}

export const assinaturasService = {
  async getMinhasAssinaturas(): Promise<Assinatura[]> {
    try {
      const response = await api.get("/minhas-assinaturas")
      return response.data.data || []
    } catch (error) {
      console.error("Erro ao buscar assinaturas:", error)
      throw error
    }
  },

  async getMinhasAssinaturasAtivas(): Promise<Assinatura[]> {
    try {
      const response = await api.get("/minhas-assinaturas/ativas")
      return response.data.data || []
    } catch (error) {
      console.error("Erro ao buscar assinaturas ativas:", error)
      throw error
    }
  },

  async assinarPlano(planoId: number): Promise<Assinatura> {
    try {
      const response = await api.post(`/planos/${planoId}/assinar`)
      return response.data.data
    } catch (error) {
      console.error("Erro ao assinar plano:", error)
      throw error
    }
  },

  async cancelarAssinatura(assinaturaId: number): Promise<void> {
    try {
      await api.post(`/assinaturas/${assinaturaId}/cancelar`)
    } catch (error) {
      console.error("Erro ao cancelar assinatura:", error)
      throw error
    }
  },

  // Métodos para administradores
  async getAllAssinaturas(): Promise<Assinatura[]> {
    try {
      const response = await api.get("/assinaturas")
      return response.data.data || []
    } catch (error) {
      console.error("Erro ao buscar todas as assinaturas:", error)
      throw error
    }
  },

  async getAssinatura(id: number): Promise<Assinatura> {
    try {
      const response = await api.get(`/assinaturas/${id}`)
      return response.data.data
    } catch (error) {
      console.error(`Erro ao buscar assinatura ${id}:`, error)
      throw error
    }
  },

  async updateAssinatura(id: number, data: Partial<Assinatura>): Promise<Assinatura> {
    try {
      const response = await api.put(`/assinaturas/${id}`, data)
      return response.data.data
    } catch (error) {
      console.error("Erro ao atualizar assinatura:", error)
      throw error
    }
  },
}

