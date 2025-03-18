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

export default function NovaDicaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categorias, setCategorias] = useState<any[]>([])
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "", // Campo adicionado
    conteudo: "",
    categoria_id: "",
    imagem: null as File | null,
    publicado: true,
    destaque: false,
  })

  useEffect(() => {
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

  const handleImageChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, imagem: file }))
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

    try {
      const formDataObj = new FormData()
      formDataObj.append("titulo", formData.titulo)
      formDataObj.append("descricao", formData.descricao) // Campo adicionado
      formDataObj.append("conteudo", formData.conteudo)
      formDataObj.append("categoria_id", formData.categoria_id)
      formDataObj.append("publicado", formData.publicado ? "1" : "0")
      formDataObj.append("destaque", formData.destaque ? "1" : "0")

      if (formData.imagem) {
        formDataObj.append("imagem", formData.imagem)
      }

      await dicasAdminService.createDica(formDataObj)

      toast({
        title: "Sucesso",
        description: "Dica criada com sucesso!",
      })

      router.push("/admin/dicas")
    } catch (error) {
      console.error("Erro ao criar dica:", error)
      setError("Ocorreu um erro ao criar a dica. Por favor, tente novamente.")
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar a dica. Verifique os dados e tente novamente.",
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
                <ImageUpload onChange={handleImageChange} />
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

