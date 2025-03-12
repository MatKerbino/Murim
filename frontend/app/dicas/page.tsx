"use client"

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorMessage } from "@/components/ui/error-message"
import { dicasService } from "@/lib/dicas-service"
import type { ApiError } from "@/lib/api"

async function DicasContent() {
  try {
    const dicas = await dicasService.getDicas()

    // Separar dicas por categoria
    const dicasDesempenho = dicas.filter((dica) => dica.categoria?.slug === "desempenho")
    const dicasNutricao = dicas.filter((dica) => dica.categoria?.slug === "nutricao")
    const dicasVestuario = dicas.filter((dica) => dica.categoria?.slug === "vestuario")

    return (
      <Tabs defaultValue="desempenho" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="desempenho">Desempenho</TabsTrigger>
          <TabsTrigger value="nutricao">Nutrição</TabsTrigger>
          <TabsTrigger value="vestuario">Vestuário</TabsTrigger>
        </TabsList>
        <TabsContent value="desempenho" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dicasDesempenho.length > 0 ? (
              dicasDesempenho.map((dica) => (
                <Card key={dica.id} className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-primary">{dica.titulo}</CardTitle>
                    <CardDescription>{dica.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{dica.conteudo}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <span>Por: {dica.autor}</span>
                    <span>{new Date(dica.created_at).toLocaleDateString("pt-BR")}</span>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">Nenhuma dica encontrada nesta categoria.</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="nutricao" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dicasNutricao.length > 0 ? (
              dicasNutricao.map((dica) => (
                <Card key={dica.id} className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-secondary">{dica.titulo}</CardTitle>
                    <CardDescription>{dica.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{dica.conteudo}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <span>Por: {dica.autor}</span>
                    <span>{new Date(dica.created_at).toLocaleDateString("pt-BR")}</span>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">Nenhuma dica encontrada nesta categoria.</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="vestuario" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dicasVestuario.length > 0 ? (
              dicasVestuario.map((dica) => (
                <Card key={dica.id} className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-accent">{dica.titulo}</CardTitle>
                    <CardDescription>{dica.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{dica.conteudo}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <span>Por: {dica.autor}</span>
                    <span>{new Date(dica.created_at).toLocaleDateString("pt-BR")}</span>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">Nenhuma dica encontrada nesta categoria.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    )
  } catch (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar dicas"
        message={(error as ApiError).message || "Não foi possível carregar as dicas. Tente novamente mais tarde."}
      />
    )
  }
}

function DicasLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="border shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  )
}

export default function DicasPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">Dicas e Conteúdos</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Confira nossas dicas sobre desempenho, nutrição e vestuário para melhorar seus resultados.
        </p>
      </div>

      <Suspense fallback={<DicasLoading />}>
        <DicasContent />
      </Suspense>
    </div>
  )
}

