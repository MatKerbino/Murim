"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorMessage } from "@/components/ui/error-message"
import { horariosService } from "@/lib/horarios-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"

export default function HorariosPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">Horários de Aulas</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Confira nossa programação semanal de aulas e escolha as que melhor se encaixam na sua rotina.
        </p>
      </div>

      <HorariosContent />
    </div>
  )
}

function HorariosContent() {
  const [horarios, setHorarios] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDay, setSelectedDay] = useState("todos")
  const [selectedPeriod, setSelectedPeriod] = useState("todos")

  useEffect(() => {
    async function loadHorarios() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await horariosService.getHorarios()
        setHorarios(data)

        // Se temos dados, definir o primeiro dia como padrão
        if (data && data.length > 0) {
          setSelectedDay(data[0].id.toString())
        }
      } catch (error) {
        console.error("Erro ao carregar horários:", error)
        setError((error as Error).message || "Não foi possível carregar os horários. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    loadHorarios()
  }, [])

  if (isLoading) {
    return <HorariosLoading />
  }

  if (error) {
    return <ErrorMessage title="Erro ao carregar horários" message={error} onRetry={() => window.location.reload()} />
  }

  // Agrupar aulas por horário para exibição em formato de grade
  const horariosPorPeriodo = {
    manha: ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"],
    tarde: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    noite: ["18:00", "19:00", "20:00", "21:00"],
  }

  // Filtrar horários por período
  const getHorariosFiltrados = (horarios) => {
    if (selectedPeriod === "todos") return horarios

    const periodoSelecionado = horariosPorPeriodo[selectedPeriod] || []

    return horarios.map((dia) => ({
      ...dia,
      aulas: dia.aulas.filter((aula) => periodoSelecionado.includes(aula.horario_inicio)),
    }))
  }

  // Obter o dia selecionado
  const getDiaSelecionado = () => {
    if (selectedDay === "todos") return horarios
    return horarios.filter((dia) => dia.id.toString() === selectedDay)
  }

  // Obter cor de fundo baseada no tipo de aula
  const getAulaBackgroundColor = (tipoAula) => {
    const tipoMap = {
      musculacao: "bg-blue-50 border-blue-200",
      cardio: "bg-red-50 border-red-200",
      yoga: "bg-green-50 border-green-200",
      pilates: "bg-purple-50 border-purple-200",
      crossfit: "bg-orange-50 border-orange-200",
      muay_thai: "bg-yellow-50 border-yellow-200",
      jiu_jitsu: "bg-indigo-50 border-indigo-200",
      karate: "bg-pink-50 border-pink-200",
      natacao: "bg-cyan-50 border-cyan-200",
      danca: "bg-amber-50 border-amber-200",
    }

    return tipoMap[tipoAula] || "bg-gray-50 border-gray-200"
  }

  // Obter cor de texto baseada no tipo de aula
  const getAulaTextColor = (tipoAula) => {
    const tipoMap = {
      musculacao: "text-blue-700",
      cardio: "text-red-700",
      yoga: "text-green-700",
      pilates: "text-purple-700",
      crossfit: "text-orange-700",
      muay_thai: "text-yellow-700",
      jiu_jitsu: "text-indigo-700",
      karate: "text-pink-700",
      natacao: "text-cyan-700",
      danca: "text-amber-700",
    }

    return tipoMap[tipoAula] || "text-gray-700"
  }

  // Obter nome formatado do tipo de aula
  const getTipoAulaNome = (tipoAula) => {
    const tipoMap = {
      musculacao: "Musculação",
      cardio: "Cardio",
      yoga: "Yoga",
      pilates: "Pilates",
      crossfit: "CrossFit",
      muay_thai: "Muay Thai",
      jiu_jitsu: "Jiu-Jitsu",
      karate: "Karatê",
      natacao: "Natação",
      danca: "Dança",
    }

    return tipoMap[tipoAula] || tipoAula
  }

  return (
    <div className="w-full">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-primary">Filtros</CardTitle>
          <CardDescription>Selecione o dia e período para visualizar os horários</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Dia da Semana</label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os dias</SelectItem>
                  {horarios.map((dia) => (
                    <SelectItem key={dia.id} value={dia.id.toString()}>
                      {dia.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Período</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os períodos</SelectItem>
                  <SelectItem value="manha">Manhã (06:00 - 12:00)</SelectItem>
                  <SelectItem value="tarde">Tarde (12:00 - 18:00)</SelectItem>
                  <SelectItem value="noite">Noite (18:00 - 22:00)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="dias" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dias">Por Dia</TabsTrigger>
          <TabsTrigger value="lista">Visualização em Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="dias" className="mt-6">
          <div className="space-y-6">
            {selectedDay === "todos"
              ? // Mostrar todos os dias
                getDiaSelecionado().map((dia) => (
                  <Card key={dia.id} className="border shadow-sm">
                    <CardHeader className="bg-primary/5">
                      <CardTitle className="text-primary flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {dia.nome}
                      </CardTitle>
                      <CardDescription>Programação de aulas para {dia.nome.toLowerCase()}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {getHorariosFiltrados([dia])[0].aulas.length > 0 ? (
                        <div className="space-y-4">
                          {/* Período da manhã */}
                          {selectedPeriod === "todos" || selectedPeriod === "manha" ? (
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                                <Clock className="h-4 w-4 mr-1" /> Período da Manhã
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {getHorariosFiltrados([dia])[0]
                                  .aulas.filter((aula) => horariosPorPeriodo.manha.includes(aula.horario_inicio))
                                  .map((aula, idx) => (
                                    <div
                                      key={idx}
                                      className={`p-3 rounded-md border ${getAulaBackgroundColor(aula.tipo_aula)}`}
                                    >
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h4 className={`font-medium ${getAulaTextColor(aula.tipo_aula)}`}>
                                            {aula.nome}
                                          </h4>
                                          <p className="text-xs text-muted-foreground">{aula.instrutor}</p>
                                        </div>
                                        <Badge variant="outline" className={getAulaTextColor(aula.tipo_aula)}>
                                          {aula.horario_inicio} - {aula.horario_fim}
                                        </Badge>
                                      </div>
                                      <div className="mt-2">
                                        <Badge variant="secondary" className="text-xs">
                                          {getTipoAulaNome(aula.tipo_aula)}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ) : null}

                          {/* Período da tarde */}
                          {selectedPeriod === "todos" || selectedPeriod === "tarde" ? (
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                                <Clock className="h-4 w-4 mr-1" /> Período da Tarde
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {getHorariosFiltrados([dia])[0]
                                  .aulas.filter((aula) => horariosPorPeriodo.tarde.includes(aula.horario_inicio))
                                  .map((aula, idx) => (
                                    <div
                                      key={idx}
                                      className={`p-3 rounded-md border ${getAulaBackgroundColor(aula.tipo_aula)}`}
                                    >
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h4 className={`font-medium ${getAulaTextColor(aula.tipo_aula)}`}>
                                            {aula.nome}
                                          </h4>
                                          <p className="text-xs text-muted-foreground">{aula.instrutor}</p>
                                        </div>
                                        <Badge variant="outline" className={getAulaTextColor(aula.tipo_aula)}>
                                          {aula.horario_inicio} - {aula.horario_fim}
                                        </Badge>
                                      </div>
                                      <div className="mt-2">
                                        <Badge variant="secondary" className="text-xs">
                                          {getTipoAulaNome(aula.tipo_aula)}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ) : null}

                          {/* Período da noite */}
                          {selectedPeriod === "todos" || selectedPeriod === "noite" ? (
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                                <Clock className="h-4 w-4 mr-1" /> Período da Noite
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {getHorariosFiltrados([dia])[0]
                                  .aulas.filter((aula) => horariosPorPeriodo.noite.includes(aula.horario_inicio))
                                  .map((aula, idx) => (
                                    <div
                                      key={idx}
                                      className={`p-3 rounded-md border ${getAulaBackgroundColor(aula.tipo_aula)}`}
                                    >
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h4 className={`font-medium ${getAulaTextColor(aula.tipo_aula)}`}>
                                            {aula.nome}
                                          </h4>
                                          <p className="text-xs text-muted-foreground">{aula.instrutor}</p>
                                        </div>
                                        <Badge variant="outline" className={getAulaTextColor(aula.tipo_aula)}>
                                          {aula.horario_inicio} - {aula.horario_fim}
                                        </Badge>
                                      </div>
                                      <div className="mt-2">
                                        <Badge variant="secondary" className="text-xs">
                                          {getTipoAulaNome(aula.tipo_aula)}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          Nenhuma aula disponível para este dia e período.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              : // Mostrar apenas o dia selecionado
                getDiaSelecionado().map((dia) => (
                  <Card key={dia.id} className="border shadow-sm">
                    <CardHeader className="bg-primary/5">
                      <CardTitle className="text-primary flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {dia.nome}
                      </CardTitle>
                      <CardDescription>Programação de aulas para {dia.nome.toLowerCase()}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {getHorariosFiltrados([dia])[0].aulas.length > 0 ? (
                        <div className="space-y-4">
                          {/* Período da manhã */}
                          {selectedPeriod === "todos" || selectedPeriod === "manha" ? (
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                                <Clock className="h-4 w-4 mr-1" /> Período da Manhã
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {getHorariosFiltrados([dia])[0]
                                  .aulas.filter((aula) => horariosPorPeriodo.manha.includes(aula.horario_inicio))
                                  .map((aula, idx) => (
                                    <div
                                      key={idx}
                                      className={`p-3 rounded-md border ${getAulaBackgroundColor(aula.tipo_aula)}`}
                                    >
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h4 className={`font-medium ${getAulaTextColor(aula.tipo_aula)}`}>
                                            {aula.nome}
                                          </h4>
                                          <p className="text-xs text-muted-foreground">{aula.instrutor}</p>
                                        </div>
                                        <Badge variant="outline" className={getAulaTextColor(aula.tipo_aula)}>
                                          {aula.horario_inicio} - {aula.horario_fim}
                                        </Badge>
                                      </div>
                                      <div className="mt-2">
                                        <Badge variant="secondary" className="text-xs">
                                          {getTipoAulaNome(aula.tipo_aula)}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ) : null}

                          {/* Período da tarde */}
                          {selectedPeriod === "todos" || selectedPeriod === "tarde" ? (
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                                <Clock className="h-4 w-4 mr-1" /> Período da Tarde
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {getHorariosFiltrados([dia])[0]
                                  .aulas.filter((aula) => horariosPorPeriodo.tarde.includes(aula.horario_inicio))
                                  .map((aula, idx) => (
                                    <div
                                      key={idx}
                                      className={`p-3 rounded-md border ${getAulaBackgroundColor(aula.tipo_aula)}`}
                                    >
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h4 className={`font-medium ${getAulaTextColor(aula.tipo_aula)}`}>
                                            {aula.nome}
                                          </h4>
                                          <p className="text-xs text-muted-foreground">{aula.instrutor}</p>
                                        </div>
                                        <Badge variant="outline" className={getAulaTextColor(aula.tipo_aula)}>
                                          {aula.horario_inicio} - {aula.horario_fim}
                                        </Badge>
                                      </div>
                                      <div className="mt-2">
                                        <Badge variant="secondary" className="text-xs">
                                          {getTipoAulaNome(aula.tipo_aula)}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ) : null}

                          {/* Período da noite */}
                          {selectedPeriod === "todos" || selectedPeriod === "noite" ? (
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                                <Clock className="h-4 w-4 mr-1" /> Período da Noite
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {getHorariosFiltrados([dia])[0]
                                  .aulas.filter((aula) => horariosPorPeriodo.noite.includes(aula.horario_inicio))
                                  .map((aula, idx) => (
                                    <div
                                      key={idx}
                                      className={`p-3 rounded-md border ${getAulaBackgroundColor(aula.tipo_aula)}`}
                                    >
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h4 className={`font-medium ${getAulaTextColor(aula.tipo_aula)}`}>
                                            {aula.nome}
                                          </h4>
                                          <p className="text-xs text-muted-foreground">{aula.instrutor}</p>
                                        </div>
                                        <Badge variant="outline" className={getAulaTextColor(aula.tipo_aula)}>
                                          {aula.horario_inicio} - {aula.horario_fim}
                                        </Badge>
                                      </div>
                                      <div className="mt-2">
                                        <Badge variant="secondary" className="text-xs">
                                          {getTipoAulaNome(aula.tipo_aula)}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          Nenhuma aula disponível para este dia e período.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
          </div>
        </TabsContent>

        <TabsContent value="lista" className="mt-6">
          <div className="space-y-8">
            {getDiaSelecionado().map((dia) => (
              <Card key={dia.id} className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-primary">{dia.nome}</CardTitle>
                  <CardDescription>Programação de aulas para {dia.nome.toLowerCase()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Horário</TableHead>
                        <TableHead>Aula</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Instrutor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getHorariosFiltrados([dia])[0].aulas.length > 0 ? (
                        getHorariosFiltrados([dia])[0].aulas.map((aula, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">
                              {aula.horario_inicio} - {aula.horario_fim}
                            </TableCell>
                            <TableCell>{aula.nome}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">
                                {getTipoAulaNome(aula.tipo_aula)}
                              </Badge>
                            </TableCell>
                            <TableCell>{aula.instrutor}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">
                            Nenhuma aula disponível para este dia e período.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function HorariosLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-[300px]" />
      <Card className="border shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

