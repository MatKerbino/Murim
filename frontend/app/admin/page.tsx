import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, ShoppingBag, Calendar } from "lucide-react"

export default function AdminDashboard() {
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
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">+5 no último mês</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <CreditCard className="h-4 w-4 text-murim-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 15.240,00</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas na Loja</CardTitle>
            <ShoppingBag className="h-4 w-4 text-murim-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+8 na última semana</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-murim-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
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
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-murim-blue/20 p-2">
                  <Users className="h-4 w-4 text-murim-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium">Novo aluno cadastrado</p>
                  <p className="text-xs text-muted-foreground">Há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-murim-pink/20 p-2">
                  <CreditCard className="h-4 w-4 text-murim-pink" />
                </div>
                <div>
                  <p className="text-sm font-medium">Pagamento registrado</p>
                  <p className="text-xs text-muted-foreground">Há 5 horas</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-murim-purple/20 p-2">
                  <ShoppingBag className="h-4 w-4 text-murim-purple" />
                </div>
                <div>
                  <p className="text-sm font-medium">Produto adicionado ao estoque</p>
                  <p className="text-xs text-muted-foreground">Há 1 dia</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-murim-cyan/20 p-2">
                  <Calendar className="h-4 w-4 text-murim-cyan" />
                </div>
                <div>
                  <p className="text-sm font-medium">Agendamento confirmado</p>
                  <p className="text-xs text-muted-foreground">Há 1 dia</p>
                </div>
              </div>
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
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Maria Silva</p>
                  <p className="text-xs text-muted-foreground">Hoje, 10:30</p>
                </div>
                <p className="text-sm text-muted-foreground">Gostaria de saber mais sobre os planos disponíveis...</p>
                <div className="mt-2">
                  <Link href="/admin/contatos" className="text-xs text-murim-blue hover:underline">
                    Ver mensagem completa
                  </Link>
                </div>
              </div>
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">João Pereira</p>
                  <p className="text-xs text-muted-foreground">Ontem, 15:45</p>
                </div>
                <p className="text-sm text-muted-foreground">Estou com problemas para agendar um horário com...</p>
                <div className="mt-2">
                  <Link href="/admin/contatos" className="text-xs text-murim-blue hover:underline">
                    Ver mensagem completa
                  </Link>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Ana Oliveira</p>
                  <p className="text-xs text-muted-foreground">2 dias atrás</p>
                </div>
                <p className="text-sm text-muted-foreground">Quero parabenizar a equipe pelo excelente...</p>
                <div className="mt-2">
                  <Link href="/admin/contatos" className="text-xs text-murim-blue hover:underline">
                    Ver mensagem completa
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

