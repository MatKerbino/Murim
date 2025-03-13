"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ErrorMessage } from "@/components/ui/error-message"
import { dicasService } from "@/lib/dicas-service"
import { useAuth } from "@/contexts/auth-context"
import { MessageCircle, ThumbsUp, Calendar, User, Tag } from "lucide-react"
import type { Dica } from "@/lib/dicas-service"
import { EmptyState } from "@/components/ui/empty-state"

export default function DicasPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">Blog de Dicas</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Confira nossas dicas sobre desempenho, nutrição e vestuário para melhorar seus resultados.
        </p>
      </div>
      <DicasContent />
    </div>
  )
}

export function DicasContent() {
  const [dicas, setDicas] = useState<Dica[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("todas")
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    async function loadDicas() {
      setIsLoading(true)
      setError(null)
      try {
        console.log("Carregando dicas...")
        const data = await dicasService.getDicas()
        console.log("Dicas carregadas:", data)
        setDicas(data)
      } catch (error) {
        console.error("Erro ao carregar dicas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDicas()
  }, [])

  const filteredDicas = dicas.filter((dica) => {
    if (activeTab === "todas") return true
    return dica.categoria?.slug === activeTab
  })

  return (
    <div className="w-full">
      <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="desempenho">Desempenho</TabsTrigger>
          <TabsTrigger value="nutricao">Nutrição</TabsTrigger>
          <TabsTrigger value="vestuario">Vestuário</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <DicasLoading />
          ) : error ? (
            <ErrorMessage title="Erro ao carregar dicas" message={error} onRetry={() => window.location.reload()} />
          ) : filteredDicas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDicas.map((dica) => (
                <Card
                  key={dica.id}
                  className="border shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={
                        dica.imagem || `/placeholder.svg?height=300&width=500&text=${encodeURIComponent(dica.titulo)}`
                      }
                      alt={dica.titulo}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="text-xs text-primary font-medium">{dica.categoria?.nome}</span>
                    </div>
                    <CardTitle className="text-xl">{dica.titulo}</CardTitle>
                    <CardDescription>{dica.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">{dica.conteudo}</p>

                    <div className="flex items-center mt-4 space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(dica.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{dica.autor}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <Link href={`/dicas/${dica.id}`}>
                        <Button variant="link" className="p-0 h-auto text-primary">
                          Ler mais
                        </Button>
                      </Link>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Comentários
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Curtir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState 
              title="Nenhuma dica encontrada" 
              description="Não encontramos nenhuma dica nesta categoria. Tente selecionar outra categoria ou volte mais tarde."
              actionLabel="Ver todas as categorias"
              onAction={() => setActiveTab("todas")}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DicasLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="border shadow-sm overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}

