import { ApiClient } from './api-client';

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

// Create a specific class for Dicas service that extends the generic ApiClient
class DicasService extends ApiClient<Dica> {
  constructor() {
    // Use the base URL for the dicas endpoint
    super('/v1/dicas');
  }

  // Get dicas by category slug
  async getDicasByCategoria(categoriaSlug: string): Promise<Dica[]> {
    try {
      const response = await this.getAll();
      return response.filter((dica) => dica.categoria?.slug === categoriaSlug);
    } catch (error) {
      console.error(`Error fetching dicas by categoria ${categoriaSlug}:`, error);
      throw error;
    }
  }

  // Get featured dicas
  async getDicasDestaque(): Promise<Dica[]> {
    try {
      const dicas = await this.getAll();
      // Just return the most recent 3 dicas as "featured" for now
      return dicas.slice(0, 3);
    } catch (error) {
      console.error('Error fetching dicas destaque:', error);
      throw error;
    }
  }

  // Search dicas by query
  async searchDicas(query: string): Promise<Dica[]> {
    try {
      const dicas = await this.getAll();
      if (!query.trim()) return dicas;
      
      const searchTerm = query.toLowerCase();
      return dicas.filter(dica => 
        dica.titulo.toLowerCase().includes(searchTerm) ||
        dica.descricao.toLowerCase().includes(searchTerm) ||
        dica.conteudo.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error(`Error searching dicas with query ${query}:`, error);
      throw error;
    }
  }

  // Get dicas with pagination
  async getDicasPaginated(page: number = 1, perPage: number = 10): Promise<{
    data: Dica[],
    total: number,
    currentPage: number,
    lastPage: number
  }> {
    try {
      const allDicas = await this.getAll();
      const total = allDicas.length;
      const lastPage = Math.ceil(total / perPage);
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const data = allDicas.slice(startIndex, endIndex);
      
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

// Export a singleton instance of the service
export const dicasService = new DicasService();

