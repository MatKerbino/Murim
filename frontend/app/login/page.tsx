"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    email: "",
    senha: "",
  })

  const [registerData, setRegisterData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, isLoading } = useAuth()

  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("login")

  useEffect(() => {
    // Check if tab parameter exists and set active tab
    const tab = searchParams.get("tab")
    if (tab === "register") {
      setActiveTab("register")
    }
  }, [searchParams])

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    try {
      await login({
        email: loginData.email,
        password: loginData.senha,
      })

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta à Academia Murim.",
      })
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Email ou senha incorretos. Tente novamente.",
      })
    }
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()

    if (registerData.senha !== registerData.confirmarSenha) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "As senhas não coincidem.",
      })
      return
    }

    setIsSubmitting(true)

    // Simulando registro
    setTimeout(() => {
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Bem-vindo à Academia Murim.",
      })
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="container py-10 flex justify-center">
      <Card className="w-full max-w-md">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Entre com suas credenciais para acessar sua conta.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="senha">Senha</Label>
                    <Link href="/recuperar-senha" className="text-sm text-blue-600 hover:underline">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input
                    id="senha"
                    name="senha"
                    type="password"
                    value={loginData.senha}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </CardContent>
          </TabsContent>

          <TabsContent value="register">
            <CardHeader>
              <CardTitle>Cadastro</CardTitle>
              <CardDescription>Crie sua conta para acessar os serviços da Academia Murim.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" name="nome" value={registerData.nome} onChange={handleRegisterChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input
                    id="email-register"
                    name="email"
                    type="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha-register">Senha</Label>
                  <Input
                    id="senha-register"
                    name="senha"
                    type="password"
                    value={registerData.senha}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmar-senha">Confirmar Senha</Label>
                  <Input
                    id="confirmar-senha"
                    name="confirmarSenha"
                    type="password"
                    value={registerData.confirmarSenha}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </form>
            </CardContent>
          </TabsContent>

          <CardFooter className="text-center text-sm text-gray-500 pt-4">
            Ao fazer login ou se cadastrar, você concorda com os{" "}
            <Link href="/termos" className="text-blue-600 hover:underline">
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link href="/privacidade" className="text-blue-600 hover:underline">
              Política de Privacidade
            </Link>
            .
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  )
}

