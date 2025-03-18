"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { Switch } from "@/components/ui/switch"
import { ErrorMessage } from "@/components/ui/error-message"
import { useToast } from "@/hooks/use-toast"
import { dicasAdminService } from "@/lib/dicas-admin-service"
import { authService } from "@/lib/auth-service"

export default function NovaDicaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categorias, setCategorias] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    conteudo: "",
    categoria_id: "",
    imagem: "",
    publicado: true,
    destaque: false,
  })

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser()
        setCurrentUser(user)
      } catch (error) {
        console.error("Erro ao carregar usuário atual:", error)
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar suas informações. Por favor, faça login novamente.",
        })
      }
    }

    const loadCategorias = async () => {
      try {
        const data = await dicasAdminService.getCategorias()
        setCategorias(data)
      } catch (error) {
        console.error("Erro ao carregar categorias:", error)
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar as categorias. Tente novamente mais tarde.",
        })
      }
    }

    loadCurrentUser()
    loadCategorias()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleImageChange = (path: string) => {
    setFormData((prev) => ({ ...prev, imagem: path }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!formData.titulo || !formData.conteudo || !formData.categoria_id || !formData.descricao) {
      setError("Por favor, preencha todos os campos obrigatórios.")
      setIsSubmitting(false)
      return
    }

    if (!currentUser) {
      setError("É necessário estar logado para criar uma dica.")
      setIsSubmitting(false)
      return
    }

    try {
      const dicaData = {
        autor_id: currentUser.id,
        autor: currentUser.name || "Usuário"
      }

      const formDataInstance = new FormData()
      formDataInstance.append("titulo", formData.titulo)
      formDataInstance.append("descricao", formData.descricao)
      formDataInstance.append("conteudo", formData.conteudo)
      formDataInstance.append("categoria_id", formData.categoria_id)
      formDataInstance.append("publicado", formData.publicado ? "true" : "false")
      formDataInstance.append("destaque", formData.destaque ? "true" : "false")
      formDataInstance.append("autor_id", String(dicaData.autor_id))
      formDataInstance.append("autor", dicaData.autor)
      if (formData.imagem) {
        formDataInstance.append("imagem", formData.imagem)
      }

      await dicasAdminService.createDica(formDataInstance)

      toast({
        title: "Sucesso",
        description: "Dica criada com sucesso!",
      })

      router.push("/admin/dicas")
    } catch (error: any) {
      console.error("Erro ao criar dica:", error)
      
      let errorMessage = "Ocorreu um erro ao criar a dica. Por favor, tente novamente."
      
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors
        errorMessage = "Erros de validação: "
        
        Object.entries(validationErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            errorMessage += `${field}: ${messages[0]}. `
          }
        })
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
      
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Nova Dica</h1>
        <Button variant="outline" onClick={() => router.push("/admin/dicas")}>
          Cancelar
        </Button>
      </div>

      {error && <ErrorMessage title="Erro" message={error} onRetry={() => setError(null)} />}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações da Dica</CardTitle>
            <CardDescription>Preencha as informações para criar uma nova dica</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Digite o título da dica"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Uma breve descrição da dica"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria_id">Categoria</Label>
                <Select
                  value={formData.categoria_id}
                  onValueChange={(value) => handleSelectChange("categoria_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id.toString()}>
                        {categoria.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conteudo">Conteúdo</Label>
                <Textarea
                  id="conteudo"
                  name="conteudo"
                  value={formData.conteudo}
                  onChange={handleInputChange}
                  placeholder="Conteúdo da dica"
                  className="min-h-[200px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagem">Imagem de Capa</Label>
                <ImageUpload 
                  value={formData.imagem} 
                  onChange={handleImageChange} 
                />
                <p className="text-xs text-muted-foreground">
                  Selecione uma imagem da biblioteca ou digite o caminho para uma imagem em /public/images/dicas/
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="publicado"
                  checked={formData.publicado}
                  onCheckedChange={(checked) => handleSwitchChange("publicado", checked)}
                />
                <Label htmlFor="publicado">Publicar dica</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="destaque"
                  checked={formData.destaque}
                  onCheckedChange={(checked) => handleSwitchChange("destaque", checked)}
                />
                <Label htmlFor="destaque">Destacar na página inicial</Label>
              </div>

              {currentUser && (
                <div className="text-sm text-muted-foreground">
                  <p>Autor: {currentUser.name}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => router.push("/admin/dicas")}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-murim hover:opacity-90" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Dica"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

