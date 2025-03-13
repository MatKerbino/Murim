"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { ErrorMessage } from "@/components/ui/error-message"
import { useAuth } from "@/contexts/auth-context"
import { agendamentosService } from "@/lib/agendamentos-service"
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import type { Agendamento } from "@/lib/agendamentos-service"
import type { ApiError } from "@/lib/api"

export default function PerfilPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("agendamentos")
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    current_password: "",
    password: "",
    password_confirmation: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function loadAgendamentos() {
      if (!isAuthenticated) return

      setIsLoading(true)
      setError(null)
      try {
        const data = await agendamentosService.getMeusAgendamentos()
        setAgendamentos(data)
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error)
        setError(
          (error as ApiError).message || "Não foi possível carregar seus agendamentos. Tente novamente mais tarde.",
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadAgendamentos()
  }, [isAuthenticated])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpar erro do campo
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = "Nome é obrigatório"
    }

    if (!formData.email.trim()) {
      errors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido"
    }

    // Validar senha apenas se estiver tentando alterar
    if (formData.password) {
      if (!formData.current_password) {
        errors.current_password = "Senha atual é obrigatória para alterar a senha"
      }

      if (formData.password.length < 8) {
        errors.password = "A nova senha deve ter pelo menos 8 caracteres"
      }

      if (formData.password !== formData.password_confirmation) {
        errors.password_confirmation = "As senhas não coincidem"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Enviar apenas os campos que foram alterados
      const dataToUpdate: Record<string, any> = {}

      if (formData.name !== user?.name) {
        dataToUpdate.name = formData.name
      }

      if (formData.email !== user?.email) {
        dataToUpdate.email = formData.email
      }

      if (formData.password) {
        dataToUpdate.current_password = formData.current_password
        dataToUpdate.password = formData.password
        dataToUpdate.password_confirmation = formData.password_confirmation
      }

      // Atualizar perfil
      // await perfilService.updatePerfil(dataToUpdate)

      toast({
        title: "Perfil atualizado com sucesso",
        description: "Suas informações foram atualizadas.",
      })

      // Limpar campos de senha
      setFormData((prev) => ({
        ...prev,
        current_password: "",
        password: "",
        password_confirmation: "",
      }))
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)

      // Tratar erros específicos
      if ((error as any).errors) {
        setFormErrors((error as any).errors)
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar perfil",
          description: (error as Error).message || "Não foi possível atualizar seu perfil. Tente novamente.",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-yellow-600 border-yellow-600">
            <AlertCircle className="h-3 w-3" />
            Pendente
          </Badge>
        )
      case "confirmado":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3" />
            Confirmado
          </Badge>
        )
      case "cancelado":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-red-600 border-red-600">
            <XCircle className="h-3 w-3" />
            Cancelado
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (authLoading) {
    return (
      <div className="container py-10 flex justify-center items-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">Meu Perfil</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Gerencie suas informações e acompanhe seus agendamentos
        </p>
      </div>

      <Tabs defaultValue="agendamentos" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="agendamentos">Meus Agendamentos</TabsTrigger>
          <TabsTrigger value="perfil">Dados Pessoais</TabsTrigger>
        </TabsList>

        <TabsContent value="agendamentos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Meus Agendamentos</CardTitle>
              <CardDescription>Acompanhe seus agendamentos com personal trainers</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="space-y-2">
                              <Skeleton className="h-5 w-32" />
                              <Skeleton className="h-4 w-48" />
                            </div>
                            <Skeleton className="h-6 w-24" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : error ? (
                <ErrorMessage
                  title="Erro ao carregar agendamentos"
                  message={error}
                  onRetry={() => window.location.reload()}
                />
              ) : agendamentos.length > 0 ? (
                <div className="space-y-4">
                  {agendamentos.map((agendamento) => (
                    <Card key={agendamento.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span className="font-medium">
                                {new Date(agendamento.data).toLocaleDateString("pt-BR")}
                              </span>
                              <Clock className="h-4 w-4 text-primary ml-2" />
                              <span>{agendamento.horario}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Personal: {agendamento.personal?.nome} ({agendamento.personal?.especialidade})
                              </span>
                            </div>
                            {agendamento.observacoes && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Observações: {agendamento.observacoes}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {getStatusBadge(agendamento.status)}

                            {agendamento.status !== "cancelado" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive border-destructive hover:bg-destructive/10"
                              >
                                Cancelar
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Você ainda não possui agendamentos.</p>
                  <Button className="mt-4" asChild>
                    <a href="/agenda">Agendar Personal</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="perfil" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={formErrors.name ? "border-red-500" : ""}
                      />
                      {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={formErrors.email ? "border-red-500" : ""}
                      />
                      {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Alterar Senha</h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current_password">Senha Atual</Label>
                        <Input
                          id="current_password"
                          name="current_password"
                          type="password"
                          value={formData.current_password}
                          onChange={handleChange}
                          className={formErrors.current_password ? "border-red-500" : ""}
                        />
                        {formErrors.current_password && (
                          <p className="text-red-500 text-sm">{formErrors.current_password}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="password">Nova Senha</Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={formErrors.password ? "border-red-500" : ""}
                          />
                          {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password_confirmation">Confirmar Nova Senha</Label>
                          <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className={formErrors.password_confirmation ? "border-red-500" : ""}
                          />
                          {formErrors.password_confirmation && (
                            <p className="text-red-500 text-sm">{formErrors.password_confirmation}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

