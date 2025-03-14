"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/ui/image-upload"
import { ErrorMessage } from "@/components/ui/error-message"
import { dicasAdminService, type Dica, type CategoriaDica } from "@/lib/dicas-admin-service"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import React from "react"

export default function EditarDicaPage({ params }: { params: { id: string } }) {
  const id = React.use(params).id
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categorias, setCategorias] = useState<CategoriaDica[]>([])
  const [formData, setFormData] = useState<Partial<Dica>>({
    titulo: "",
    conteudo: "",
    categoria_id: 0,
    imagem: null,
  })

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      setError(null)
      try {
        const categoriasData = await dicasAdminService.getCategorias()
        setCategorias(categoriasData || [])

        if (id !== "nova") {
          const dicaData = await dicasAdminService.getDica(Number.parseInt(id))
          setFormData(dicaData)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setError("Não foi possível carregar os dados necessários. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: Number.parseInt(value),
    }))
  }

  const handleImageChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      imagem: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      // Validar campos obrigatórios
      if (!formData.titulo || !formData.conteudo || !formData.categoria_id) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Preencha todos os campos obrigatórios.",
        })
        setIsSaving(false)
        return
      }

      // Criar um FormData para enviar os dados, incluindo a imagem
      const formDataToSend = new FormData()

      // Adicionar todos os campos do formulário ao FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && key !== "imagem") {
          formDataToSend.append(key, String(value))
        }
      })

      // Se for uma imagem base64 (upload), converter para arquivo
      if (formData.imagem && formData.imagem.startsWith("data:")) {
        const blob = await fetch(formData.imagem).then((r) => r.blob())
        formDataToSend.append("imagem", blob, "dica.jpg")
      } else if (formData.imagem) {
        formDataToSend.append("imagem", formData.imagem)
      }

      if (id === "nova") {
        await dicasAdminService.createDica(formDataToSend)
        toast({
          title: "Dica criada com sucesso!",
          description: "A nova dica foi adicionada ao sistema.",
        })
      } else {
        await dicasAdminService.updateDica(Number.parseInt(id), formDataToSend)
        toast({
          title: "Dica atualizada com sucesso!",
          description: "Os dados da dica foram atualizados.",
        })
      }

      // Redirecionar para a lista de dicas
      router.push("/admin/dicas")
    } catch (error) {
      console.error("Erro ao salvar dica:", error)
      setError("Não foi possível salvar os dados da dica. Tente novamente.")
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados da dica. Tente novamente.",
      })
    } finally {
      setIsSaving(false)
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
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            {id === "nova" ? "Nova Dica" : "Editar Dica"}
          </h1>
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
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            {id === "nova" ? "Nova Dica" : "Editar Dica"}
          </h1>
        </div>
        <ErrorMessage title="Erro ao carregar dados" message={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/dicas">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          {id === "nova" ? "Nova Dica" : "Editar Dica"}
        </h1>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>{id === "nova" ? "Adicionar Dica" : "Editar Dica"}</CardTitle>
          <CardDescription>
            {id === "nova"
              ? "Preencha os dados para cadastrar uma nova dica."
              : "Atualize os dados da dica conforme necessário."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input id="titulo" name="titulo" value={formData.titulo || ""} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria_id">Categoria</Label>
                  <Select
                    value={formData.categoria_id?.toString() || ""}
                    onValueChange={(value) => handleSelectChange("categoria_id", value)}
                  >
                    <SelectTrigger id="categoria_id">
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
                    rows={10}
                    value={formData.conteudo || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <ImageUpload value={formData.imagem || ""} onChange={handleImageChange} label="Imagem da Dica" />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Faça upload de uma imagem para a dica ou informe o caminho de uma imagem existente (ex:
                  /images/dicas/dica.jpg). Recomendamos imagens com proporção 16:9 para melhor visualização.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/dicas")}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

