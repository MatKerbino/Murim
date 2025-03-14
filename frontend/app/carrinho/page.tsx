"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { carrinhoService, type CartItem } from "@/lib/carrinho-service"
import { useRouter } from "next/navigation"
import { Trash2, ShoppingCart, Minus, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CarrinhoPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadCartItems()
  }, [])

  const loadCartItems = async () => {
    setIsLoading(true)
    try {
      const items = await carrinhoService.getCartItems()
      setCartItems(items)
    } catch (error) {
      console.error("Erro ao carregar itens do carrinho:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os itens do carrinho. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateQuantity = async (id: number, quantidade: number) => {
    if (quantidade < 1) return

    try {
      await carrinhoService.updateCartItem(id, quantidade)
      setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantidade } : item)))
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a quantidade. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveItem = async (id: number) => {
    try {
      await carrinhoService.removeFromCart(id)
      setCartItems(cartItems.filter((item) => item.id !== id))
      toast({
        title: "Item removido",
        description: "O item foi removido do carrinho com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao remover item:", error)
      toast({
        title: "Erro",
        description: "Não foi possível remover o item. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    try {
      const result = await carrinhoService.checkout()
      toast({
        title: "Compra realizada com sucesso!",
        description: "Seu pedido foi processado. Você será redirecionado para a página de pagamento.",
      })
      // Redirecionar para a página de pagamento ou confirmação
      router.push(`/pagamento/${result.id}`)
    } catch (error) {
      console.error("Erro ao finalizar compra:", error)
      toast({
        title: "Erro",
        description: "Não foi possível finalizar a compra. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.produto?.preco || 0) * item.quantidade
    }, 0)
  }

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-3xl font-bold">Carregando seu carrinho...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-3xl font-bold">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground max-w-md">
            Parece que você ainda não adicionou nenhum produto ao seu carrinho. Explore nossa loja e encontre produtos
            incríveis!
          </p>
          <Button asChild>
            <Link href="/loja">Ir para a Loja</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Meu Carrinho</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Itens do Carrinho</CardTitle>
              <CardDescription>
                Você tem {cartItems.length} {cartItems.length === 1 ? "item" : "itens"} no seu carrinho
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden">
                    <Image
                      src={item.produto?.imagem || "/placeholder.svg?height=80&width=80"}
                      alt={item.produto?.nome || "Produto"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.produto?.nome}</h3>
                    <p className="text-sm text-muted-foreground">
                      R$ {(item.produto?.preco || 0).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(item.id, item.quantidade - 1)}
                      disabled={item.quantidade <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantidade}
                      onChange={(e) => handleUpdateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                      className="w-16 text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(item.id, item.quantidade + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {calculateTotal().toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span>Grátis</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>R$ {calculateTotal().toFixed(2).replace(".", ",")}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCheckout} disabled={isProcessing}>
                {isProcessing ? "Processando..." : "Finalizar Compra"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

