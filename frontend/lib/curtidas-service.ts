import { createApiClient } from "./axios"

const api = createApiClient()

export interface CurtidaStatus {
  curtido: boolean
  total_curtidas: number
}

export const curtidasService = {
  async verificarCurtida(dicaId: number): Promise<CurtidaStatus> {
    try {
      const response = await api.get<{ status: string; data: CurtidaStatus }>(`/dicas/${dicaId}/curtida`)
      return response.data.data
    } catch (error) {
      if (error instanceof Error && error.message === 'Not Found') {
        return { curtido: false, total_curtidas: 0 }
      }
      throw error
    }
  },

  async toggleCurtida(dicaId: number): Promise<CurtidaStatus> {
    try {
      const response = await api.post<{ status: string; data: CurtidaStatus }>(`/dicas/${dicaId}/curtir`)
      return response.data.data
    } catch (error) {
      throw error
    }
  },
}

