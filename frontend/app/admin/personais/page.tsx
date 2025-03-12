"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Plus, MoreHorizontal, Search } from "lucide-react"
import { ErrorMessage } from "@/components/ui/error-message"
import { getPersonais } from "@/lib/api"
import type { Personal, ApiError } from "@/lib/api"

export default function PersonaisPage() {
  const [personais, setPersonais] = useState<Personal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadPersonais()
  }, [])

  const loadPersonais = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getPersonais()
      setPersonais(data)
    } catch (error) {
      console.error("Erro ao carregar personais:", error)
      setError((error as ApiError).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este personal?")) {
      try {
        // Simulação de exclusão
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setPersonais(personais.filter((personal) => personal.id !== id))
      } catch (error) {
        console.error("Erro ao excluir personal:", error)
        alert((error as ApiError).message)
      }
    }
  }

  // Filtrar personais com base no termo de pesquisa
  const filteredPersonais = personais.filter(
    (personal) =>
      personal.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      personal.especialidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      personal.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Paginação
  const totalPages = Math.ceil(filteredPersonais.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPersonais = filteredPersonais.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Personal Trainers</h1>
        <Link href="/admin/personais/novo">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Novo Personal
          </Button>
        </Link>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Gerenciar Personal Trainers</CardTitle>
          <CardDescription>Visualize, edite e gerencie os personal trainers da academia.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar personais..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {error ? (
            <ErrorMessage title="Erro ao carregar personais" message={error} onRetry={loadPersonais} />
          ) : isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Foto</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Especialidade</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPersonais.length > 0 ? (
                      paginatedPersonais.map((personal) => (
                        <TableRow key={personal.id}>
                          <TableCell>
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                              <Image
                                src={personal.foto || "/images/placeholder.jpg"}
                                alt={personal.nome}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{personal.nome}</TableCell>
                          <TableCell>{personal.especialidade}</TableCell>
                          <TableCell>{personal.email}</TableCell>
                          <TableCell>{personal.telefone}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Link href={`/admin/personais/${personal.id}`}>Visualizar</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link href={`/admin/personais/${personal.id}/editar`}>Editar</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(personal.id)}>Excluir</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          Nenhum personal encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

