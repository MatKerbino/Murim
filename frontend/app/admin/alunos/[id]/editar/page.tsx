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
import { alunosService } from "@/lib/alunos-service"
import { planosService } from "@/lib/planos-service"
import { ErrorMessage } from "@/components/ui/error-message"

// Definindo a interface Plano
interface Plano {
  id: number
  nome: string
  descricao: string
  valor: number
  duracao: number
  beneficios: string[]
  createdAt: string
  updatedAt: string
}

export default function EditarAlunoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [planos, setPlanos] = useState<Plano[]>([])
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    matricula: "",
    planoId: 0,
  })

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      setError(null)
      try {
        // Carregar planos
        const planosData = await planosService.getPlanos()
        setPlanos(planosData)

        // Se não for um novo aluno, carregar dados do aluno
        if (params.id !== "novo") {
          const alunoData = await alunosService.getAluno(Number.parseInt(params.id))
          setFormData({
            nome: alunoData.nome,
            email: alunoData.email,
            telefone: alunoData.telefone,
            dataNascimento: alunoData.dataNascimento.split("T")[0], // Formatar data para input
            matricula: alunoData.matricula,
            planoId: alunoData.planoId,
          })
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setError("Não foi possível carregar os dados necessários. Tente novamente mais tarde.")
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
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      if (params.id === "novo") {
        // Criar novo aluno
        await alunosService.createAluno({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          dataNascimento: formData.dataNascimento,
          matricula: formData.matricula,
          planoId: formData.planoId,
          data_inicio: new Date().toISOString().split("T")[0],
          status: "ativo",
          observacoes: null,
        })

        toast({
          title: "Aluno criado com sucesso!",
          description: "O novo aluno foi adicionado ao sistema.",
        })
      } else {
        // Atualizar aluno existente
        await alunosService.updateAluno(Number.parseInt(params.id), formData)

        toast({
          title: "Aluno atualizado com sucesso!",
          description: "Os dados do aluno foram atualizados.",
        })
      }

      // Redirecionar para a lista de alunos
      router.push("/admin/alunos")
    } catch (error) {
      console.error("Erro ao salvar aluno:", error)
      setError("Não foi possível salvar os dados do aluno. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-murim-blue"></div>
      </div>
    )
  }

  if (error) {
    return <ErrorMessage title="Erro" message={error} onRetry={() => window.location.reload()} />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight gradient-text">
        {params.id === "novo" ? "Novo Aluno" : "Editar Aluno"}
      </h1>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{params.id === "novo" ? "Adicionar Aluno" : "Editar Aluno"}</CardTitle>
          <CardDescription>
            {params.id === "novo"
              ? "Preencha os dados para cadastrar um novo aluno."
              : "Atualize os dados do aluno conforme necessário."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  name="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula</Label>
                <Input id="matricula" name="matricula" value={formData.matricula} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="planoId">Plano</Label>
                <Select
                  value={formData.planoId?.toString()}
                  onValueChange={(value) => handleSelectChange("planoId", value)}
                >
                  <SelectTrigger id="planoId">
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {planos.map((plano) => (
                      <SelectItem key={plano.id} value={plano.id.toString()}>
                        {plano.nome} - R$ {plano.valor.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/alunos")}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-murim hover:opacity-90" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

