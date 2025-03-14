"use client"

import type React from "react"

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
import { produtosService } from "@/lib/produtos-service"

// Definindo a interface Produto
interface Produto {
  id: number
  nome: string
  descricao: string
  preco: number
  categoria: string
  imagem: string | null
  estoque: number
  createdAt: string
  updatedAt: string
}

export default function EditarProdutoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Produto>>({
    nome: "",
    descricao: "",
    preco: 0,
    categoria: "",
    imagem: "",
    estoque: 0,
  })

  const categorias = [
    { value: "vestuario", label: "Vestuário" },
    { value: "suplementos", label: "Suplementos" },
    { value: "acessorios", label: "Acessórios" },
    { value: "calcados", label: "Calçados" },
  ]

  useEffect(() => {
    async function loadData() {
      if (params.id === "novo") {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)
      try {
        const produtoData = await produtosService.getProduto(Number.parseInt(params.id))
        setFormData(produtoData)
      } catch (error) {
        console.error("Erro ao carregar produto:", error)
        setError("Não foi possível carregar os dados do produto. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "preco" || name === "estoque" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (value: string) => {
    setFormData((prev) => ({ ...prev, imagem: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      // Criar um FormData para enviar os dados, incluindo a imagem
      const formDataToSend = new FormData()

      // Adicionar todos os campos do formulário ao FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "imagem" || (key === "imagem" && typeof value === "string" && !value.startsWith("data:"))) {
          formDataToSend.append(key, String(value))
        }
      })

      // Se for uma imagem base64 (upload), converter para arquivo
      if (formData.imagem && formData.imagem.startsWith("data:")) {
        const blob = await fetch(formData.imagem).then((r) => r.blob())
        formDataToSend.append("imagem", blob, "produto.jpg")
      }

      if (params.id === "novo") {
        await produtosService.createProduto(formDataToSend)
        toast({
          title: "Produto criado com sucesso!",
          description: "O novo produto foi adicionado ao sistema.",
        })
      } else {
        await produtosService.updateProduto(Number.parseInt(params.id), formDataToSend)
        toast({
          title: "Produto atualizado com sucesso!",
          description: "Os dados do produto foram atualizados.",
        })
      }

      // Redirecionar para a lista de produtos
      router.push("/admin/produtos")
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      setError("Não foi possível salvar os dados do produto. Tente novamente.")
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados do produto. Tente novamente.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          {params.id === "novo" ? "Novo Produto" : "Editar Produto"}
        </h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          {params.id === "novo" ? "Novo Produto" : "Editar Produto"}
        </h1>
        <ErrorMessage title="Erro ao carregar produto" message={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">
        {params.id === "novo" ? "Novo Produto" : "Editar Produto"}
      </h1>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>{params.id === "novo" ? "Adicionar Produto" : "Editar Produto"}</CardTitle>
          <CardDescription>
            {params.id === "novo"
              ? "Preencha os dados para cadastrar um novo produto."
              : "Atualize os dados do produto conforme necessário."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Produto</Label>
                  <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select value={formData.categoria} onValueChange={(value) => handleSelectChange("categoria", value)}>
                    <SelectTrigger id="categoria">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.value} value={categoria.value}>
                          {categoria.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preco">Preço (R$)</Label>
                    <Input
                      id="preco"
                      name="preco"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.preco}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estoque">Estoque</Label>
                    <Input
                      id="estoque"
                      name="estoque"
                      type="number"
                      min="0"
                      value={formData.estoque}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    rows={5}
                    value={formData.descricao}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <ImageUpload value={formData.imagem || ""} onChange={handleImageChange} label="Imagem do Produto" />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Faça upload de uma imagem para o produto ou informe o caminho de uma imagem existente (ex:
                  /images/produtos/produto.jpg). Recomendamos imagens quadradas com pelo menos 500x500 pixels.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/produtos")}>
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

