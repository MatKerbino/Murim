import axios from "axios"
import { API_URL } from "./utils"

export interface DashboardStats {
  totalAlunos: number
  totalUsuarios: number
  alunosNovosMes: number
  receitaMensal: number
  receitaPlanosAtivos: number
  receitaBruta: number
  crescimentoReceita: number
  vendasLoja: number
  vendasPlanos: number
  vendasAgendamentos: number
  vendasSemana: number
  agendamentos: number
  atividadesRecentes: Array<{
    tipo: string
    descricao: string
    tempo: string
    icone: string
  }>
  mensagensRecentes: Array<{
    nome: string
    email: string
    assunto: string
    mensagem: string
    data: string
    id: number
  }>
  usuariosLogados: Array<{
    id: number
    nome: string
    email: string
    tempo: string
  }>
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

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await api.get("/admin/dashboard")
      return response.data.data
    } catch (error) {
      console.error("Erro ao buscar estatísticas do dashboard:", error)
      throw error
    }
  },
}

