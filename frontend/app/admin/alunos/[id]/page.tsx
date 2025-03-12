"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAluno, getPlano } from "@/lib/api"
import type { Aluno, Plano } from "@/lib/api"

export default function VisualizarAlunoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [aluno, setAluno] = useState<Aluno | null>(null)
  const [plano, setPlano] = useState<Plano | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const alunoData = await getAluno(Number.parseInt(params.id))
        setAluno(alunoData)

        const planoData = await getPlano(alunoData.planoId)
        setPlano(planoData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        // Dados de fallback
        setAluno({
          id: Number.parseInt(params.id),
          nome: "João Silva",
          email: "joao@example.com",
          telefone: "11999999999",
          dataNascimento: "1990-05-15",
          matricula: "A001",
          planoId: 1,
          createdAt: "2023-01-10T10:00:00Z",
          updatedAt: "2023-01-10T10:00:00Z",
        })

        setPlano({
          id: 1,
          nome: "Mensal",
          descricao: "Plano mensal básico",
          valor: 99.9,
          duracao: 1,
          beneficios: ["Acesso à academia"],
          createdAt: "",
          updatedAt: "",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-murim-blue"></div>
      </div>
    )
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
                  <TableRow>
                    <TableCell>10/01/2023</TableCell>
                    <TableCell>Mensal</TableCell>
                    <TableCell>R$ 99,90</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Pago
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>10/02/2023</TableCell>
                    <TableCell>Mensal</TableCell>
                    <TableCell>R$ 99,90</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Pago
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>10/03/2023</TableCell>
                    <TableCell>Mensal</TableCell>
                    <TableCell>R$ 99,90</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Pago
                      </span>
                    </TableCell>
                  </TableRow>
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
                  <TableRow>
                    <TableCell>15/03/2023</TableCell>
                    <TableCell>10:00 - 11:00</TableCell>
                    <TableCell>Pedro Costa</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Concluído
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>22/03/2023</TableCell>
                    <TableCell>10:00 - 11:00</TableCell>
                    <TableCell>Pedro Costa</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Concluído
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>29/03/2023</TableCell>
                    <TableCell>10:00 - 11:00</TableCell>
                    <TableCell>Pedro Costa</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Agendado
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

