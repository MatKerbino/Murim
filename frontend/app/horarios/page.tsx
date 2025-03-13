import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorMessage } from "@/components/ui/error-message"
import { horariosService } from "@/lib/horarios-service"

async function HorariosContent() {
  try {
    const horarios = await horariosService.getHorarios()

    return (
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
    )
  } catch (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar horários"
        message={(error as Error).message || "Não foi possível carregar os horários. Tente novamente mais tarde."}
      />
    )
  }
}

function HorariosLoading() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function HorariosPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">Horários de Aulas</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Confira nossa programação semanal de aulas e escolha as que melhor se encaixam na sua rotina.
        </p>
      </div>

      <Suspense fallback={<HorariosLoading />}>
        <HorariosContent />
      </Suspense>
    </div>
  )
}

