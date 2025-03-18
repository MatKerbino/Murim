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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dumbbell } from "lucide-react"

export default function AgendaPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [horario, setHorario] = useState<string>("")
  const [personal, setPersonal] = useState<string>("")
  const [personais, setPersonais] = useState<Personal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPersonal, setSelectedPersonal] = useState<Personal | null>(null)
  const [activeTab, setActiveTab] = useState("todos")

  const horarios = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
  ]

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

  const handleSelectPersonal = (id: string) => {
    setPersonal(id)
    const found = personais.find((p) => p.id.toString() === id)
    setSelectedPersonal(found || null)

    // Rolar para a seção de agendamento
    document.getElementById("agendamento-section")?.scrollIntoView({ behavior: "smooth" })
  }

  // Filtrar personais por especialidade
  const getFilteredPersonais = () => {
    if (activeTab === "todos") return personais
    return personais.filter((p) => p.especialidade.toLowerCase().includes(activeTab.toLowerCase()))
  }

  // Obter especialidades únicas para as tabs
  const getUniqueEspecialidades = () => {
    const especialidades = personais.map((p) => p.especialidade.toLowerCase())
    return [...new Set(especialidades)]
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
        <>
          {/* Seção de Personal Trainers */}
          <div className="mb-12">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-primary">Nossos Personal Trainers</CardTitle>
                <CardDescription>
                  Conheça nossa equipe de profissionais qualificados e escolha o que melhor atende suas necessidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 h-64 rounded-lg mb-3"></div>
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab} className="mb-6">
                      <TabsList className="w-full flex flex-wrap justify-start overflow-x-auto">
                        <TabsTrigger value="todos">Todos</TabsTrigger>
                        {getUniqueEspecialidades().map((esp) => (
                          <TabsTrigger key={esp} value={esp}>
                            {esp.charAt(0).toUpperCase() + esp.slice(1)}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getFilteredPersonais().map((trainer) => (
                        <Card
                          key={trainer.id}
                          className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                          <div className="relative h-64 w-full">
                            <Image
                              src={trainer.foto || "/placeholder.svg?height=300&width=400"}
                              alt={trainer.nome}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                              <h3 className="text-white font-bold text-xl">{trainer.nome}</h3>
                              <Badge className="bg-primary/80 text-white">{trainer.especialidade}</Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Dumbbell className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">
                                  Especialidade: {trainer.especialidade}
                                </span>
                              </div>
                              {trainer.biografia && (
                                <p className="text-sm text-muted-foreground line-clamp-2">{trainer.biografia}</p>
                              )}
                              <div className="flex justify-between items-center pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSelectPersonal(trainer.id.toString())}
                                  className="w-full"
                                >
                                  Agendar com este Personal
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Seção de Agendamento */}
          <div id="agendamento-section" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border shadow-sm transition-all duration-300 hover:shadow-lg h-full dark:border-border dark:bg-background">
              <CardHeader>
                <CardTitle className="text-primary">Selecione a Data</CardTitle>
                <CardDescription>Escolha um dia disponível para seu agendamento</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-full pb-8">
                <div className="w-[350px] h-[350px] mx-auto">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border w-full"
                    classNames={{
                      root: "w-full",
                      table: "w-full",
                      head_cell: "w-full text-muted-foreground",
                      cell: "w-full h-9 text-center p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-primary/10 rounded-md transition-colors",
                      day_selected:
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent/50 text-accent-foreground",
                      nav_button: "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100",
                    }}
                    disabled={(date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date < today || date.getDay() === 0 // Desabilita domingos
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="border shadow-sm transition-all duration-300 hover:shadow-lg dark:border-border dark:bg-background">
                <CardHeader>
                  <CardTitle className="text-secondary">Detalhes do Agendamento</CardTitle>
                  <CardDescription>Preencha as informações para concluir seu agendamento</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

                      {isAuthenticated ? (
                        <Button
                          type="submit"
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-md hover:scale-105"
                          disabled={isLoading}
                        >
                          {isLoading ? "Agendando..." : "Agendar"}
                        </Button>
                      ) : (
                        <div className="text-center p-4 bg-muted rounded-md">
                          <p className="text-muted-foreground mb-2">Faça login para agendar</p>
                          <Link href="/login">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-md hover:scale-105">
                              Fazer Login
                            </Button>
                          </Link>
                        </div>
                      )}
                    </form>
                  )}
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  Você pode cancelar seu agendamento com até 24 horas de antecedência.
                </CardFooter>
              </Card>

              {selectedPersonal && (
                <Card className="border shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg dark:border-border dark:bg-background">
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
                      {selectedPersonal.biografia && (
                        <p className="text-sm text-muted-foreground mt-2">{selectedPersonal.biografia}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

