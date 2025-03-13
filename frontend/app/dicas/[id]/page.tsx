"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorMessage } from "@/components/ui/error-message"
import { toast } from "@/components/ui/use-toast"
import { dicasService } from "@/lib/dicas-service"
import { comentariosService } from "@/lib/comentarios-service"
import { curtidasService } from "@/lib/curtidas-service"
import { useAuth } from "@/contexts/auth-context"
import { MessageCircle, ThumbsUp, Calendar, User, Tag, ArrowLeft, Trash2 } from "lucide-react"
import type { Dica } from "@/lib/dicas-service"
import type { Comentario } from "@/lib/comentarios-service"
import type { ApiError } from "@/lib/api"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { EmptyState } from "@/components/ui/empty-state"

export default function DicaDetalhesPage() {
  const { id } = useParams()
  const [dica, setDica] = useState<Dica | null>(null)
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [novoComentario, setNovoComentario] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [curtidaStatus, setCurtidaStatus] = useState({ curtido: false, total_curtidas: 0 })
  const { isAuthenticated, user } = useAuth()
  const [activeTab, setActiveTab] = useState("todas")
  const [comentariosLoading, setComentariosLoading] = useState(true)

  useEffect(() => {
    async function loadDica() {
      setIsLoading(true)
      setError(null)
      try {
        const dicaData = await dicasService.getDica(Number(id))
        setDica(dicaData)

        // Carregar comentários
        const comentariosData = await comentariosService.getComentarios(Number(id))
        console.log("Comentários:", comentariosData)
        setComentarios(comentariosData)

        // Verificar status de curtida se o usuário estiver autenticado
        if (isAuthenticated) {
          const curtidaData = await curtidasService.verificarCurtida(Number(id))
          setCurtidaStatus(curtidaData)
        }
      } catch (error) {
        console.error("Erro ao carregar dica:", error)
        setError((error as ApiError).message || "Não foi possível carregar a dica. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadDica()
    }
  }, [id, isAuthenticated])

  const handleComentarioSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para comentar.",
      })
      return
    }

    if (!novoComentario.trim() || novoComentario.length < 3) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O comentário deve ter pelo menos 3 caracteres.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const comentario = await comentariosService.criarComentario(Number(id), novoComentario)
      setComentarios([comentario, ...comentarios])
      setNovoComentario("")
      toast({
        title: "Sucesso",
        description: "Comentário adicionado com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar o comentário. Tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCurtida = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para curtir.",
      })
      return
    }

    try {
      const novoStatus = await curtidasService.toggleCurtida(Number(id))
      setCurtidaStatus(novoStatus)
    } catch (error) {
      console.error("Erro ao curtir/descurtir:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível processar sua curtida. Tente novamente.",
      })
    }
  }

  const handleExcluirComentario = async (comentarioId: number) => {
    if (!isAuthenticated) return

    try {
      await comentariosService.excluirComentario(comentarioId)
      setComentarios(comentarios.filter((c) => c.id !== comentarioId))
      toast({
        title: "Sucesso",
        description: "Comentário excluído com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir comentário:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o comentário. Tente novamente.",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (isLoading) {
    return <DicaLoading />
  }

  if (error || !dica) {
    return (
      <ErrorMessage
        title="Erro ao carregar dica"
        message={error || "Dica não encontrada"}
        onRetry={() => window.location.reload()}
      />
    )
  }

  return (
    <div className="container py-10">
      <Link href="/dicas" className="flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para todas as dicas
      </Link>

      <Card className="border shadow-sm overflow-hidden">
        {dica.imagem && (
          <div className="relative h-64 w-full overflow-hidden">
            <Image
              src={dica.imagem || `/placeholder.svg?height=300&width=800&text=${encodeURIComponent(dica.titulo)}`}
              alt={dica.titulo}
              fill
              className="object-cover"
            />
          </div>
        )}

        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4 text-primary" />
            <span className="text-xs text-primary font-medium">{dica.categoria?.nome}</span>
          </div>
          <CardTitle className="text-2xl md:text-3xl">{dica.titulo}</CardTitle>
          <CardDescription className="text-base">{dica.descricao}</CardDescription>

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
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="prose max-w-none dark:prose-invert">
            {dica.conteudo.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant={curtidaStatus.curtido ? "default" : "outline"}
                size="sm"
                onClick={handleCurtida}
                className={curtidaStatus.curtido ? "bg-primary text-primary-foreground" : ""}
              >
                <ThumbsUp className={`h-4 w-4 mr-2 ${curtidaStatus.curtido ? "fill-current" : ""}`} />
                {curtidaStatus.total_curtidas} {curtidaStatus.total_curtidas === 1 ? "Curtida" : "Curtidas"}
              </Button>

              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                {comentarios.length} {comentarios.length === 1 ? "Comentário" : "Comentários"}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dicas?categoria=${dica.categoria?.slug}`}>Mais sobre {dica.categoria?.nome}</Link>
              </Button>
            </div>
          </div>

          <div className="pt-6 border-t">
            <h3 className="text-lg font-medium mb-4">Comentários</h3>

            {isAuthenticated ? (
              <div className="mb-6">
                <Textarea
                  placeholder="Escreva seu comentário..."
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  className="mb-2"
                  rows={3}
                />
                <Button onClick={handleComentarioSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Comentar"}
                </Button>
              </div>
            ) : (
              <div className="bg-muted p-4 rounded-md mb-6">
                <p className="text-sm text-muted-foreground">
                  <Link href="/login" className="text-primary hover:underline">
                    Faça login
                  </Link>{" "}
                  para deixar um comentário.
                </p>
              </div>
            )}

            {comentariosLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : comentarios.length > 0 ? (
              <div className="space-y-4">
                {comentarios.map((comentario) => (
                  <div key={comentario.id} className="p-4 border rounded-md">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(comentario.user?.name || "Usuário")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{comentario.user?.name || "Usuário"}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comentario.created_at).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comentario.conteudo}</p>
                      </div>

                      {(user?.id === comentario.user_id || user?.is_admin) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleExcluirComentario(comentario.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DicaLoading() {
  return (
    <div className="container py-10">
      <div className="mb-6">
        <Skeleton className="h-6 w-32" />
      </div>

      <Card className="border shadow-sm overflow-hidden">
        <Skeleton className="h-64 w-full" />

        <CardHeader>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />

          <div className="flex items-center mt-4 space-x-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>

            <Skeleton className="h-8 w-32" />
          </div>

          <div className="pt-6 border-t">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-24 w-full mb-6" />

            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

