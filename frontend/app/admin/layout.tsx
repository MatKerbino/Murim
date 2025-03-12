import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { Users, CreditCard, ShoppingBag, Calendar, Clock, FileText, MessageSquare, LogOut, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import ProtectedRoute from "@/components/protected-route"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute adminOnly>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col bg-primary text-primary-foreground">
          <div className="p-4 flex items-center gap-2">
            <Image src="/images/logo.svg" alt="Academia Murim" width={40} height={40} />
            <span className="text-xl font-bold">Admin Murim</span>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              <li>
                <Link href="/admin" className="flex items-center gap-2 p-2 rounded-md hover:bg-primary-foreground/10">
                  <Home size={18} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/alunos"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-primary-foreground/10"
                >
                  <Users size={18} />
                  <span>Alunos</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/planos"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-primary-foreground/10"
                >
                  <CreditCard size={18} />
                  <span>Planos</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/pagamentos"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-primary-foreground/10"
                >
                  <CreditCard size={18} />
                  <span>Pagamentos</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/produtos"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-primary-foreground/10"
                >
                  <ShoppingBag size={18} />
                  <span>Produtos</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/agendamentos"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-primary-foreground/10"
                >
                  <Calendar size={18} />
                  <span>Agendamentos</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/horarios"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-primary-foreground/10"
                >
                  <Clock size={18} />
                  <span>Horários</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/dicas"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-primary-foreground/10"
                >
                  <FileText size={18} />
                  <span>Dicas</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/contatos"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-primary-foreground/10"
                >
                  <MessageSquare size={18} />
                  <span>Contatos</span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-primary-foreground/10">
            <Link href="/">
              <Button
                variant="outline"
                className="w-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut size={18} className="mr-2" />
                Sair
              </Button>
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b flex items-center justify-between px-6 bg-background/80 backdrop-blur-md">
            <div className="flex items-center">
              <div className="md:hidden mr-4">
                <Button variant="outline" size="icon">
                  <Image src="/images/logo.svg" alt="Academia Murim" width={24} height={24} />
                </Button>
              </div>
              <h1 className="text-xl font-bold">Painel Administrativo</h1>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

