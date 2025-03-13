"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authService, type User, type LoginCredentials } from "@/lib/auth-service"
import { toast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
}

// Valor padrão para o contexto
const defaultContext: AuthContextType = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {
    throw new Error("AuthProvider not initialized")
  },
  logout: async () => {
    throw new Error("AuthProvider not initialized")
  },
}

const AuthContext = createContext<AuthContextType>(defaultContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar se o usuário está autenticado ao carregar a página
    const loadUser = () => {
      try {
        const currentUser = authService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Erro ao carregar usuário:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const user = await authService.login(credentials)
      setUser(user)
      return user
    } catch (error) {
      // Propagar o erro para ser tratado no componente
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
      router.push("/login")
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta.",
      })
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao desconectar da sua conta.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.is_admin || false,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

