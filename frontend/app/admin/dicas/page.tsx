"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { ErrorMessage } from "@/components/ui/error-message"
import { dicasAdminService } from "@/lib/dicas-admin-service"
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Dica } from "@/lib/dicas-admin-service"

export default function AdminDicasPage() {
  const [dicas, setDicas] = useState<Dica[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadDicas()
  }, [])

  const loadDicas = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await dicasAdminService.getDicas()
      setDicas(data)
    } catch (error) {
      console.error("Erro ao carregar dicas:", error)
      setError("Não foi possível carregar as dicas. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExcluirDica = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta dica?")) {
      return
    }

    try {
      await dicasAdminService.deleteDica(id)
      setDicas(dicas.filter((d) => d.id !== id))
      toast({
        title: "Sucesso",
        description: "Dica excluída com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir dica:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir a dica. Tente novamente.",
      })
    }
  }

  // Filtrar dicas com base no termo de pesquisa
  const filteredDicas = dicas.filter(
    (dica) =>
      dica.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dica.conteudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dica.categoria?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      "",
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Gerenciar Dicas</h1>
        <div className="flex gap-2">
          <Link href="/admin/dicas/categorias">
            <Button variant="outline">Gerenciar Categorias</Button>
          </Link>
          <Link href="/admin/dicas/nova">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Dica
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dicas</CardTitle>
          <CardDescription>Gerencie as dicas de treino e nutrição</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar dicas..."
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
            <ErrorMessage title="Erro ao carregar dicas" message={error} onRetry={loadDicas} />
          ) : filteredDicas.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagem</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Interações</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDicas.map((dica) => (
                    <TableRow key={dica.id}>
                      <TableCell>
                        {dica.imagem ? (
                          <div className="relative h-10 w-10 rounded-md overflow-hidden">
                            <Image
                              src={dica.imagem || "/placeholder.svg"}
                              alt={dica.titulo}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">Sem imagem</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{dica.titulo}</TableCell>
                      <TableCell>{dica.categoria?.nome || "Sem categoria"}</TableCell>
                      <TableCell>{dica.user?.name || "Desconhecido"}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span title="Comentários" className="text-sm">
                            💬 {dica.comentarios_count || 0}
                          </span>
                          <span title="Curtidas" className="text-sm">
                            ❤️ {dica.curtidas_count || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/dicas/${dica.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                          </Link>
                          <Link href={`/admin/dicas/${dica.id}/editar`}>
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => handleExcluirDica(dica.id)}
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
              <p className="text-muted-foreground">Nenhuma dica encontrada.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

