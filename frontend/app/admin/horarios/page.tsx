"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { ErrorMessage } from "@/components/ui/error-message"
import { horariosAdminService } from "@/lib/horarios-admin-service"
import { personaisService } from "@/lib/personais-service"
import { Search, Trash2 } from "lucide-react"
import type { Horario, DiaSemana } from "@/lib/horarios-admin-service"

export default function AdminHorariosPage() {
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [diasSemana, setDiasSemana] = useState<DiaSemana[]>([])
  const [instrutores, setInstrutores] = useState<{ id: number; nome: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Novo horário
  const [novoHorario, setNovoHorario] = useState({
    dia_semana_id: "",
    hora_inicio: "",
    hora_fim: "",
    tipo_aula: "",
    nome: "",
    instrutor: "",
  })
  const [isAdding, setIsAdding] = useState(false)

  // Tipos de aula disponíveis
  const tiposAula = [
    { value: "musculacao", label: "Musculação" },
    { value: "cardio", label: "Cardio" },
    { value: "yoga", label: "Yoga" },
    { value: "pilates", label: "Pilates" },
    { value: "crossfit", label: "CrossFit" },
    { value: "muay_thai", label: "Muay Thai" },
    { value: "jiu_jitsu", label: "Jiu-Jitsu" },
    { value: "karate", label: "Karatê" },
    { value: "natacao", label: "Natação" },
    { value: "danca", label: "Dança" },
  ]

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Buscar dados em paralelo
      const [horariosData, diasSemanaData, personaisData] = await Promise.all([
        horariosAdminService.getHorarios(),
        horariosAdminService.getDiasSemana(),
        personaisService.getPersonais(),
      ])

      // Verificar se os dados foram retornados corretamente
      if (!diasSemanaData || diasSemanaData.length === 0) {
        console.error("Não foram encontrados dias da semana")
        // Dias da semana padrão caso a API falhe
        setDiasSemana([
          { id: 1, nome: "Segunda-feira", created_at: "", updated_at: "" },
          { id: 2, nome: "Terça-feira", created_at: "", updated_at: "" },
          { id: 3, nome: "Quarta-feira", created_at: "", updated_at: "" },
          { id: 4, nome: "Quinta-feira", created_at: "", updated_at: "" },
          { id: 5, nome: "Sexta-feira", created_at: "", updated_at: "" },
          { id: 6, nome: "Sábado", created_at: "", updated_at: "" },
          { id: 7, nome: "Domingo", created_at: "", updated_at: "" },
        ])
      } else {
        setDiasSemana(diasSemanaData)
      }

      // Processar instrutores
      if (personaisData && personaisData.length > 0) {
        setInstrutores(personaisData.map((p) => ({ id: p.id, nome: p.nome })))
      } else {
        console.error("Não foram encontrados instrutores")
        setInstrutores([])
      }

      setHorarios(horariosData || [])
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      setError("Não foi possível carregar os horários. Tente novamente mais tarde.")

      // Dias da semana padrão em caso de erro
      setDiasSemana([
        { id: 1, nome: "Segunda-feira", created_at: "", updated_at: "" },
        { id: 2, nome: "Terça-feira", created_at: "", updated_at: "" },
        { id: 3, nome: "Quarta-feira", created_at: "", updated_at: "" },
        { id: 4, nome: "Quinta-feira", created_at: "", updated_at: "" },
        { id: 5, nome: "Sexta-feira", created_at: "", updated_at: "" },
        { id: 6, nome: "Sábado", created_at: "", updated_at: "" },
        { id: 7, nome: "Domingo", created_at: "", updated_at: "" },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAddHorario = async () => {
    if (
      !novoHorario.dia_semana_id ||
      !novoHorario.hora_inicio ||
      !novoHorario.hora_fim ||
      !novoHorario.tipo_aula ||
      !novoHorario.nome ||
      !novoHorario.instrutor
    ) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos para adicionar um novo horário.",
      })
      return
    }

    setIsAdding(true)
    try {
      const horarioAdicionado = await horariosAdminService.createHorario({
        dia_semana_id: Number.parseInt(novoHorario.dia_semana_id),
        hora_inicio: novoHorario.hora_inicio,
        hora_fim: novoHorario.hora_fim,
        tipo_aula: novoHorario.tipo_aula,
        nome: novoHorario.nome,
        instrutor: novoHorario.instrutor,
      })

      // Adicionar o dia da semana ao horário adicionado
      const diaSemana = diasSemana.find((d) => d.id === Number.parseInt(novoHorario.dia_semana_id))
      const horarioComDia = {
        ...horarioAdicionado,
        dia_semana: diaSemana,
      }

      setHorarios([...horarios, horarioComDia])
      setNovoHorario({
        dia_semana_id: "",
        hora_inicio: "",
        hora_fim: "",
        tipo_aula: "",
        nome: "",
        instrutor: "",
      })
      toast({
        title: "Sucesso",
        description: "Horário adicionado com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao adicionar horário:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar o horário. Tente novamente.",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteHorario = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este horário?")) {
      return
    }

    try {
      await horariosAdminService.deleteHorario(id)
      setHorarios(horarios.filter((h) => h.id !== id))
      toast({
        title: "Sucesso",
        description: "Horário excluído com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir horário:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o horário. Tente novamente.",
      })
    }
  }

  // Filtrar horários com base no termo de pesquisa
  const filteredHorarios = horarios.filter(
    (horario) =>
      (horario.dia_semana?.nome?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (horario.hora_inicio?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (horario.hora_fim?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (horario.tipo_aula?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (horario.nome?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (horario.instrutor?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  )

  // Função para obter o nome do tipo de aula
  const getTipoAulaNome = (tipo: string) => {
    const tipoAula = tiposAula.find((t) => t.value === tipo)
    return tipoAula ? tipoAula.label : tipo
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Gerenciar Horários</h1>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Horário</CardTitle>
          <CardDescription>Defina os horários disponíveis para agendamentos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Dia da Semana</label>
              <Select
                value={novoHorario.dia_semana_id}
                onValueChange={(value) => setNovoHorario({ ...novoHorario, dia_semana_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent>
                  {diasSemana.map((dia) => (
                    <SelectItem key={dia.id} value={dia.id.toString()}>
                      {dia.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hora Início</label>
              <Input
                type="time"
                value={novoHorario.hora_inicio}
                onChange={(e) => setNovoHorario({ ...novoHorario, hora_inicio: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hora Fim</label>
              <Input
                type="time"
                value={novoHorario.hora_fim}
                onChange={(e) => setNovoHorario({ ...novoHorario, hora_fim: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Aula</label>
              <Select
                value={novoHorario.tipo_aula}
                onValueChange={(value) => setNovoHorario({ ...novoHorario, tipo_aula: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposAula.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nome da Aula</label>
              <Input
                type="text"
                value={novoHorario.nome}
                onChange={(e) => setNovoHorario({ ...novoHorario, nome: e.target.value })}
                placeholder="Ex: Yoga para Iniciantes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instrutor</label>
              <Select
                value={novoHorario.instrutor}
                onValueChange={(value) => setNovoHorario({ ...novoHorario, instrutor: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um instrutor" />
                </SelectTrigger>
                <SelectContent>
                  {instrutores.length > 0 ? (
                    instrutores.map((instrutor) => (
                      <SelectItem key={instrutor.id} value={instrutor.nome}>
                        {instrutor.nome}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Nenhum instrutor disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleAddHorario} disabled={isAdding}>
              {isAdding ? "Adicionando..." : "Adicionar Horário"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Horários Disponíveis</CardTitle>
          <CardDescription>Gerencie os horários disponíveis para agendamentos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar horários..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[400px]" />
                    </div>
                  </div>
                ))}
            </div>
          ) : error ? (
            <ErrorMessage title="Erro ao carregar horários" message={error} onRetry={loadData} />
          ) : filteredHorarios.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dia da Semana</TableHead>
                    <TableHead>Hora Início</TableHead>
                    <TableHead>Hora Fim</TableHead>
                    <TableHead>Nome da Aula</TableHead>
                    <TableHead>Tipo de Aula</TableHead>
                    <TableHead>Instrutor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHorarios.map((horario) => (
                    <TableRow key={horario.id}>
                      <TableCell>{horario.dia_semana?.nome || "Dia não especificado"}</TableCell>
                      <TableCell>{horario.hora_inicio}</TableCell>
                      <TableCell>{horario.hora_fim}</TableCell>
                      <TableCell>{horario.nome}</TableCell>
                      <TableCell>{getTipoAulaNome(horario.tipo_aula || "")}</TableCell>
                      <TableCell>{horario.instrutor}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteHorario(horario.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Nenhum horário encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

