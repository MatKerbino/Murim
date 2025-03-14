"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { planosService, type Plano } from "@/lib/planos-service"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/auth-service"
// Importar o serviço de assinaturas
import { assinaturasService } from "@/lib/assinaturas-service"

export default function PlanosPage() {
  const [planos, setPlanos] = useState<Plano[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = await authService.checkAuth()
        setIsAuthenticated(isLoggedIn)
      } catch (error) {
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    const loadPlanos = async () => {
      setIsLoading(true)
      try {
        const data = await planosService.getPlanos()
        setPlanos(data)
      } catch (error) {
        console.error("Erro ao carregar planos:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os planos. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPlanos()
  }, [toast])

  // Atualizar a função handleAssinar
  const handleAssinar = async (plano: Plano) => {
    if (!isAuthenticated) {
      toast({
        title: "Atenção",
        description: "Você precisa estar logado para assinar um plano.",
        variant: "default",
      })
      router.push("/login?redirect=/planos")
      return
    }

    try {
      setIsLoading(true)
      await assinaturasService.assinarPlano(plano.id)
      toast({
        title: "Sucesso",
        description: `Você assinou o plano ${plano.nome} com sucesso!`,
        variant: "default",
      })
      router.push("/perfil")
    } catch (error) {
      console.error("Erro ao assinar plano:", error)
      toast({
        title: "Erro",
        description: "Não foi possível assinar o plano. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6 gradient-text">Carregando planos...</h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-murim-blue"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 gradient-text">Nossos Planos</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Escolha o plano que melhor se adapta às suas necessidades e comece sua jornada na Academia Murim.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {planos.map((plano) => (
          <Card key={plano.id} className="flex flex-col glass-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">{plano.nome}</CardTitle>
              <CardDescription>{plano.descricao}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-6">
                <p className="text-3xl font-bold">
                  R$ {plano.valor.toFixed(2)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{plano.duracao === 1 ? "mês" : `${plano.duracao} meses`}
                  </span>
                </p>
              </div>
              <ul className="space-y-2">
                {plano.beneficios &&
                  plano.beneficios.map((beneficio, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-murim-blue shrink-0 mr-2" />
                      <span>{beneficio}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleAssinar(plano)}>
                Assinar Agora
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

