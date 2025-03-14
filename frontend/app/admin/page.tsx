"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, ShoppingBag, Calendar, User, DollarSign, ShoppingCart, Briefcase } from "lucide-react"
import { dashboardService, type DashboardStats } from "@/lib/dashboard-service"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true)
      try {
        const data = await dashboardService.getStats()
        setStats(data)
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as estatísticas do dashboard. Tente novamente mais tarde.",
          variant: "destructive",
        })
        // Fallback para dados vazios em caso de erro
        setStats({
          totalAlunos: 0,
          totalUsuarios: 0,
          alunosNovosMes: 0,
          receitaMensal: 0,
          receitaPlanosAtivos: 0,
          receitaBruta: 0,
          crescimentoReceita: 0,
          vendasLoja: 0,
          vendasPlanos: 0,
          vendasAgendamentos: 0,
          vendasSemana: 0,
          agendamentos: 0,
          atividadesRecentes: [],
          mensagensRecentes: [],
          usuariosLogados: [],
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [toast])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Dashboard</h1>
        <p className="text-muted-foreground">Carregando informações...</p>
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-murim-blue"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight gradient-text">Dashboard</h1>
      <p className="text-muted-foreground">Bem-vindo ao painel administrativo da Academia Murim.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-murim-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAlunos || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.alunosNovosMes ? `+${stats.alunosNovosMes} no último mês` : "Sem novos alunos no último mês"}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <User className="h-4 w-4 text-murim-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsuarios || 0}</div>
            <p className="text-xs text-muted-foreground">Usuários registrados na plataforma</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita de Planos</CardTitle>
            <CreditCard className="h-4 w-4 text-murim-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R${" "}
              {stats?.receitaPlanosAtivos.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || "0,00"}
            </div>
            <p className="text-xs text-muted-foreground">Valor total de planos ativos</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Bruta</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R${" "}
              {stats?.receitaBruta.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ||
                "0,00"}
            </div>
            <p className="text-xs text-muted-foreground">Planos + vendas + agendamentos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas na Loja</CardTitle>
            <ShoppingCart className="h-4 w-4 text-murim-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.vendasLoja || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.vendasSemana ? `+${stats.vendasSemana} na última semana` : "Sem vendas na última semana"}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas de Planos</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.vendasPlanos || 0}</div>
            <p className="text-xs text-muted-foreground">Planos vendidos no mês atual</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-murim-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.agendamentos || 0}</div>
            <p className="text-xs text-muted-foreground">Para os próximos 7 dias</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.atividadesRecentes && stats.atividadesRecentes.length > 0 ? (
                stats.atividadesRecentes.map((atividade, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`mr-4 rounded-full bg-murim-${atividade.icone}/20 p-2`}>
                      {atividade.icone === "blue" && <Users className="h-4 w-4 text-murim-blue" />}
                      {atividade.icone === "pink" && <CreditCard className="h-4 w-4 text-murim-pink" />}
                      {atividade.icone === "purple" && <ShoppingBag className="h-4 w-4 text-murim-purple" />}
                      {atividade.icone === "cyan" && <Calendar className="h-4 w-4 text-murim-cyan" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{atividade.descricao}</p>
                      <p className="text-xs text-muted-foreground">{atividade.tempo}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma atividade recente encontrada.</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Mensagens Recentes</CardTitle>
            <CardDescription>Últimas mensagens recebidas pelo formulário de contato</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.mensagensRecentes && stats.mensagensRecentes.length > 0 ? (
                stats.mensagensRecentes.map((mensagem, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{mensagem.nome}</p>
                      <p className="text-xs text-muted-foreground">{mensagem.data}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{mensagem.mensagem.substring(0, 50)}...</p>
                    <div className="mt-2">
                      <Link href={`/admin/contatos/${mensagem.id}`} className="text-xs text-murim-blue hover:underline">
                        Ver mensagem completa
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma mensagem recente encontrada.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Usuários Online</CardTitle>
            <CardDescription>Usuários atualmente logados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.usuariosLogados && stats.usuariosLogados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.usuariosLogados.map((usuario, index) => (
                    <div key={index} className="flex items-center space-x-3 border rounded-md p-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{usuario.nome}</p>
                        <p className="text-xs text-muted-foreground">{usuario.email}</p>
                        <div className="flex items-center mt-1">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                          <p className="text-xs text-muted-foreground">Online há {usuario.tempo}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum usuário online no momento.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

