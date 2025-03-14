"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { alunosService } from "@/lib/alunos-service"
import { planosService } from "@/lib/planos-service"
import { ErrorMessage } from "@/components/ui/error-message"

// Definindo a interface Plano
interface Plano {
  id: number
  nome: string
  descricao: string
  valor: number
  duracao: number
  beneficios: string[]
  createdAt: string
  updatedAt: string
}

export default function VisualizarAlunoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [aluno, setAluno] = useState<any | null>(null)
  const [plano, setPlano] = useState<Plano | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      setError(null)
      try {
        const alunoData = await alunosService.getAluno(Number.parseInt(params.id))
        setAluno(alunoData)

        if (alunoData.planoId) {
          const planoData = await planosService.getPlano(alunoData.planoId)
          setPlano(planoData)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setError("Não foi possível carregar os dados do aluno. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return <ErrorMessage title="Erro ao carregar aluno" message={error} onRetry={() => window.location.reload()} />
  }

  if (!aluno) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-muted-foreground">Aluno não encontrado.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">{aluno.nome}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/alunos")}>
            Voltar
          </Button>
          <Button
            className="bg-gradient-murim hover:opacity-90"
            onClick={() => router.push(`/admin/alunos/${params.id}/editar`)}
          >
            Editar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
          <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Informações do Aluno</CardTitle>
              <CardDescription>Detalhes cadastrais do aluno</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nome Completo</h3>
                  <p className="text-base">{aluno.nome}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Matrícula</h3>
                  <p className="text-base">{aluno.matricula}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="text-base">{aluno.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Telefone</h3>
                  <p className="text-base">{aluno.telefone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Data de Nascimento</h3>
                  <p className="text-base">{new Date(aluno.dataNascimento).toLocaleDateString("pt-BR")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Data de Cadastro</h3>
                  <p className="text-base">{new Date(aluno.createdAt).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Plano Atual</h3>
                {plano ? (
                  <div className="bg-murim-blue/10 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-murim-blue">{plano.nome}</h4>
                      <span className="font-bold text-murim-blue">R$ {plano.valor.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{plano.descricao}</p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Benefícios:</p>
                      <ul className="text-sm text-muted-foreground list-disc pl-5">
                        {plano.beneficios.map((beneficio, index) => (
                          <li key={index}>{beneficio}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum plano associado.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagamentos" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>Registro de pagamentos realizados pelo aluno</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aluno.pagamentos && aluno.pagamentos.length > 0 ? (
                    aluno.pagamentos.map((pagamento) => (
                      <TableRow key={pagamento.id}>
                        <TableCell>{new Date(pagamento.dataVencimento).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>{pagamento.plano?.nome || "Plano"}</TableCell>
                        <TableCell>R$ {pagamento.valor.toFixed(2).replace(".", ",")}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              pagamento.status === "pago"
                                ? "bg-green-100 text-green-800"
                                : pagamento.status === "pendente"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {pagamento.status.charAt(0).toUpperCase() + pagamento.status.slice(1)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Nenhum pagamento registrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agendamentos" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Agendamentos</CardTitle>
              <CardDescription>Histórico de agendamentos com personal trainer</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Personal</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aluno.agendamentos && aluno.agendamentos.length > 0 ? (
                    aluno.agendamentos.map((agendamento) => (
                      <TableRow key={agendamento.id}>
                        <TableCell>{new Date(agendamento.data).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>{agendamento.horario}</TableCell>
                        <TableCell>{agendamento.personal?.nome || "Personal"}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              agendamento.status === "confirmado"
                                ? "bg-green-100 text-green-800"
                                : agendamento.status === "pendente"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Nenhum agendamento registrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

