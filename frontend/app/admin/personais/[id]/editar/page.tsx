"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/ui/image-upload"
import { ErrorMessage } from "@/components/ui/error-message"
import { personaisService } from "@/lib/personais-service"

// Definindo a interface Personal
interface Personal {
  id: number
  nome: string
  especialidade: string
  email: string
  telefone: string
  foto: string | null
  createdAt: string
  updatedAt: string
}

export default function EditarPersonalPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Personal>>({
    nome: "",
    especialidade: "",
    email: "",
    telefone: "",
    foto: "",
  })

  const especialidades = [
    "Musculação",
    "Pilates",
    "Yoga",
    "Funcional",
    "Spinning",
    "Crossfit",
    "Natação",
    "Lutas",
    "Dança",
    "Reabilitação",
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
        const personalData = await personaisService.getPersonal(Number.parseInt(params.id))
        setFormData(personalData)
      } catch (error) {
        console.error("Erro ao carregar personal:", error)
        setError("Não foi possível carregar os dados do personal. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (value: string) => {
    setFormData((prev) => ({ ...prev, foto: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      if (params.id === "novo") {
        await personaisService.createPersonal(formData as Personal)
        toast({
          title: "Personal criado com sucesso!",
          description: "O novo personal trainer foi adicionado ao sistema.",
        })
      } else {
        await personaisService.updatePersonal(Number.parseInt(params.id), formData as Personal)
        toast({
          title: "Personal atualizado com sucesso!",
          description: "Os dados do personal trainer foram atualizados.",
        })
      }

      // Redirecionar para a lista de personais
      router.push("/admin/personais")
    } catch (error) {
      console.error("Erro ao salvar personal:", error)
      setError("Não foi possível salvar os dados do personal. Tente novamente.")
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados do personal. Tente novamente.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          {params.id === "novo" ? "Novo Personal" : "Editar Personal"}
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
          {params.id === "novo" ? "Novo Personal" : "Editar Personal"}
        </h1>
        <ErrorMessage title="Erro ao carregar personal" message={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">
        {params.id === "novo" ? "Novo Personal" : "Editar Personal"}
      </h1>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>{params.id === "novo" ? "Adicionar Personal" : "Editar Personal"}</CardTitle>
          <CardDescription>
            {params.id === "novo"
              ? "Preencha os dados para cadastrar um novo personal trainer."
              : "Atualize os dados do personal trainer conforme necessário."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="especialidade">Especialidade</Label>
                  <Select
                    value={formData.especialidade}
                    onValueChange={(value) => handleSelectChange("especialidade", value)}
                  >
                    <SelectTrigger id="especialidade">
                      <SelectValue placeholder="Selecione uma especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {especialidades.map((especialidade) => (
                        <SelectItem key={especialidade} value={especialidade}>
                          {especialidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <ImageUpload value={formData.foto || ""} onChange={handleImageChange} label="Foto do Personal" />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Faça upload de uma foto para o personal trainer. Recomendamos imagens quadradas com pelo menos 500x500
                  pixels.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/personais")}>
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

