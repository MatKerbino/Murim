import axiosInstance from "./axios"
import axios, { isAxiosError } from "axios"

export interface CategoriaDica {
  id: number
  nome: string
  slug: string
  descricao: string
  created_at: string
  updated_at: string
}

export interface Dica {
  id: number
  titulo: string
  slug: string
  conteudo: string
  descricao: string
  imagem: string | null
  categoria_id: number
  categoria?: CategoriaDica
  autor_id: number
  autor?: {
    id: number
    name: string
  }
  publicado: boolean
  destaque: boolean
  created_at: string
  updated_at: string
}

const api = axiosInstance

export const dicasAdminService = {
  async getDicas(): Promise<Dica[]> {
    try {
      const response = await api.get("/dicas")
      return response.data.data || []
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Erro ao buscar dicas:", error.response?.data || error.message)
      } else {
        console.error("Erro inesperado:", error)
      }
      throw error
    }
  },

  async getDica(id: number): Promise<Dica> {
    try {
      const response = await api.get(`/dicas/${id}`)
      return response.data.data
    } catch (error) {
      console.error("Erro ao buscar dica:", error)
      throw error
    }
  },

  async createDica(dica: FormData): Promise<Dica> {
    try {
      // Extrair dados do FormData para um objeto
      const dicaObj: any = {};
      for (let pair of dica.entries()) {
        if (pair[0] === 'imagem' && pair[1] instanceof File) {
          // Tratar imagem depois
          continue;
        }
        
        // Para os campos boolean, converter explicitamente
        if (pair[0] === 'publicado' || pair[0] === 'destaque') {
          dicaObj[pair[0]] = pair[1] === '1' || pair[1] === 'true';
        } else {
          dicaObj[pair[0]] = pair[1];
        }
      }
      
      // Se tivermos uma imagem, usar FormData
      if (dica.get('imagem') instanceof File) {
        // Criar novo FormData
        const formData = new FormData();
        
        // Adicionar campos convertidos
        for (const key in dicaObj) {
          // Converter booleanos para string explícita 'true'/'false'
          if (typeof dicaObj[key] === 'boolean') {
            formData.append(key, dicaObj[key] ? 'true' : 'false');
          } else {
            formData.append(key, dicaObj[key]);
          }
        }
        
        // Adicionar imagem
        formData.append('imagem', dica.get('imagem') as File);
        
        console.log('Enviando dados via FormData:');
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + (pair[1] instanceof File ? 'File' : pair[1]));
        }
        
        const response = await api.post("/dicas", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        return response.data.data;
      } else {
        // Sem imagem, usar JSON
        console.log('Enviando dados via JSON:', dicaObj);
        
        const response = await api.post("/dicas", dicaObj, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        return response.data.data;
      }
    } catch (error) {
      console.error("Erro ao criar dica:", error);
      throw error;
    }
  },

  async updateDica(id: number, dica: FormData): Promise<Dica> {
    try {
      // Para o Laravel, quando trabalhamos com FormData e PUT, precisamos usar 
      // o método spoofing _method=PUT
      const response = await api.post(`/dicas/${id}?_method=PUT`, dica, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data.data
    } catch (error) {
      console.error("Erro ao atualizar dica:", error)
      throw error
    }
  },

  async deleteDica(id: number): Promise<void> {
    try {
      await api.delete(`/dicas/${id}`)
    } catch (error) {
      console.error("Erro ao excluir dica:", error)
      throw error
    }
  },

  async getCategorias(): Promise<CategoriaDica[]> {
    try {
      const response = await api.get("/categorias-dicas")
      // Corrigido para usar o formato correto de resposta da API
      return response.data.data || response.data || []
    } catch (error) {
      console.error("Erro ao buscar categorias:", error)
      throw error
    }
  },

  async getCategoria(id: number): Promise<CategoriaDica> {
    try {
      const response = await api.get(`/categorias-dicas/${id}`)
      // Corrigido para garantir compatibilidade com o formato de resposta
      return response.data.data || response.data
    } catch (error) {
      console.error("Erro ao buscar categoria:", error)
      throw error
    }
  },

  async createCategoria(categoria: { nome: string; descricao?: string }): Promise<CategoriaDica> {
    try {
      // Adiciona a descrição como campo opcional que o backend espera
      const categoriaData = {
        nome: categoria.nome,
        descricao: categoria.descricao || '',
        // O backend pode gerar o slug automaticamente se não for fornecido
      }
      
      const response = await api.post("/categorias-dicas", categoriaData)
      return response.data.data || response.data
    } catch (error) {
      console.error("Erro ao criar categoria:", error)
      throw error
    }
  },

  async updateCategoria(id: number, categoria: { nome: string; descricao?: string }): Promise<CategoriaDica> {
    try {
      // Incluindo os campos que o backend espera
      const categoriaData = {
        nome: categoria.nome,
        descricao: categoria.descricao || '',
      }
      
      const response = await api.put(`/categorias-dicas/${id}`, categoriaData)
      return response.data.data || response.data
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error)
      throw error
    }
  },

  async deleteCategoria(id: number): Promise<void> {
    try {
      await api.delete(`/categorias-dicas/${id}`)
    } catch (error) {
      console.error("Erro ao excluir categoria:", error)
      throw error
    }
  },
}