"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ErrorMessage } from "@/components/ui/error-message"
import { dicasAdminService, type Dica } from "@/lib/dicas-admin-service"
import { ArrowLeft, Pencil, Trash2, MessageSquare, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function VisualizarDicaPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [dica, setDica] = useState<Dica | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    async function loadDica() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await dicasAdminService.getDica(Number.parseInt(params.id))
        setDica(data)
      } catch (error) {
        console.error("Erro ao carregar dica:", error)
        setError("Não foi possível carregar os dados da dica. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    loadDica()
  }, [params.id])

  const handleDelete = async () => {
    try {
      await dicasAdminService.deleteDica(Number.parseInt(params.id))
      toast({
        title: "Dica excluída com sucesso!",
        description: "A dica foi removida do sistema.",
      })
      router.push("/admin/dicas")
    } catch (error) {
      console.error("Erro ao excluir dica:", error)
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir a dica. Tente novamente.",
      })
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/dicas">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Visualizar Dica</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/dicas">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Visualizar Dica</h1>
        </div>
        <ErrorMessage title="Erro ao carregar dica" message={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  if (!dica) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/dicas">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Visualizar Dica</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Dica não encontrada.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/dicas">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Visualizar Dica</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/dicas/${params.id}/editar`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{dica.titulo}</CardTitle>
              <CardDescription>
                {dica.categoria?.nome && (
                  <Badge variant="outline" className="mt-2">
                    {dica.categoria.nome}
                  </Badge>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{dica.comentarios_count || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{dica.curtidas_count || 0}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {dica.imagem && (
            <div className="relative w-full h-64 md:h-96 rounded-md overflow-hidden">
              <Image src={dica.imagem || "/placeholder.svg"} alt={dica.titulo} fill className="object-cover" />
            </div>
          )}

          <div className="prose max-w-none dark:prose-invert">
            {dica.conteudo.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Autor: {dica.user?.name || "Desconhecido"}</p>
              <p className="text-sm text-muted-foreground">
                Publicado em:{" "}
                {dica.created_at
                  ? format(new Date(dica.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                  : "Data desconhecida"}
              </p>
            </div>
            <div>
              <Link href={`/dicas/${dica.id}`} target="_blank">
                <Button variant="outline" size="sm">
                  Ver no site
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para confirmar exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a dica "{dica.titulo}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

