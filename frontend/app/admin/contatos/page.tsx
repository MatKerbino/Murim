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
import { MoreHorizontal, Search, Mail, ExternalLink, AlertCircle } from "lucide-react"
import { contatoService, type Contato } from "@/lib/contato-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { EmptyState } from "@/components/ui/empty-state"

export default function ContatosPage() {
  const [contatos, setContatos] = useState<Contato[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedContato, setSelectedContato] = useState<Contato | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const itemsPerPage = 10

  useEffect(() => {
    loadContatos()
  }, [])

  async function loadContatos() {
    setIsLoading(true)
    setError(null)
    try {
      const data = await contatoService.getContatos()
      setContatos(data)
    } catch (error) {
      console.error("Erro ao carregar contatos:", error)
      setError("Não foi possível carregar os contatos. Por favor, tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewContato = async (contato: Contato) => {
    setSelectedContato(contato)
    setIsDialogOpen(true)

    // Se o contato estiver com status "novo", marcar como "lido"
    if (contato.status === "novo") {
      try {
        // Buscar o contato atualizado para garantir que temos os dados mais recentes
        const updatedContato = await contatoService.getContato(contato.id)

        // Atualizar localmente
        setContatos(contatos.map((c) => (c.id === contato.id ? updatedContato : c)))
        setSelectedContato(updatedContato)
      } catch (error) {
        console.error("Erro ao atualizar status do contato:", error)
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o status do contato.",
          variant: "destructive",
        })
      }
    }
  }

  const handleMarkAsResponded = async () => {
    if (!selectedContato) return

    try {
      // Atualizar na API
      const updatedContato = await contatoService.responderContato(selectedContato.id, "Respondido via sistema")

      // Atualizar localmente
      setContatos(contatos.map((c) => (c.id === selectedContato.id ? updatedContato : c)))
      setSelectedContato(updatedContato)

      toast({
        title: "Sucesso",
        description: "Contato marcado como respondido com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao marcar como respondido:", error)
      toast({
        title: "Erro",
        description: "Não foi possível marcar o contato como respondido.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta mensagem?")) {
      try {
        await contatoService.deleteContato(id)
        setContatos(contatos.filter((contato) => contato.id !== id))

        if (selectedContato?.id === id) {
          setIsDialogOpen(false)
          setSelectedContato(null)
        }

        toast({
          title: "Sucesso",
          description: "Mensagem excluída com sucesso.",
        })
      } catch (error) {
        console.error("Erro ao excluir contato:", error)
        toast({
          title: "Erro",
          description: "Não foi possível excluir a mensagem.",
          variant: "destructive",
        })
      }
    }
  }

  const handleReplyEmail = (email: string) => {
    // Criar URL para o Gmail com o email do destinatário preenchido
    const subject = encodeURIComponent("Resposta - Academia Murim")
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}`
    window.open(gmailUrl, "_blank")
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
    const traducoes: Record<string, string> = {
      duvidas: "Dúvidas",
      sugestoes: "Sugestões",
      reclamacoes: "Reclamações",
      elogios: "Elogios",
      outros: "Outros",
    }
    return traducoes[assunto] || assunto
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
            <Button variant="outline" onClick={loadContatos} className="flex items-center gap-1">
              Atualizar
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-murim-blue"></div>
            </div>
          ) : (
            <>
              {filteredContatos.length > 0 ? (
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
                      {paginatedContatos.map((contato) => (
                        <TableRow key={contato.id} className={contato.status === "novo" ? "font-medium" : ""}>
                          <TableCell>{getStatusBadge(contato.status)}</TableCell>
                          <TableCell>{contato.nome}</TableCell>
                          <TableCell>{contato.email}</TableCell>
                          <TableCell>{traduzirAssunto(contato.assunto)}</TableCell>
                          <TableCell>{new Date(contato.created_at).toLocaleDateString("pt-BR")}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleReplyEmail(contato.email)}>
                                  Responder por Email
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(contato.id)}>Excluir</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState
                  title="Nenhuma mensagem encontrada"
                  description={
                    searchTerm ? "Tente ajustar os termos da busca." : "Não há mensagens de contato para exibir."
                  }
                  icon={<Mail className="h-10 w-10 text-muted-foreground" />}
                />
              )}

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
              Recebida em {selectedContato && new Date(selectedContato.created_at).toLocaleString("pt-BR")}
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
              <Button
                className="bg-gradient-murim hover:opacity-90 flex items-center gap-1"
                onClick={() => handleReplyEmail(selectedContato?.email || "")}
              >
                <ExternalLink className="h-4 w-4" />
                Responder por Email
              </Button>
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

