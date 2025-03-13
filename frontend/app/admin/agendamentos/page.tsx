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
import { agendamentosService } from "@/lib/agendamentos-service"
import { Search, CheckCircle, XCircle, Trash2 } from "lucide-react"
import type { Agendamento } from "@/lib/agendamentos-service"
import type { ApiError } from "@/lib/api"

export default function AdminAgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadAgendamentos()
  }, [])

  const loadAgendamentos = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await agendamentosService.getAgendamentos()
      setAgendamentos(data)
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error)
      setError((error as ApiError).message || "Não foi possível carregar os agendamentos. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAprovarAgendamento = async (id: number, status: "confirmado" | "cancelado") => {
    try {
      await agendamentosService.aprovarAgendamento(id, status)

      // Atualizar lista local
      setAgendamentos(agendamentos.map((a) => (a.id === id ? { ...a, status } : a)))

      toast({
        title: "Sucesso",
        description:
          status === "confirmado" ? "Agendamento confirmado com sucesso." : "Agendamento cancelado com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao aprovar/cancelar agendamento:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível processar a solicitação. Tente novamente.",
      })
    }
  }

  const handleExcluirAgendamento = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) {
      return
    }

    try {
      await agendamentosService.deleteAgendamento(id)

      // Remover da lista local
      setAgendamentos(agendamentos.filter((a) => a.id !== id))

      toast({
        title: "Sucesso",
        description: "Agendamento excluído com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o agendamento. Tente novamente.",
      })
    }
  }

  // Filtrar agendamentos com base no termo de pesquisa
  const filteredAgendamentos = agendamentos.filter(
    (agendamento) =>
      agendamento.aluno?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.personal?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.data.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.horario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-600">
            Pendente
          </Badge>
        )
      case "confirmado":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-600">
            Confirmado
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Gerenciar Agendamentos</h1>

      <Card>
        <CardHeader>
          <CardTitle>Agendamentos</CardTitle>
          <CardDescription>Gerencie os agendamentos de personal trainers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar agendamentos..."
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
            <ErrorMessage title="Erro ao carregar agendamentos" message={error} onRetry={loadAgendamentos} />
          ) : filteredAgendamentos.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Personal</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgendamentos.map((agendamento) => (
                    <TableRow key={agendamento.id}>
                      <TableCell>{agendamento.aluno?.nome}</TableCell>
                      <TableCell>{agendamento.personal?.nome}</TableCell>
                      <TableCell>{new Date(agendamento.data).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{agendamento.horario}</TableCell>
                      <TableCell>{getStatusBadge(agendamento.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {agendamento.status === "pendente" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => handleAprovarAgendamento(agendamento.id, "confirmado")}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Confirmar
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleAprovarAgendamento(agendamento.id, "cancelado")}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancelar
                              </Button>
                            </>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => handleExcluirAgendamento(agendamento.id)}
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
              <p className="text-muted-foreground">Nenhum agendamento encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

