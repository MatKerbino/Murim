"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorMessage } from "@/components/ui/error-message"
import { horariosService } from "@/lib/horarios-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

  useEffect(() => {
    async function loadHorarios() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await horariosService.getHorarios()
        setHorarios(data)
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

  return (
    <div className="w-full">
      <Tabs defaultValue="grade" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grade">Visualização em Grade</TabsTrigger>
          <TabsTrigger value="lista">Visualização em Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="grade" className="mt-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">Grade de Horários</CardTitle>
              <CardDescription>Visualize todas as aulas organizadas por dia e horário</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Horário</TableHead>
                    {horarios.map((dia) => (
                      <TableHead key={dia.id}>{dia.nome}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Período da manhã */}
                  <TableRow>
                    <TableCell colSpan={horarios.length + 1} className="bg-primary/5 font-medium">
                      Período da Manhã
                    </TableCell>
                  </TableRow>
                  {horariosPorPeriodo.manha.map((horario) => (
                    <TableRow key={horario}>
                      <TableCell className="font-medium">{horario}</TableCell>
                      {horarios.map((dia) => {
                        const aula = dia.aulas.find((a) => a.horario_inicio === horario)
                        return (
                          <TableCell key={dia.id} className={aula ? "bg-primary/10" : ""}>
                            {aula ? (
                              <div>
                                <div className="font-medium">{aula.nome}</div>
                                <div className="text-xs text-muted-foreground">{aula.instrutor}</div>
                              </div>
                            ) : null}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}

                  {/* Período da tarde */}
                  <TableRow>
                    <TableCell colSpan={horarios.length + 1} className="bg-secondary/5 font-medium">
                      Período da Tarde
                    </TableCell>
                  </TableRow>
                  {horariosPorPeriodo.tarde.map((horario) => (
                    <TableRow key={horario}>
                      <TableCell className="font-medium">{horario}</TableCell>
                      {horarios.map((dia) => {
                        const aula = dia.aulas.find((a) => a.horario_inicio === horario)
                        return (
                          <TableCell key={dia.id} className={aula ? "bg-secondary/10" : ""}>
                            {aula ? (
                              <div>
                                <div className="font-medium">{aula.nome}</div>
                                <div className="text-xs text-muted-foreground">{aula.instrutor}</div>
                              </div>
                            ) : null}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}

                  {/* Período da noite */}
                  <TableRow>
                    <TableCell colSpan={horarios.length + 1} className="bg-accent/5 font-medium">
                      Período da Noite
                    </TableCell>
                  </TableRow>
                  {horariosPorPeriodo.noite.map((horario) => (
                    <TableRow key={horario}>
                      <TableCell className="font-medium">{horario}</TableCell>
                      {horarios.map((dia) => {
                        const aula = dia.aulas.find((a) => a.horario_inicio === horario)
                        return (
                          <TableCell key={dia.id} className={aula ? "bg-accent/10" : ""}>
                            {aula ? (
                              <div>
                                <div className="font-medium">{aula.nome}</div>
                                <div className="text-xs text-muted-foreground">{aula.instrutor}</div>
                              </div>
                            ) : null}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lista" className="mt-6">
          <div className="space-y-8">
            {horarios.map((dia) => (
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
                        <TableHead>Instrutor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dia.aulas.length > 0 ? (
                        dia.aulas.map((aula) => (
                          <TableRow key={aula.id}>
                            <TableCell className="font-medium">
                              {aula.horario_inicio} - {aula.horario_fim}
                            </TableCell>
                            <TableCell>{aula.nome}</TableCell>
                            <TableCell>{aula.instrutor}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center">
                            Nenhuma aula disponível para este dia.
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

