"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { planosService, type Plano } from "@/lib/planos-service"
import { useToast } from "@/hooks/use-toast"
import { EmptyState } from "@/components/ui/empty-state"
import NextImage from "next/image"

export default function PlanosAdminPage() {
  const [planos, setPlanos] = useState<Plano[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPlano, setCurrentPlano] = useState<Partial<Plano>>({})
  const [planoToDelete, setPlanoToDelete] = useState<Plano | null>(null)
  const { toast } = useToast()

  const loadPlanos = async () => {
    setIsLoading(true)
    try {
      const data = await planosService.getPlanos()
      setPlanos(data)
    } catch (error) {
      console.error("Erro ao carregar planos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os planos. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPlanos()
  }, [toast])

  const filteredPlanos = planos.filter(
    (plano) =>
      plano.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plano.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentPlano((prev) => ({ ...prev, [name]: value }))
  }

  const handleBeneficiosChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const beneficiosText = e.target.value
    const beneficiosArray = beneficiosText.split("\n").filter((item) => item.trim() !== "")
    setCurrentPlano((prev) => ({ ...prev, beneficios: beneficiosArray }))
  }

  const handleSubmit = async () => {
    try {
      if (!currentPlano.nome || !currentPlano.descricao || !currentPlano.valor || !currentPlano.duracao) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive",
        })
        return
      }

      if (currentPlano.id) {
        // Atualizar plano existente
        await planosService.updatePlano(currentPlano.id, currentPlano)
        toast({
          title: "Sucesso",
          description: "Plano atualizado com sucesso!",
        })
      } else {
        // Criar novo plano
        await planosService.createPlano(currentPlano as Omit<Plano, "id" | "created_at" | "updated_at">)
        toast({
          title: "Sucesso",
          description: "Plano criado com sucesso!",
        })
      }

      setIsDialogOpen(false)
      setCurrentPlano({})
      loadPlanos()
    } catch (error) {
      console.error("Erro ao salvar plano:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o plano. Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (plano: Plano) => {
    setCurrentPlano({
      ...plano,
      beneficios: plano.beneficios || [],
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!planoToDelete) return

    try {
      await planosService.deletePlano(planoToDelete.id)
      toast({
        title: "Sucesso",
        description: "Plano excluído com sucesso!",
      })
      setIsDeleteDialogOpen(false)
      setPlanoToDelete(null)
      loadPlanos()
    } catch (error) {
      console.error("Erro ao excluir plano:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o plano. Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  const openDeleteDialog = (plano: Plano) => {
    setPlanoToDelete(plano)
    setIsDeleteDialogOpen(true)
  }

  const openCreateDialog = () => {
    setCurrentPlano({
      nome: "",
      descricao: "",
      valor: 0,
      duracao: 1,
      beneficios: [],
      imagem: "",
    })
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Planos</h1>
        </div>
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-murim-blue"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Planos</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Novo Plano
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Planos</CardTitle>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar planos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredPlanos.length === 0 ? (
            <EmptyState
              title="Nenhum plano encontrado"
              description="Não encontramos nenhum plano com os critérios de busca informados."
              icon="Search"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlanos.map((plano) => (
                  <TableRow key={plano.id}>
                    <TableCell>
                      {plano.imagem ? (
                        <div className="relative h-10 w-10 rounded-md overflow-hidden">
                          <NextImage
                            src={plano.imagem || "/placeholder.svg"}
                            alt={plano.nome}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <NextImage className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{plano.nome}</TableCell>
                    <TableCell>{plano.descricao}</TableCell>
                    <TableCell>
                      R$ {typeof plano.valor === "number" ? plano.valor.toFixed(2) : Number(plano.valor).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {plano.duracao} {plano.duracao === 1 ? "mês" : "meses"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(plano)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => openDeleteDialog(plano)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog para criar/editar plano */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentPlano.id ? "Editar Plano" : "Novo Plano"}</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para {currentPlano.id ? "editar o" : "criar um novo"} plano.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                name="nome"
                value={currentPlano.nome || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descricao" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={currentPlano.descricao || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valor" className="text-right">
                Valor
              </Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                value={currentPlano.valor || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duracao" className="text-right">
                Duração (meses)
              </Label>
              <Input
                id="duracao"
                name="duracao"
                type="number"
                value={currentPlano.duracao || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imagem" className="text-right">
                URL da Imagem
              </Label>
              <Input
                id="imagem"
                name="imagem"
                value={currentPlano.imagem || ""}
                onChange={handleInputChange}
                placeholder="/images/planos/plano-basico.jpg"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="beneficios" className="text-right pt-2">
                Benefícios
              </Label>
              <Textarea
                id="beneficios"
                name="beneficios"
                value={currentPlano.beneficios ? currentPlano.beneficios.join("\n") : ""}
                onChange={handleBeneficiosChange}
                placeholder="Digite um benefício por linha"
                className="col-span-3 min-h-[100px]"
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
              Tem certeza que deseja excluir o plano "{planoToDelete?.nome}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

