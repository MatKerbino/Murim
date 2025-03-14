"use client"

import type React from "react"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    href: string
    title: string
    icon?: React.ReactNode
  }[]
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const router = useRouter()

  // Redirecionar se não for admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, isAdmin, router])

  const sidebarItems = [
    {
      href: "/admin",
      title: "Dashboard",
    },
    {
      href: "/admin/alunos",
      title: "Alunos",
    },
    {
      href: "/admin/usuarios",
      title: "Usuários",
    },
    {
      href: "/admin/planos",
      title: "Planos",
    },
    {
      href: "/admin/pagamentos",
      title: "Pagamentos",
    },
    {
      href: "/admin/personais",
      title: "Personal Trainers",
    },
    {
      href: "/admin/agendamentos",
      title: "Agendamentos",
    },
    {
      href: "/admin/horarios",
      title: "Horários",
    },
    {
      href: "/admin/produtos",
      title: "Produtos",
    },
    {
      href: "/admin/dicas",
      title: "Dicas",
    },
    {
      href: "/admin/comentarios",
      title: "Comentários",
    },
    {
      href: "/admin/contatos",
      title: "Contatos",
    },
  ]

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
            <ScrollArea className="py-6 pr-6 lg:py-8">
              <Sidebar items={sidebarItems} className="p-2" />
            </ScrollArea>
          </aside>
          <main className="flex w-full flex-col overflow-hidden">
            <div className="md:hidden flex items-center h-14 px-4 border-b sticky top-0 bg-background z-10">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[280px] pr-0">
                  <Sidebar items={sidebarItems} className="px-2 py-6" />
                </SheetContent>
              </Sheet>
              <div className="font-semibold">Painel Administrativo</div>
            </div>
            <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

function Sidebar({ className, items, ...props }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
            pathname === item.href ? "bg-muted" : "hover:bg-transparent",
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </div>
  )
}

