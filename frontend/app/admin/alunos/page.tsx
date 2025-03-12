"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
import { getAlunos } from "@/lib/api"
import type { Aluno } from "@/lib/api"

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    async function loadAlunos() {
      setIsLoading(true)
      try {
        const data = await getAlunos()
        setAlunos(data)
      } catch (error) {
        console.error("Erro ao carregar alunos:", error)
        // Dados de fallback em caso de erro na API
        setAlunos([
          {
            id: 1,
            nome: "João Silva",
            email: "joao@example.com",
            telefone: "11999999999",
            dataNascimento: "1990-05-15",
            matricula: "A001",
            planoId: 1,
            createdAt: "2023-01-10T10:00:00Z",
            updatedAt: "2023-01-10T10:00:00Z",
          },
          {
            id: 2,
            nome: "Maria Oliveira",
            email: "maria@example.com",
            telefone: "11888888888",
            dataNascimento: "1985-08-22",
            matricula: "A002",
            planoId: 2,
            createdAt: "2023-01-15T14:30:00Z",
            updatedAt: "2023-01-15T14:30:00Z",
          },
          {
            id: 3,
            nome: "Pedro Santos",
            email: "pedro@example.com",
            telefone: "11777777777",
            dataNascimento: "1995-03-10",
            matricula: "A003",
            planoId: 1,
            createdAt: "2023-02-01T09:15:00Z",
            updatedAt: "2023-02-01T09:15:00Z",
          },
          {
            id: 4,
            nome: "Ana Costa",
            email: "ana@example.com",
            telefone: "11666666666",
            dataNascimento: "1992-11-28",
            matricula: "A004",
            planoId: 3,
            createdAt: "2023-02-10T16:45:00Z",
            updatedAt: "2023-02-10T16:45:00Z",
          },
          {
            id: 5,
            nome: "Lucas Mendes",
            email: "lucas@example.com",
            telefone: "11555555555",
            dataNascimento: "1988-07-03",
            matricula: "A005",
            planoId: 2,
            createdAt: "2023-02-15T11:20:00Z",
            updatedAt: "2023-02-15T11:20:00Z",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadAlunos()
  }, [])

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      try {
        // await deleteAluno(id)
        setAlunos(alunos.filter((aluno) => aluno.id !== id))
      } catch (error) {
        console.error("Erro ao excluir aluno:", error)
      }
    }
  }

  // Filtrar alunos com base no termo de pesquisa
  const filteredAlunos = alunos.filter(
    (aluno) =>
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.matricula.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Paginação
  const totalPages = Math.ceil(filteredAlunos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAlunos = filteredAlunos.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Alunos</h1>
        <Link href="/admin/alunos/novo">
          <Button className="bg-gradient-murim hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" /> Novo Aluno
          </Button>
        </Link>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Gerenciar Alunos</CardTitle>
          <CardDescription>Visualize, edite e gerencie os alunos cadastrados na academia.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar alunos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-murim-blue"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Data de Nascimento</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAlunos.length > 0 ? (
                      paginatedAlunos.map((aluno) => (
                        <TableRow key={aluno.id}>
                          <TableCell className="font-medium">{aluno.matricula}</TableCell>
                          <TableCell>{aluno.nome}</TableCell>
                          <TableCell>{aluno.email}</TableCell>
                          <TableCell>{aluno.telefone}</TableCell>
                          <TableCell>{new Date(aluno.dataNascimento).toLocaleDateString("pt-BR")}</TableCell>
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
                                  <Link href={`/admin/alunos/${aluno.id}`}>Visualizar</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link href={`/admin/alunos/${aluno.id}/editar`}>Editar</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(aluno.id)}>Excluir</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          Nenhum aluno encontrado.
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

