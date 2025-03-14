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
import { pagamentosService } from "@/lib/pagamentos-service"
import { Search, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import type { Pagamento } from "@/lib/pagamentos-service"

export default function AdminPagamentosPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadPagamentos()
  }, [])

  const loadPagamentos = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await pagamentosService.getPagamentos()
      setPagamentos(data)
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error)
      setError("Não foi possível carregar os pagamentos. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExcluirPagamento = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este registro de pagamento?")) {
      return
    }

    try {
      await pagamentosService.deletePagamento(id)
      setPagamentos(pagamentos.filter((p) => p.id !== id))
      toast({
        title: "Sucesso",
        description: "Registro de pagamento excluído com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir pagamento:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o registro de pagamento. Tente novamente.",
      })
    }
  }

  // Filtrar pagamentos com base no termo de pesquisa
  const filteredPagamentos = pagamentos.filter(
    (pagamento) =>
      pagamento.aluno?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      "" ||
      pagamento.valor.toString().includes(searchTerm) ||
      pagamento.data_pagamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pagamento.metodo_pagamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pagamento.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pagamento.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      "",
  )

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pago":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-600">
            Pago
          </Badge>
        )
      case "pendente":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-600">
            Pendente
          </Badge>
        )
      case "cancelado":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-600">
            Cancelado
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "loja":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-600">
            Loja
          </Badge>
        )
      case "plano":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-600">
            Plano
          </Badge>
        )
      case "agendamento":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-600">
            Agendamento
          </Badge>
        )
      default:
        return <Badge>{tipo}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Histórico de Pagamentos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pagamentos</CardTitle>
          <CardDescription>Visualize o histórico de pagamentos dos alunos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar pagamentos..."
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
            <ErrorMessage title="Erro ao carregar pagamentos" message={error} onRetry={loadPagamentos} />
          ) : filteredPagamentos.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPagamentos.map((pagamento) => (
                    <TableRow key={pagamento.id}>
                      <TableCell>{pagamento.aluno?.nome || "Aluno"}</TableCell>
                      <TableCell>{getTipoBadge(pagamento.tipo || "")}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(pagamento.valor)}
                      </TableCell>
                      <TableCell>{new Date(pagamento.data_pagamento).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{pagamento.metodo_pagamento}</TableCell>
                      <TableCell>{getStatusBadge(pagamento.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/pagamentos/${pagamento.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => handleExcluirPagamento(pagamento.id)}
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
              <p className="text-muted-foreground">Nenhum pagamento encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

