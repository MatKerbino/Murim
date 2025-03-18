"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { ErrorMessage } from "@/components/ui/error-message"
import { useToast } from "@/hooks/use-toast"
import { personaisService } from "@/lib/personais-service"

export default function NovoPersonalPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nome: "",
    especializacao: "",
    bio: "",
    experiencia: "",
    preco_hora: "",
    foto: "",
    email: "",
    telefone: "",
    instagram: "",
    disponivel: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, foto: url }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formValues = {
        ...formData,
        preco_hora: Number.parseFloat(formData.preco_hora),
        disponivel: formData.disponivel === true,
      }

      await personaisService.createPersonal(formValues)

      toast({
        title: "Sucesso",
        description: "Personal criado com sucesso!",
      })

      router.push("/admin/personais")
    } catch (error) {
      console.error("Erro ao criar personal:", error)
      setError("Ocorreu um erro ao criar o personal. Por favor, tente novamente.")
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o personal. Verifique os dados e tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Novo Personal</h1>
        <Button variant="outline" onClick={() => router.push("/admin/personais")}>
          Cancelar
        </Button>
      </div>

      {error && <ErrorMessage title="Erro" message={error} onRetry={() => setError(null)} />}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Personal</CardTitle>
            <CardDescription>Preencha os dados do novo personal trainer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <ImageUpload value={formData.foto} onChange={handleImageUpload} placeholder="Adicionar foto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="especializacao">Especialização</Label>
                  <Input
                    id="especializacao"
                    name="especializacao"
                    value={formData.especializacao}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preco_hora">Preço por hora (R$)</Label>
                  <Input
                    id="preco_hora"
                    name="preco_hora"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.preco_hora}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram (opcional)</Label>
                  <Input id="instagram" name="instagram" value={formData.instagram} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disponivel">Disponibilidade</Label>
                  <Select
                    value={formData.disponivel ? "true" : "false"}
                    onValueChange={(value) => handleSelectChange("disponivel", value === "true")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a disponibilidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Disponível</SelectItem>
                      <SelectItem value="false">Indisponível</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experiencia">Anos de experiência</Label>
                  <Input
                    id="experiencia"
                    name="experiencia"
                    value={formData.experiencia}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={5} required />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => router.push("/admin/personais")}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-murim hover:opacity-90" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Personal"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

