// Tipos
export interface Aluno {
  id: number
  nome: string
  email: string
  telefone: string
  dataNascimento: string
  matricula: string
  planoId: number
  createdAt: string
  updatedAt: string
}

export interface Plano {
  id: number
  nome: string
  descricao: string
  valor: number
  duracao: number
  beneficios: string[]
  createdAt: string
  updatedAt: string
}

export interface Pagamento {
  id: number
  alunoId: number
  planoId: number
  valor: number
  dataVencimento: string
  dataPagamento: string | null
  status: "pendente" | "pago" | "atrasado"
  createdAt: string
  updatedAt: string
}

export interface Produto {
  id: number
  nome: string
  descricao: string
  preco: number
  categoria: string
  imagem: string
  estoque: number
  createdAt: string
  updatedAt: string
}

export interface Agendamento {
  id: number
  alunoId: number
  personalId: number
  data: string
  horario: string
  status: "pendente" | "confirmado" | "cancelado"
  createdAt: string
  updatedAt: string
}

export interface Personal {
  id: number
  nome: string
  especialidade: string
  email: string
  telefone: string
  foto: string
  createdAt: string
  updatedAt: string
}

export interface Horario {
  id: number
  dia: string
  aulas: {
    horario: string
    nome: string
    instrutor: string
  }[]
}

export interface Dica {
  id: number
  titulo: string
  descricao: string
  conteudo: string
  categoria: "desempenho" | "nutricao" | "vestuario"
  autor: string
  data: string
  createdAt: string
  updatedAt: string
}

export interface Contato {
  id: number
  nome: string
  email: string
  telefone: string | null
  assunto: string
  mensagem: string
  status: "novo" | "lido" | "respondido"
  createdAt: string
  updatedAt: string
}

// Tipos de erro
export interface ApiError {
  message: string
  code: string
}

// URL base da API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Função genérica para fazer requisições
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      let errorMessage = "Ocorreu um erro na requisição"
      let errorCode = "request_failed"

      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
        errorCode = errorData.code || errorCode
      } catch (e) {
        // Se não conseguir parsear o JSON, usa a mensagem padrão
      }

      const error: ApiError = {
        message: errorMessage,
        code: errorCode,
      }

      throw error
    }

    return response.json()
  } catch (error) {
    if ((error as ApiError).code) {
      throw error
    }

    // Se for um erro de rede ou outro tipo de erro
    throw {
      message: "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
      code: "network_error",
    } as ApiError
  }
}

// Funções para cada entidade
export async function getAlunos(): Promise<Aluno[]> {
  try {
    return await fetchAPI<Aluno[]>("/alunos")
  } catch (error) {
    throw {
      message: `Erro ao buscar alunos: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function getAluno(id: number): Promise<Aluno> {
  try {
    return await fetchAPI<Aluno>(`/alunos/${id}`)
  } catch (error) {
    throw {
      message: `Erro ao buscar aluno: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function createAluno(data: Omit<Aluno, "id" | "createdAt" | "updatedAt">): Promise<Aluno> {
  try {
    return await fetchAPI<Aluno>("/alunos", {
      method: "POST",
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw {
      message: `Erro ao criar aluno: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function updateAluno(id: number, data: Partial<Aluno>): Promise<Aluno> {
  try {
    return await fetchAPI<Aluno>(`/alunos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw {
      message: `Erro ao atualizar aluno: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function deleteAluno(id: number): Promise<void> {
  try {
    return await fetchAPI<void>(`/alunos/${id}`, {
      method: "DELETE",
    })
  } catch (error) {
    throw {
      message: `Erro ao excluir aluno: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function getPlanos(): Promise<Plano[]> {
  try {
    return await fetchAPI<Plano[]>("/planos")
  } catch (error) {
    throw {
      message: `Erro ao buscar planos: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function getPlano(id: number): Promise<Plano> {
  try {
    return await fetchAPI<Plano>(`/planos/${id}`)
  } catch (error) {
    throw {
      message: `Erro ao buscar plano: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function createPlano(data: Omit<Plano, "id" | "createdAt" | "updatedAt">): Promise<Plano> {
  try {
    return await fetchAPI<Plano>("/planos", {
      method: "POST",
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw {
      message: `Erro ao criar plano: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function updatePlano(id: number, data: Partial<Plano>): Promise<Plano> {
  try {
    return await fetchAPI<Plano>(`/planos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw {
      message: `Erro ao atualizar plano: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function deletePlano(id: number): Promise<void> {
  try {
    return await fetchAPI<void>(`/planos/${id}`, {
      method: "DELETE",
    })
  } catch (error) {
    throw {
      message: `Erro ao excluir plano: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function getPagamentos(): Promise<Pagamento[]> {
  try {
    return await fetchAPI<Pagamento[]>("/pagamentos")
  } catch (error) {
    throw {
      message: `Erro ao buscar pagamentos: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function getPagamento(id: number): Promise<Pagamento> {
  try {
    return await fetchAPI<Pagamento>(`/pagamentos/${id}`)
  } catch (error) {
    throw {
      message: `Erro ao buscar pagamento: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function createPagamento(data: Omit<Pagamento, "id" | "createdAt" | "updatedAt">): Promise<Pagamento> {
  try {
    return await fetchAPI<Pagamento>("/pagamentos", {
      method: "POST",
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw {
      message: `Erro ao criar pagamento: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function updatePagamento(id: number, data: Partial<Pagamento>): Promise<Pagamento> {
  try {
    return await fetchAPI<Pagamento>(`/pagamentos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw {
      message: `Erro ao atualizar pagamento: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function deletePagamento(id: number): Promise<void> {
  try {
    return await fetchAPI<void>(`/pagamentos/${id}`, {
      method: "DELETE",
    })
  } catch (error) {
    throw {
      message: `Erro ao excluir pagamento: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function getProdutos(): Promise<Produto[]> {
  try {
    return await fetchAPI<Produto[]>("/produtos")
  } catch (error) {
    throw {
      message: `Erro ao buscar produtos: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function getProduto(id: number): Promise<Produto> {
  try {
    return await fetchAPI<Produto>(`/produtos/${id}`)
  } catch (error) {
    throw {
      message: `Erro ao buscar produto: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function createProduto(data: Omit<Produto, "id" | "createdAt" | "updatedAt">): Promise<Produto> {
  try {
    return await fetchAPI<Produto>("/produtos", {
      method: "POST",
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw {
      message: `Erro ao criar produto: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function updateProduto(id: number, data: Partial<Produto>): Promise<Produto> {
  try {
    return await fetchAPI<Produto>(`/produtos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw {
      message: `Erro ao atualizar produto: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function deleteProduto(id: number): Promise<void> {
  try {
    return await fetchAPI<void>(`/produtos/${id}`, {
      method: "DELETE",
    })
  } catch (error) {
    throw {
      message: `Erro ao excluir produto: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function getAgendamentos(): Promise<Agendamento[]> {
  try {
    return await fetchAPI<Agendamento[]>("/agendamentos")
  } catch (error) {
    throw {
      message: `Erro ao buscar agendamentos: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function getAgendamento(id: number): Promise<Agendamento> {
  try {
    return await fetchAPI<Agendamento>(`/agendamentos/${id}`)
  } catch (error) {
    throw {
      message: `Erro ao buscar agendamento: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function createAgendamento(
  data: Omit<Agendamento, "id" | "createdAt" | "updatedAt">,
): Promise<Agendamento> {
  try {
    return await fetchAPI<Agendamento>("/agendamentos", {
      method: "POST",
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw {
      message: `Erro ao criar agendamento: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function updateAgendamento(id: number, data: Partial<Agendamento>): Promise<Agendamento> {
  try {
    return await fetchAPI<Agendamento>(`/agendamentos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw {
      message: `Erro ao atualizar agendamento: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function deleteAgendamento(id: number): Promise<void> {
  try {
    return await fetchAPI<void>(`/agendamentos/${id}`, {
      method: "DELETE",
    })
  } catch (error) {
    throw {
      message: `Erro ao excluir agendamento: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function getPersonais(): Promise<Personal[]> {
  try {
    return await fetchAPI<Personal[]>("/personais")
  } catch (error) {
    throw {
      message: `Erro ao buscar personais: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function getPersonal(id: number): Promise<Personal> {
  try {
    return await fetchAPI<Personal>(`/personais/${id}`)
  } catch (error) {
    throw {
      message: `Erro ao buscar personal: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function createPersonal(data: Omit<Personal, "id" | "createdAt" | "updatedAt">): Promise<Personal> {
  try {
    return await fetchAPI<Personal>("/personais", {
      method: "POST",
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw {
      message: `Erro ao criar personal: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function updatePersonal(id: number, data: Partial<Personal>): Promise<Personal> {
  try {
    return await fetchAPI<Personal>(`/personais/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw {
      message: `Erro ao atualizar personal: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function deletePersonal(id: number): Promise<void> {
  try {
    return await fetchAPI<void>(`/personais/${id}`, {
      method: "DELETE",
    })
  } catch (error) {
    throw {
      message: `Erro ao excluir personal: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function getHorarios(): Promise<Horario[]> {
  try {
    return await fetchAPI<Horario[]>("/horarios")
  } catch (error) {
    throw {
      message: `Erro ao buscar horários: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function getDicas(): Promise<Dica[]> {
  try {
    return await fetchAPI<Dica[]>("/dicas")
  } catch (error) {
    throw {
      message: `Erro ao buscar dicas: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function getDica(id: number): Promise<Dica> {
  try {
    return await fetchAPI<Dica>(`/dicas/${id}`)
  } catch (error) {
    throw {
      message: `Erro ao buscar dica: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function createDica(data: Omit<Dica, "id" | "createdAt" | "updatedAt">): Promise<Dica> {
  try {
    return await fetchAPI<Dica>("/dicas", {
      method: "POST",
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw {
      message: `Erro ao criar dica: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function updateDica(id: number, data: Partial<Dica>): Promise<Dica> {
  try {
    return await fetchAPI<Dica>(`/dicas/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw {
      message: `Erro ao atualizar dica: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function deleteDica(id: number): Promise<void> {
  try {
    return await fetchAPI<void>(`/dicas/${id}`, {
      method: "DELETE",
    })
  } catch (error) {
    throw {
      message: `Erro ao excluir dica: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function getContatos(): Promise<Contato[]> {
  try {
    return await fetchAPI<Contato[]>("/contatos")
  } catch (error) {
    throw {
      message: `Erro ao buscar contatos: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function getContato(id: number): Promise<Contato> {
  try {
    return await fetchAPI<Contato>(`/contatos/${id}`)
  } catch (error) {
    throw {
      message: `Erro ao buscar contato: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function createContato(
  data: Omit<Contato, "id" | "status" | "createdAt" | "updatedAt">,
): Promise<Contato> {
  try {
    return await fetchAPI<Contato>("/contatos", {
      method: "POST",
      body: JSON.stringify({ ...data, status: "novo" }),
    })
  } catch (error) {
    throw {
      message: `Erro ao criar contato: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function updateContato(id: number, data: Partial<Contato>): Promise<Contato> {
  try {
    return await fetchAPI<Contato>(`/contatos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  } catch (error) {
    throw {
      message: `Erro ao atualizar contato: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

export async function deleteContato(id: number): Promise<void> {
  try {
    return await fetchAPI<void>(`/contatos/${id}`, {
      method: "DELETE",
    })
  } catch (error) {
    throw {
      message: `Erro ao excluir contato: ${(error as ApiError).message}`,
      code: (error as ApiError).code,
    } as ApiError
  }
}

// Funções para pagamento simulado
export interface SimulacaoPagamento {
  numeroCartao: string
  nomeCartao: string
  validade: string
  cvv: string
  valor: number
}

export async function processarPagamento(
  dados: SimulacaoPagamento,
): Promise<{ sucesso: boolean; mensagem: string; idTransacao?: string }> {
  // Simulação de processamento de pagamento
  return new Promise((resolve) => {
    setTimeout(() => {
      // Validações básicas
      if (dados.numeroCartao.length !== 16) {
        resolve({
          sucesso: false,
          mensagem: "Número de cartão inválido. Deve conter 16 dígitos.",
        })
        return
      }

      if (dados.cvv.length !== 3) {
        resolve({
          sucesso: false,
          mensagem: "CVV inválido. Deve conter 3 dígitos.",
        })
        return
      }

      // Validação da data de validade
      const [mes, ano] = dados.validade.split("/")
      const dataAtual = new Date()
      const anoAtual = dataAtual.getFullYear() % 100
      const mesAtual = dataAtual.getMonth() + 1

      if (Number.parseInt(ano) < anoAtual || (Number.parseInt(ano) === anoAtual && Number.parseInt(mes) < mesAtual)) {
        resolve({
          sucesso: false,
          mensagem: "Cartão vencido.",
        })
        return
      }

      // Simulação de aprovação (90% de chance de sucesso)
      const aprovado = Math.random() < 0.9

      if (aprovado) {
        const idTransacao = `TX${Math.floor(Math.random() * 1000000)}`
        resolve({
          sucesso: true,
          mensagem: "Pagamento aprovado com sucesso!",
          idTransacao,
        })
      } else {
        resolve({
          sucesso: false,
          mensagem: "Pagamento recusado pela operadora. Tente novamente ou use outro cartão.",
        })
      }
    }, 2000) // Simula um delay de 2 segundos para o processamento
  })
}

