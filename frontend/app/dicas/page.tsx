"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ErrorMessage } from "@/components/ui/error-message"
import { dicasService } from "@/lib/dicas-service"
import { useAuth } from "@/contexts/auth-context"
import { MessageCircle, ThumbsUp, Calendar, User, Tag } from "lucide-react"
import type { ApiError } from "@/lib/api"

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

function DicasContent() {
  const [dicas, setDicas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("todas")
  const [newComments, setNewComments] = useState({})
  const [comments, setComments] = useState({})
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    async function loadDicas() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await dicasService.getDicas()
        setDicas(data)

        // Initialize empty comments for each dica
        const initialComments = {}
        data.forEach((dica) => {
          initialComments[dica.id] = []
        })
        setComments(initialComments)
      } catch (error) {
        console.error("Erro ao carregar dicas:", error)
        setError((error as ApiError).message || "Não foi possível carregar as dicas. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    loadDicas()
  }, [])

  const handleCommentChange = (dicaId, value) => {
    setNewComments({
      ...newComments,
      [dicaId]: value,
    })
  }

  const handleCommentSubmit = (dicaId) => {
    if (!newComments[dicaId] || newComments[dicaId].trim().length < 3) {
      alert("O comentário deve ter pelo menos 3 caracteres.")
      return
    }

    // Add comment to local state (in a real app, this would be an API call)
    const newComment = {
      id: Date.now(),
      author: user?.name || "Usuário",
      content: newComments[dicaId],
      date: new Date().toISOString(),
    }

    setComments((prev) => ({
      ...prev,
      [dicaId]: [...(prev[dicaId] || []), newComment],
    }))

    setNewComments({
      ...newComments,
      [dicaId]: "",
    })
  }

  const filteredDicas = dicas.filter((dica) => {
    if (activeTab === "todas") return true
    return dica.categoria?.slug === activeTab
  })

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (isLoading) {
    return <DicasLoading />
  }

  if (error) {
    return <ErrorMessage title="Erro ao carregar dicas" message={error} onRetry={() => window.location.reload()} />
  }

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDicas.length > 0 ? (
              filteredDicas.map((dica) => (
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

                    <Button variant="link" className="p-0 h-auto mt-2 text-primary">
                      Ler mais
                    </Button>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          Comentários ({comments[dica.id]?.length || 0})
                        </h4>
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Curtir
                        </Button>
                      </div>

                      {comments[dica.id]?.slice(0, 2).map((comment) => (
                        <div key={comment.id} className="mb-3 pb-3 border-b border-gray-100 last:border-0">
                          <div className="flex items-start gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{getInitials(comment.author)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-medium">{comment.author}</p>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.date).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {isAuthenticated ? (
                        <div className="mt-2">
                          <Textarea
                            placeholder="Escreva um comentário..."
                            className="text-xs min-h-[60px]"
                            value={newComments[dica.id] || ""}
                            onChange={(e) => handleCommentChange(dica.id, e.target.value)}
                          />
                          <Button size="sm" className="mt-2 h-8 text-xs" onClick={() => handleCommentSubmit(dica.id)}>
                            Comentar
                          </Button>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-2">
                          <Link href="/login" className="text-primary hover:underline">
                            Faça login
                          </Link>{" "}
                          para comentar
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">Nenhuma dica encontrada nesta categoria.</p>
              </div>
            )}
          </div>
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
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}

