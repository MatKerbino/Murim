import { createApiClient } from "./axios"

const api = createApiClient()

// Define interfaces for the data model
export interface Categoria {
  id: number;
  nome: string;
  slug: string;
}

export interface Dica {
  id: number;
  titulo: string;
  descricao: string;
  conteudo: string;
  autor: string;
  categoria?: Categoria;
  created_at: string;
  updated_at?: string;
}

export const dicasService = {
  async getDicas(): Promise<Dica[]> {
    try {
      const response = await api.get("/dicas")
      return response.data.data || response.data
    } catch (error) {
      console.error("Error fetching dicas:", error)
      throw error
    }
  },

  async getDica(id: number): Promise<Dica> {
    try {
      const response = await api.get(`/dicas/${id}`)
      return response.data.data || response.data
    } catch (error) {
      console.error(`Error fetching dica with id ${id}:`, error)
      throw error
    }
  },

  async createDica(dica: Omit<Dica, "id" | "created_at" | "updated_at">): Promise<Dica> {
    try {
      const response = await api.post("/dicas", dica)
      return response.data.data || response.data
    } catch (error) {
      console.error("Error creating dica:", error)
      throw error
    }
  },

  async updateDica(id: number, dica: Partial<Dica>): Promise<Dica> {
    try {
      const response = await api.post(`/dicas/${id}?_method=PUT`, dica)
      return response.data.data || response.data
    } catch (error) {
      console.error(`Error updating dica with id ${id}:`, error)
      throw error
    }
  },

  async deleteDica(id: number): Promise<void> {
    try {
      await api.delete(`/dicas/${id}`)
    } catch (error) {
      console.error(`Error deleting dica with id ${id}:`, error)
      throw error
    }
  },

  // Get dicas by category slug
  async getDicasByCategoria(categoriaSlug: string): Promise<Dica[]> {
    try {
      const response = await api.get("/dicas")
      return response.data.data.filter((dica) => dica.categoria?.slug === categoriaSlug);
    } catch (error) {
      console.error(`Error fetching dicas by categoria ${categoriaSlug}:`, error);
      throw error;
    }
  },

  // Get featured dicas
  async getDicasDestaque(): Promise<Dica[]> {
    try {
      const dicas = await api.get("/dicas")
      return dicas.data.data.slice(0, 3);
    } catch (error) {
      console.error('Error fetching dicas destaque:', error);
      throw error;
    }
  },

  // Search dicas by query
  async searchDicas(query: string): Promise<Dica[]> {
    try {
      const dicas = await api.get("/dicas")
      if (!query.trim()) return dicas.data.data;
      
      const searchTerm = query.toLowerCase();
      return dicas.data.data.filter(dica => 
        dica.titulo.toLowerCase().includes(searchTerm) ||
        dica.descricao.toLowerCase().includes(searchTerm) ||
        dica.conteudo.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error(`Error searching dicas with query ${query}:`, error);
      throw error;
    }
  },

  // Get dicas with pagination
  async getDicasPaginated(page: number = 1, perPage: number = 10): Promise<{
    data: Dica[],
    total: number,
    currentPage: number,
    lastPage: number
  }> {
    try {
      const allDicas = await api.get("/dicas")
      const total = allDicas.data.data.length;
      const lastPage = Math.ceil(total / perPage);
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const data = allDicas.data.data.slice(startIndex, endIndex);
      
      return {
        data,
        total,
        currentPage: page,
        lastPage
      };
    } catch (error) {
      console.error(`Error fetching paginated dicas for page ${page}:`, error);
      throw error;
    }
  }
}

