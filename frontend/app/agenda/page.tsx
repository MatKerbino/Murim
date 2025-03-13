"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { ErrorMessage } from "@/components/ui/error-message"
import type { Personal } from "@/lib/api"
import { personaisService } from "@/lib/personais-service"
import { agendamentosService } from "@/lib/agendamentos-service"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function AgendaPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [horario, setHorario] = useState<string>("")
  const [personal, setPersonal] = useState<string>("")
  const [personais, setPersonais] = useState<Personal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPersonal, setSelectedPersonal] = useState<Personal | null>(null)

  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    async function loadPersonais() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await personaisService.getPersonais()
        setPersonais(data)
      } catch (error) {
        console.error("Erro ao carregar personais:", error)
        setError((error as any).message || "Erro ao carregar personais")
        setPersonais([])
      } finally {
        setIsLoading(false)
      }
    }

    loadPersonais()
  }, [])

  useEffect(() => {
    if (personal) {
      const found = personais.find((p) => p.id.toString() === personal)
      setSelectedPersonal(found || null)
    } else {
      setSelectedPersonal(null)
    }
  }, [personal, personais])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Erro no agendamento",
        description: "Você precisa estar logado para agendar um personal trainer.",
      })
      return
    }

    if (!date || !horario || !personal) {
      toast({
        variant: "destructive",
        title: "Erro no agendamento",
        description: "Por favor, preencha todos os campos.",
      })
      return
    }

    setIsLoading(true)

    try {
      await agendamentosService.createAgendamento({
        aluno_id: user!.id,
        personal_id: Number.parseInt(personal),
        data: date.toISOString().split("T")[0],
        horario: horario,
        status: "pendente",
        observacoes: null,
      })

      toast({
        title: "Agendamento realizado com sucesso!",
        description: `Seu agendamento foi confirmado para ${date.toLocaleDateString("pt-BR")} às ${horario}.`,
        action: <ToastAction altText="OK">OK</ToastAction>,
      })

      // Limpar formulário
      setDate(undefined)
      setHorario("")
      setPersonal("")
    } catch (error) {
      console.error("Erro ao agendar:", error)
      toast({
        variant: "destructive",
        title: "Erro no agendamento",
        description: "Não foi possível realizar o agendamento. Tente novamente mais tarde.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = async () => {
    setError(null)
    setIsLoading(true)
    try {
      const data = await personaisService.getPersonais()
      setPersonais(data)
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao carregar personais:", error)
      setError((error as any).message || "Erro ao carregar personais")
      setPersonais([])
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
          Agende seu Personal Trainer
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Escolha a data, horário e o profissional para seu treinamento personalizado.
        </p>
      </div>

      {error ? (
        <ErrorMessage title="Erro ao carregar personais" message={error} onRetry={handleRetry} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border shadow-sm transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-primary">Selecione a Data</CardTitle>
              <CardDescription>Escolha um dia disponível para seu agendamento</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                disabled={(date) => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  return date < today || date.getDay() === 0 // Desabilita domingos
                }}
              />
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border shadow-sm transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-secondary">Detalhes do Agendamento</CardTitle>
                <CardDescription>Preencha as informações para concluir seu agendamento</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : !isAuthenticated ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Você precisa estar logado para agendar um personal trainer.
                    </p>
                    <Link href="/login">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-md hover:scale-105">
                        Fazer Login
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="horario">Horário</Label>
                      <Select value={horario} onValueChange={setHorario}>
                        <SelectTrigger id="horario" className="transition-all duration-300 hover:border-primary">
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                        <SelectContent>
                          {horarios.map((h) => (
                            <SelectItem
                              key={h}
                              value={h}
                              className="transition-colors duration-300 hover:bg-primary/10"
                            >
                              {h}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="personal">Personal Trainer</Label>
                      <Select value={personal} onValueChange={setPersonal}>
                        <SelectTrigger id="personal" className="transition-all duration-300 hover:border-primary">
                          <SelectValue placeholder="Selecione um personal" />
                        </SelectTrigger>
                        <SelectContent>
                          {personais.map((p) => (
                            <SelectItem
                              key={p.id}
                              value={p.id.toString()}
                              className="transition-colors duration-300 hover:bg-primary/10"
                            >
                              <div className="flex items-center gap-2">
                                {p.foto && (
                                  <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                    <Image
                                      src={p.foto || "/placeholder.svg?height=100&width=100"}
                                      alt={p.nome}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <span>
                                  {p.nome} - {p.especialidade}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-md hover:scale-105"
                      disabled={isLoading}
                    >
                      {isLoading ? "Agendando..." : "Agendar"}
                    </Button>
                  </form>
                )}
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Você pode cancelar seu agendamento com até 24 horas de antecedência.
              </CardFooter>
            </Card>

            {selectedPersonal && (
              <Card className="border shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={selectedPersonal.foto || "/placeholder.svg?height=200&width=400"}
                    alt={selectedPersonal.nome}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-primary">{selectedPersonal.nome}</CardTitle>
                  <CardDescription>Especialidade: {selectedPersonal.especialidade}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <strong>Email:</strong> {selectedPersonal.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Telefone:</strong> {selectedPersonal.telefone}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

