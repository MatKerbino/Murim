"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { ErrorMessage } from "@/components/ui/error-message"
import { dicasAdminService, type CategoriaDica } from "@/lib/dicas-admin-service"
import { Search, Plus, Pencil, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminCategoriasDicasPage() {
  const [categorias, setCategorias] = useState<CategoriaDica[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCategoria, setCurrentCategoria] = useState<Partial<CategoriaDica>>({})
  const [categoriaToDelete, setCategoriaToDelete] = useState<CategoriaDica | null>(null)

  useEffect(() => {
    loadCategorias()
  }, [])

  const loadCategorias = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await dicasAdminService.getCategorias()
      setCategorias(data)
    } catch (error) {
      console.error("Erro ao carregar categorias:", error)
      setError("Não foi possível carregar as categorias. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExcluirCategoria = async (id: number) => {
    try {
      await dicasAdminService.deleteCategoria(id)
      setCategorias(categorias.filter((c) => c.id !== id))
      setIsDeleteDialogOpen(false)
      setCategoriaToDelete(null)
      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir categoria:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir a categoria. Verifique se não existem dicas associadas a ela.",
      })
    }
  }

  const handleSubmit = async () => {
    if (!currentCategoria.nome) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O nome da categoria é obrigatório.",
      })
      return
    }

    try {
      if (currentCategoria.id) {
        // Atualizar categoria existente
        await dicasAdminService.updateCategoria(currentCategoria.id, { nome: currentCategoria.nome })
        setCategorias(
          categorias.map((cat) => (cat.id === currentCategoria.id ? { ...cat, nome: currentCategoria.nome } : cat)),
        )
      } else {
        // Criar nova categoria
        const novaCategoria = await dicasAdminService.createCategoria({ nome: currentCategoria.nome })
        setCategorias([...categorias, novaCategoria])
      }

      setIsDialogOpen(false)
      setCurrentCategoria({})
      toast({
        title: "Sucesso",
        description: currentCategoria.id ? "Categoria atualizada com sucesso." : "Categoria criada com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao salvar categoria:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar a categoria. Tente novamente.",
      })
    }
  }

  // Filtrar categorias com base no termo de pesquisa
  const filteredCategorias = categorias.filter((categoria) =>
    categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/admin/dicas">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Categorias de Dicas</h1>
        </div>
        <Button
          onClick={() => {
            setCurrentCategoria({})
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Categorias</CardTitle>
          <CardDescription>Categorias para organizar as dicas de treino e nutrição</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar categorias..."
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
                    </div>
                  </div>
                ))}
            </div>
          ) : error ? (
            <ErrorMessage title="Erro ao carregar categorias" message={error} onRetry={loadCategorias} />
          ) : filteredCategorias.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Dicas</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategorias.map((categoria) => (
                    <TableRow key={categoria.id}>
                      <TableCell className="font-medium">{categoria.nome}</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentCategoria(categoria)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setCategoriaToDelete(categoria)
                              setIsDeleteDialogOpen(true)
                            }}
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
              <p className="text-muted-foreground">Nenhuma categoria encontrada.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para criar/editar categoria */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentCategoria.id ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
            <DialogDescription>
              {currentCategoria.id
                ? "Edite o nome da categoria selecionada."
                : "Crie uma nova categoria para organizar as dicas."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                value={currentCategoria.nome || ""}
                onChange={(e) => setCurrentCategoria({ ...currentCategoria, nome: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a categoria "{categoriaToDelete?.nome}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => categoriaToDelete && handleExcluirCategoria(categoriaToDelete.id)}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

