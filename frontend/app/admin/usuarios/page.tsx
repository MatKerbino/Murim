"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorMessage } from "@/components/ui/error-message"
import { usuariosService } from "@/lib/usuarios-service"
import { Search, Eye, UserCheck, UserX } from "lucide-react"
import Link from "next/link"
import type { Usuario } from "@/lib/usuarios-service"

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await usuariosService.getUsuarios()
      setUsuarios(data)
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
      setError("Não foi possível carregar os usuários. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar usuários com base no termo de pesquisa
  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Usuários</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Usuários</CardTitle>
          <CardDescription>Visualize e gerencie os usuários do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar usuários..."
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
            <ErrorMessage title="Erro ao carregar usuários" message={error} onRetry={loadUsuarios} />
          ) : filteredUsuarios.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.name}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        {usuario.is_online ? (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-600">
                            Online
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-600">
                            Offline
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {usuario.is_admin ? (
                          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-600">
                            Administrador
                          </Badge>
                        ) : usuario.is_aluno ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-600">
                            Aluno
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-600">
                            Usuário
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {usuario.last_login ? new Date(usuario.last_login).toLocaleString() : "Nunca"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/usuarios/${usuario.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                          </Link>
                          {usuario.is_admin ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-amber-600 border-amber-600 hover:bg-amber-50"
                              onClick={() => usuariosService.toggleAdminStatus(usuario.id, false).then(loadUsuarios)}
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Remover Admin
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                              onClick={() => usuariosService.toggleAdminStatus(usuario.id, true).then(loadUsuarios)}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Tornar Admin
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

