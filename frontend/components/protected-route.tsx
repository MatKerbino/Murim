"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

// Corrigir a exportação do componente para ser compatível com a importação no layout
export function ProtectedRoute({
  children,
  adminOnly = false,
  requiredRole,
}: {
  children: React.ReactNode
  adminOnly?: boolean
  requiredRole?: string
}) {
  const router = useRouter()
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Verificar se estamos no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirecionar se não estiver autenticado ou não for admin (quando necessário)
  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if ((adminOnly || requiredRole === "admin") && !isAdmin) {
        router.push("/")
      }
    }
  }, [mounted, isAuthenticated, isAdmin, isLoading, router, adminOnly, requiredRole])

  // Não renderizar nada no servidor ou durante o carregamento
  if (!mounted || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Não renderizar nada se não estiver autenticado ou não for admin (quando necessário)
  if (!isAuthenticated || ((adminOnly || requiredRole === "admin") && !isAdmin)) {
    return null
  }

  // Renderizar o conteúdo protegido
  return <>{children}</>
}

// Manter o export default para compatibilidade com código existente
export default ProtectedRoute

