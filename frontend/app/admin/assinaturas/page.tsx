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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Search } from "lucide-react"
import { assinaturasService, type Assinatura } from "@/lib/assinaturas-service"
import { useToast } from "@/hooks/use-toast"
import { EmptyState } from "@/components/ui/empty-state"

export default function AssinaturasAdminPage() {
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentAssinatura, setCurrentAssinatura] = useState<Partial<Assinatura>>({})
  const { toast } = useToast()

  const loadAssinaturas = async () => {
    setIsLoading(true)
    try {
      const data = await assinaturasService.getAllAssinaturas()
      setAssinaturas(data)
    } catch (error) {
      console.error("Erro ao carregar assinaturas:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as assinaturas. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAssinaturas()
  }, [toast])

  const filteredAssinaturas = assinaturas.filter(
    (assinatura) =>
      assinatura.plano?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assinatura.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentAssinatura((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setCurrentAssinatura((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      if (!currentAssinatura.id) return

      await assinaturasService.updateAssinatura(currentAssinatura.id, {
        ativa: currentAssinatura.ativa,
        status_pagamento: currentAssinatura.status_pagamento,
      })

      toast({
        title: "Sucesso",
        description: "Assinatura atualizada com sucesso!",
      })

      setIsDialogOpen(false)
      setCurrentAssinatura({})
      loadAssinaturas()
    } catch (error) {
      console.error("Erro ao salvar assinatura:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a assinatura. Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (assinatura: Assinatura) => {
    setCurrentAssinatura(assinatura)
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Assinaturas</h1>
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
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Assinaturas</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Assinaturas</CardTitle>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar assinaturas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredAssinaturas.length === 0 ? (
            <EmptyState
              title="Nenhuma assinatura encontrada"
              description="Não encontramos nenhuma assinatura com os critérios de busca informados."
              icon="Search"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Data Fim</TableHead>
                  <TableHead>Valor Pago</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ativa</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssinaturas.map((assinatura) => (
                  <TableRow key={assinatura.id}>
                    <TableCell className="font-medium">{assinatura.user?.name}</TableCell>
                    <TableCell>{assinatura.plano?.nome}</TableCell>
                    <TableCell>{new Date(assinatura.data_inicio).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(assinatura.data_fim).toLocaleDateString()}</TableCell>
                    <TableCell>R$ {assinatura.valor_pago.toFixed(2)}</TableCell>
                    <TableCell>{assinatura.status_pagamento}</TableCell>
                    <TableCell>{assinatura.ativa ? "Sim" : "Não"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(assinatura)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog para editar assinatura */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Assinatura</DialogTitle>
            <DialogDescription>Atualize o status e a ativação da assinatura.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status_pagamento" className="text-right">
                Status
              </Label>
              <Select
                value={currentAssinatura.status_pagamento}
                onValueChange={(value) => handleSelectChange("status_pagamento", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="recusado">Recusado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ativa" className="text-right">
                Ativa
              </Label>
              <Select
                value={currentAssinatura.ativa ? "true" : "false"}
                onValueChange={(value) => handleSelectChange("ativa", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
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
    </div>
  )
}

