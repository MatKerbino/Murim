"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/ui/image-upload"
import { produtosService } from "@/lib/produtos-service"
import { ArrowLeft, Save } from "lucide-react"

export default function NovoProdutoPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria: "",
    estoque: "0",
    imagem: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categorias = [
    { value: "suplementos", label: "Suplementos" },
    { value: "vestuario", label: "Vestuário" },
    { value: "acessorios", label: "Acessórios" },
    { value: "equipamentos", label: "Equipamentos" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpar erro do campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpar erro do campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleImageChange = (value: string) => {
    setFormData((prev) => ({ ...prev, imagem: value }))

    // Limpar erro do campo
    if (errors.imagem) {
      setErrors((prev) => ({ ...prev, imagem: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório"
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = "Descrição é obrigatória"
    }

    if (!formData.preco.trim()) {
      newErrors.preco = "Preço é obrigatório"
    } else if (isNaN(Number.parseFloat(formData.preco))) {
      newErrors.preco = "Preço deve ser um número válido"
    }

    if (!formData.categoria) {
      newErrors.categoria = "Categoria é obrigatória"
    }

    if (!formData.estoque.trim()) {
      newErrors.estoque = "Estoque é obrigatório"
    } else if (isNaN(Number.parseInt(formData.estoque))) {
      newErrors.estoque = "Estoque deve ser um número inteiro"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const produtoData = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: Number.parseFloat(formData.preco),
        categoria: formData.categoria,
        estoque: Number.parseInt(formData.estoque),
        imagem: formData.imagem || null,
      }

      await produtosService.createProduto(produtoData)

      toast({
        title: "Produto criado com sucesso!",
        description: "O produto foi adicionado ao catálogo.",
      })

      router.push("/admin/produtos")
    } catch (error) {
      console.error("Erro ao criar produto:", error)

      if (error.errors) {
        setErrors(error.errors)
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao criar produto",
          description: "Não foi possível criar o produto. Tente novamente mais tarde.",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Novo Produto</h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Produto</CardTitle>
          <CardDescription>Preencha os dados para adicionar um novo produto ao catálogo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">
                    Nome <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className={errors.nome ? "border-red-500" : ""}
                  />
                  {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">
                    Descrição <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    rows={4}
                    value={formData.descricao}
                    onChange={handleChange}
                    className={errors.descricao ? "border-red-500" : ""}
                  />
                  {errors.descricao && <p className="text-red-500 text-sm">{errors.descricao}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preco">
                      Preço (R$) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="preco"
                      name="preco"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.preco}
                      onChange={handleChange}
                      className={errors.preco ? "border-red-500" : ""}
                    />
                    {errors.preco && <p className="text-red-500 text-sm">{errors.preco}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estoque">
                      Estoque <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="estoque"
                      name="estoque"
                      type="number"
                      min="0"
                      value={formData.estoque}
                      onChange={handleChange}
                      className={errors.estoque ? "border-red-500" : ""}
                    />
                    {errors.estoque && <p className="text-red-500 text-sm">{errors.estoque}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">
                    Categoria <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.categoria} onValueChange={(value) => handleSelectChange("categoria", value)}>
                    <SelectTrigger id="categoria" className={errors.categoria ? "border-red-500" : ""}>
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
                  {errors.categoria && <p className="text-red-500 text-sm">{errors.categoria}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Imagem do Produto</Label>
                  <div className="border rounded-md p-4">
                    <ImageUpload
                      value={formData.imagem}
                      onChange={handleImageChange}
                      label="Faça upload da imagem do produto"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Recomendamos imagens quadradas com pelo menos 500x500 pixels.
                    </p>
                  </div>
                  {errors.imagem && <p className="text-red-500 text-sm">{errors.imagem}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                {isSubmitting ? (
                  "Salvando..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Salvar Produto
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

