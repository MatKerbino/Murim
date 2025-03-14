"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { ErrorMessage } from "@/components/ui/error-message"
import { comentariosService } from "@/lib/comentarios-service"
import { Search, CheckCircle, XCircle, Trash2 } from "lucide-react"

// Definindo a interface Comentario
interface Comentario {
  id: number
  conteudo: string
  aprovado: boolean
  created_at: string
  user?: {
    id: number
    name: string
  }
  dica?: {
    id: number
    titulo: string
  }
}

export default function AdminComentariosPage() {
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadComentarios()
  }, [])

  const loadComentarios = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await comentariosService.listarTodosComentarios()
      setComentarios(data)
    } catch (error) {
      console.error("Erro ao carregar comentários:", error)
      setError("Não foi possível carregar os comentários. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAprovarComentario = async (id: number, aprovado: boolean) => {
    try {
      await comentariosService.aprovarComentario(id, aprovado)

      // Atualizar lista local
      setComentarios(comentarios.map((c) => (c.id === id ? { ...c, aprovado } : c)))

      toast({
        title: "Sucesso",
        description: aprovado ? "Comentário aprovado com sucesso." : "Comentário reprovado com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao aprovar/reprovar comentário:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível processar a solicitação. Tente novamente.",
      })
    }
  }

  const handleExcluirComentario = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este comentário?")) {
      return
    }

    try {
      await comentariosService.excluirComentario(id)

      // Remover da lista local
      setComentarios(comentarios.filter((c) => c.id !== id))

      toast({
        title: "Sucesso",
        description: "Comentário excluído com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir comentário:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o comentário. Tente novamente.",
      })
    }
  }

  // Filtrar comentários com base no termo de pesquisa
  const filteredComentarios = comentarios.filter(
    (comentario) =>
      comentario.conteudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comentario.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      "" ||
      comentario.dica?.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      "",
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Gerenciar Comentários</h1>

      <Card>
        <CardHeader>
          <CardTitle>Comentários</CardTitle>
          <CardDescription>Gerencie os comentários feitos nas dicas do blog</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar comentários..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[400px]" />
                    </div>
                  </div>
                ))}
            </div>
          ) : error ? (
            <ErrorMessage title="Erro ao carregar comentários" message={error} onRetry={loadComentarios} />
          ) : filteredComentarios.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Dica</TableHead>
                    <TableHead>Comentário</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComentarios.map((comentario) => (
                    <TableRow key={comentario.id}>
                      <TableCell>{comentario.user?.name || "Usuário"}</TableCell>
                      <TableCell>{comentario.dica?.titulo || "Dica"}</TableCell>
                      <TableCell className="max-w-xs truncate">{comentario.conteudo}</TableCell>
                      <TableCell>{new Date(comentario.created_at).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        {comentario.aprovado ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Aprovado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!comentario.aprovado && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleAprovarComentario(comentario.id, true)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                          )}

                          {comentario.aprovado && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                              onClick={() => handleAprovarComentario(comentario.id, false)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reprovar
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => handleExcluirComentario(comentario.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Nenhum comentário encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

