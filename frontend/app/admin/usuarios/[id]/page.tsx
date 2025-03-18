"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { usuariosService } from "@/lib/usuarios-service"
import { assinaturasService } from "@/lib/assinaturas-service"
import { ErrorMessage } from "@/components/ui/error-message"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, CreditCardIcon, UserIcon, ClockIcon } from "lucide-react"

export default function VisualizarUsuarioPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const userId = React.use(params).id
  const [usuario, setUsuario] = useState<any | null>(null)
  const [assinatura, setAssinatura] = useState<any | null>(null)
  const [pagamentos, setPagamentos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      setError(null)
      try {
        const usuarioData = await usuariosService.getUsuario(Number(userId))
        setUsuario(usuarioData)

        // Obter assinaturas do usuário
        const assinaturaData = await assinaturasService.getAssinaturaByUsuario(Number(userId))
        if (assinaturaData) {
          setAssinatura(assinaturaData)
        }

        // Obter pagamentos do usuário (simulado)
        setPagamentos([
          {
            id: 1,
            data: "2023-05-15",
            valor: 99.9,
            status: "pago",
            metodo: "Cartão de Crédito",
            plano: "Plano Premium",
          },
          {
            id: 2,
            data: "2023-06-15",
            valor: 99.9,
            status: "pago",
            metodo: "Cartão de Crédito",
            plano: "Plano Premium",
          },
          {
            id: 3,
            data: "2023-07-15",
            valor: 99.9,
            status: "pendente",
            metodo: "Boleto Bancário",
            plano: "Plano Premium",
          },
        ])
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setError("Não foi possível carregar os dados do usuário. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [userId])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return <ErrorMessage title="Erro ao carregar usuário" message={error} onRetry={() => window.location.reload()} />
  }

  if (!usuario) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-muted-foreground">Usuário não encontrado.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">{usuario.name}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/usuarios")}>
            Voltar
          </Button>
          <Button
            className="bg-gradient-murim hover:opacity-90"
            onClick={() => router.push(`/admin/usuarios/editar/${userId}`)}
          >
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-murim-blue">
              <Image src={usuario.foto || "/images/placeholder.jpg"} alt={usuario.name} fill className="object-cover" />
            </div>

            <h2 className="text-xl font-semibold">{usuario.name}</h2>
            <p className="text-muted-foreground">{usuario.email}</p>

            <div className="w-full mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-murim-blue" />
                <span className="text-sm">
                  Membro desde: {new Date(usuario.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={usuario.is_admin ? "default" : "outline"}>
                  {usuario.is_admin ? "Administrador" : "Usuário"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="assinatura" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="assinatura">Assinatura</TabsTrigger>
              <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
              <TabsTrigger value="atividades">Atividades</TabsTrigger>
            </TabsList>

            <TabsContent value="assinatura" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Plano de Assinatura</CardTitle>
                  <CardDescription>Informações sobre o plano atual</CardDescription>
                </CardHeader>
                <CardContent>
                  {assinatura ? (
                    <div className="bg-murim-blue/10 p-6 rounded-lg">
                      <div className="flex justify-between mb-4">
                        <h3 className="text-xl font-bold text-murim-blue">
                          {assinatura.plano?.nome || "Plano Premium"}
                        </h3>
                        <Badge className="bg-murim-blue">{assinatura.status === "ativa" ? "Ativa" : "Inativa"}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Valor Mensal</p>
                          <p className="text-lg font-semibold">R$ {assinatura.plano?.valor.toFixed(2) || "99,90"}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Próxima Renovação</p>
                          <p className="text-lg font-semibold">
                            {assinatura.data_renovacao
                              ? new Date(assinatura.data_renovacao).toLocaleDateString("pt-BR")
                              : "15/08/2023"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Data de Início</p>
                          <p className="text-lg font-semibold">
                            {assinatura.data_inicio
                              ? new Date(assinatura.data_inicio).toLocaleDateString("pt-BR")
                              : "15/05/2023"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Método de Pagamento</p>
                          <p className="text-lg font-semibold">{assinatura.metodo_pagamento || "Cartão de Crédito"}</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Benefícios do Plano:</h4>
                        <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                          {assinatura.plano?.beneficios ? (
                            assinatura.plano.beneficios.map((beneficio: string, index: number) => (
                              <li key={index}>{beneficio}</li>
                            ))
                          ) : (
                            <>
                              <li>Acesso ilimitado à academia</li>
                              <li>Consulta com nutricionista mensal</li>
                              <li>Aulas em grupo inclusas</li>
                              <li>Desconto de 15% em produtos</li>
                              <li>2 sessões com personal trainer por mês</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhuma assinatura ativa encontrada.</p>
                      <Button className="mt-4">Adicionar Assinatura</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pagamentos" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Pagamentos</CardTitle>
                  <CardDescription>Pagamentos realizados pelo usuário</CardDescription>
                </CardHeader>
                <CardContent>
                  {pagamentos.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Plano</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Método</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pagamentos.map((pagamento) => (
                          <TableRow key={pagamento.id}>
                            <TableCell>{new Date(pagamento.data).toLocaleDateString("pt-BR")}</TableCell>
                            <TableCell>{pagamento.plano}</TableCell>
                            <TableCell>R$ {pagamento.valor.toFixed(2)}</TableCell>
                            <TableCell>{pagamento.metodo}</TableCell>
                            <TableCell>
                              <Badge variant={pagamento.status === "pago" ? "default" : "outline"}>
                                {pagamento.status === "pago" ? "Pago" : "Pendente"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhum pagamento registrado.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="atividades" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Registro de Atividades</CardTitle>
                  <CardDescription>Histórico de atividades do usuário</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-lg border">
                      <div className="bg-murim-blue/10 p-2 rounded-full">
                        <ClockIcon className="h-5 w-5 text-murim-blue" />
                      </div>
                      <div>
                        <p className="font-medium">Check-in na Academia</p>
                        <p className="text-sm text-muted-foreground">Hoje às 10:32</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg border">
                      <div className="bg-murim-blue/10 p-2 rounded-full">
                        <CreditCardIcon className="h-5 w-5 text-murim-blue" />
                      </div>
                      <div>
                        <p className="font-medium">Pagamento Realizado</p>
                        <p className="text-sm text-muted-foreground">15/07/2023 às 08:15</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg border">
                      <div className="bg-murim-blue/10 p-2 rounded-full">
                        <CalendarIcon className="h-5 w-5 text-murim-blue" />
                      </div>
                      <div>
                        <p className="font-medium">Agendamento com Personal Trainer</p>
                        <p className="text-sm text-muted-foreground">12/07/2023 às 14:00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

