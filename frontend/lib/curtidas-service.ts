import axios from "axios"
import { API_URL } from "./utils"

export interface CurtidaStatus {
  curtido: boolean
  total_curtidas: number
}

export const curtidasService = {
  async verificarCurtida(dicaId: number): Promise<CurtidaStatus> {
    try {
      const response = await axios.get<{ status: string; data: CurtidaStatus }>(`${API_URL}/dicas/${dicaId}/curtida`)
      return response.data.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { curtido: false, total_curtidas: 0 }
      }
      throw error
    }
  },

  async toggleCurtida(dicaId: number): Promise<CurtidaStatus> {
    try {
      const response = await axios.post<{ status: string; data: CurtidaStatus }>(`${API_URL}/dicas/${dicaId}/curtir`)
      return response.data.data
    } catch (error) {
      throw error
    }
  },
}

