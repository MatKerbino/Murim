"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Search, Heart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { ErrorMessage } from "@/components/ui/error-message"
import type { Produto } from "@/lib/api"
import { produtosService } from "@/lib/produtos-service"

export default function LojaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("todos")
  const [sortBy, setSortBy] = useState("relevancia")
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    async function loadProdutos() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await produtosService.getProdutos()
        setProdutos(data)
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
        setError((error as any).message || "Erro ao carregar produtos")
        setProdutos([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProdutos()
  }, [])

  const addToCart = (produto: Produto) => {
    toast({
      title: "Produto adicionado ao carrinho!",
      description: `${produto.nome} foi adicionado ao seu carrinho.`,
      action: <ToastAction altText="Ver carrinho">Ver carrinho</ToastAction>,
    })
  }

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))

    const produto = produtos.find((p) => p.id === id)
    if (produto) {
      toast({
        title: favorites.includes(id) ? "Produto removido dos favoritos" : "Produto adicionado aos favoritos",
        description: produto.nome,
      })
    }
  }

  const filteredProducts = produtos
    .filter((produto) => {
      // Filtro de pesquisa
      if (searchTerm && !produto.nome.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Filtro de categoria
      if (categoryFilter !== "todos" && produto.categoria !== categoryFilter) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Ordenação
      switch (sortBy) {
        case "preco-menor":
          return a.preco - b.preco
        case "preco-maior":
          return b.preco - a.preco
        case "nome-az":
          return a.nome.localeCompare(b.nome)
        case "nome-za":
          return b.nome.localeCompare(a.nome)
        default:
          return 0
      }
    })

  const handleRetry = async () => {
    setError(null)
    setIsLoading(true)
    try {
      const data = await produtosService.getProdutos()
      setProdutos(data)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      setError((error as any).message || "Erro ao carregar produtos")
      setProdutos([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
          Loja Academia Murim
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Encontre os melhores produtos para complementar seu treino e melhorar seus resultados.
        </p>
      </div>

      {error ? (
        <ErrorMessage title="Erro ao carregar produtos" message={error} onRetry={handleRetry} />
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar produtos..."
                  className="pl-8 transition-all duration-300 focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-40">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="transition-all duration-300 hover:border-primary">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas Categorias</SelectItem>
                    <SelectItem value="vestuario">Vestuário</SelectItem>
                    <SelectItem value="suplementos">Suplementos</SelectItem>
                    <SelectItem value="acessorios">Acessórios</SelectItem>
                    <SelectItem value="calcados">Calçados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="transition-all duration-300 hover:border-primary">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevancia">Relevância</SelectItem>
                    <SelectItem value="preco-menor">Menor Preço</SelectItem>
                    <SelectItem value="preco-maior">Maior Preço</SelectItem>
                    <SelectItem value="nome-az">Nome (A-Z)</SelectItem>
                    <SelectItem value="nome-za">Nome (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="border shadow-sm animate-pulse">
                    <div className="aspect-square bg-muted"></div>
                    <CardHeader className="p-4">
                      <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                      <div className="h-6 bg-muted rounded w-1/4"></div>
                      <div className="h-9 bg-muted rounded w-1/3"></div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((produto) => (
                  <Card
                    key={produto.id}
                    className="border shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg group"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={produto.imagem || "/placeholder.svg?height=400&width=400"}
                        alt={produto.nome}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <button
                        onClick={() => toggleFavorite(produto.id)}
                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full transition-all duration-300 hover:bg-white hover:scale-110"
                      >
                        <Heart
                          className={`h-5 w-5 ${favorites.includes(produto.id) ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                        />
                      </button>
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{produto.nome}</CardTitle>
                        <Badge
                          variant={produto.estoque > 10 ? "default" : "destructive"}
                          className="transition-all duration-300 hover:scale-105"
                        >
                          {produto.estoque > 10 ? "Em estoque" : `Restam ${produto.estoque}`}
                        </Badge>
                      </div>
                      <CardDescription>{produto.descricao}</CardDescription>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                      <div className="text-lg font-bold text-primary">
                        R$ {produto.preco.toFixed(2).replace(".", ",")}
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-md hover:scale-105 group"
                        onClick={() => addToCart(produto)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                        Adicionar
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-xl text-muted-foreground">Nenhum produto encontrado.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

