"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, Mail } from "lucide-react"
import { getContatos } from "@/lib/api"
import type { Contato } from "@/lib/api"

export default function ContatosPage() {
  const [contatos, setContatos] = useState<Contato[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedContato, setSelectedContato] = useState<Contato | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const itemsPerPage = 10

  useEffect(() => {
    async function loadContatos() {
      setIsLoading(true)
      try {
        const data = await getContatos()
        setContatos(data)
      } catch (error) {
        console.error("Erro ao carregar contatos:", error)
        // Dados de fallback em caso de erro na API
        setContatos([
          {
            id: 1,
            nome: "Maria Silva",
            email: "maria@example.com",
            telefone: "11999999999",
            assunto: "duvidas",
            mensagem:
              "Gostaria de saber mais sobre os planos disponíveis e se há alguma promoção para novos alunos. Também tenho interesse em saber se vocês oferecem aulas de pilates.",
            status: "novo",
            createdAt: "2023-03-10T10:30:00Z",
            updatedAt: "2023-03-10T10:30:00Z",
          },
          {
            id: 2,
            nome: "João Pereira",
            email: "joao@example.com",
            telefone: "11888888888",
            assunto: "reclamacoes",
            mensagem:
              "Estou com problemas para agendar um horário com o personal trainer através do site. Sempre que tento confirmar o agendamento, recebo uma mensagem de erro.",
            status: "lido",
            createdAt: "2023-03-09T15:45:00Z",
            updatedAt: "2023-03-09T16:20:00Z",
          },
          {
            id: 3,
            nome: "Ana Oliveira",
            email: "ana@example.com",
            telefone: "11777777777",
            assunto: "elogios",
            mensagem:
              "Quero parabenizar a equipe pelo excelente atendimento e pela qualidade das instalações. Estou muito satisfeita com os resultados que venho obtendo desde que me matriculei.",
            status: "respondido",
            createdAt: "2023-03-08T09:15:00Z",
            updatedAt: "2023-03-08T14:30:00Z",
          },
          {
            id: 4,
            nome: "Carlos Santos",
            email: "carlos@example.com",
            telefone: null,
            assunto: "sugestoes",
            mensagem:
              "Sugiro que a academia ofereça mais horários para as aulas de yoga nos finais de semana. Também seria interessante ter um espaço dedicado para alongamento.",
            status: "novo",
            createdAt: "2023-03-07T18:20:00Z",
            updatedAt: "2023-03-07T18:20:00Z",
          },
          {
            id: 5,
            nome: "Fernanda Lima",
            email: "fernanda@example.com",
            telefone: "11666666666",
            assunto: "outros",
            mensagem:
              "Gostaria de saber se vocês aceitam parcerias com empresas para oferecer descontos aos funcionários. Sou gerente de RH e tenho interesse em estabelecer uma parceria.",
            status: "lido",
            createdAt: "2023-03-06T11:10:00Z",
            updatedAt: "2023-03-06T13:45:00Z",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadContatos()
  }, [])

  const handleViewContato = (contato: Contato) => {
    setSelectedContato(contato)
    setIsDialogOpen(true)

    // Se o contato estiver com status "novo", marcar como "lido"
    if (contato.status === "novo") {
      const updatedContato = { ...contato, status: "lido" as const }
      // Atualizar na API
      // updateContato(contato.id, updatedContato)

      // Atualizar localmente
      setContatos(contatos.map((c) => (c.id === contato.id ? updatedContato : c)))
      setSelectedContato(updatedContato)
    }
  }

  const handleMarkAsResponded = async () => {
    if (!selectedContato) return

    const updatedContato = { ...selectedContato, status: "respondido" as const }
    try {
      // Atualizar na API
      // await updateContato(selectedContato.id, updatedContato)

      // Atualizar localmente
      setContatos(contatos.map((c) => (c.id === selectedContato.id ? updatedContato : c)))
      setSelectedContato(updatedContato)
    } catch (error) {
      console.error("Erro ao marcar como respondido:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta mensagem?")) {
      try {
        // await deleteContato(id)
        setContatos(contatos.filter((contato) => contato.id !== id))
        if (selectedContato?.id === id) {
          setIsDialogOpen(false)
          setSelectedContato(null)
        }
      } catch (error) {
        console.error("Erro ao excluir contato:", error)
      }
    }
  }

  // Filtrar contatos com base no termo de pesquisa
  const filteredContatos = contatos.filter(
    (contato) =>
      contato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contato.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contato.mensagem.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Paginação
  const totalPages = Math.ceil(filteredContatos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedContatos = filteredContatos.slice(startIndex, startIndex + itemsPerPage)

  // Função para traduzir o assunto
  const traduzirAssunto = (assunto: string) => {
    const traducoes = {
      duvidas: "Dúvidas",
      sugestoes: "Sugestões",
      reclamacoes: "Reclamações",
      elogios: "Elogios",
      outros: "Outros",
    }
    return traducoes[assunto as keyof typeof traducoes] || assunto
  }

  // Função para obter a badge de status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "novo":
        return <Badge className="bg-blue-500">Novo</Badge>
      case "lido":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Lido
          </Badge>
        )
      case "respondido":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Respondido
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight gradient-text">Mensagens de Contato</h1>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Gerenciar Mensagens</CardTitle>
          <CardDescription>
            Visualize e responda as mensagens enviadas através do formulário de contato.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar mensagens..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-murim-blue"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedContatos.length > 0 ? (
                      paginatedContatos.map((contato) => (
                        <TableRow key={contato.id} className={contato.status === "novo" ? "font-medium" : ""}>
                          <TableCell>{getStatusBadge(contato.status)}</TableCell>
                          <TableCell>{contato.nome}</TableCell>
                          <TableCell>{contato.email}</TableCell>
                          <TableCell>{traduzirAssunto(contato.assunto)}</TableCell>
                          <TableCell>{new Date(contato.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewContato(contato)}>
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(contato.id)}>Excluir</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          Nenhuma mensagem encontrada.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog para visualizar mensagem */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mensagem de {selectedContato?.nome}</DialogTitle>
            <DialogDescription>
              Recebida em {selectedContato && new Date(selectedContato.createdAt).toLocaleString("pt-BR")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Assunto</h4>
              <p className="text-base">{selectedContato && traduzirAssunto(selectedContato.assunto)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
              <p className="text-base">{selectedContato?.email}</p>
            </div>
            {selectedContato?.telefone && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Telefone</h4>
                <p className="text-base">{selectedContato.telefone}</p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Mensagem</h4>
              <p className="text-base whitespace-pre-line">{selectedContato?.mensagem}</p>
            </div>
          </div>
          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" onClick={() => handleDelete(selectedContato?.id || 0)} className="hidden sm:flex">
              Excluir
            </Button>
            <div className="flex gap-2">
              {selectedContato?.status !== "respondido" && (
                <Button className="bg-gradient-murim hover:opacity-90" onClick={handleMarkAsResponded}>
                  <Mail className="mr-2 h-4 w-4" />
                  Marcar como Respondido
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Fechar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

