"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { authService } from "@/lib/auth-service"

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
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({})
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({})

  const { login, isLoading } = useAuth()
  const router = useRouter()
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

    // Clear error when user types
    if (loginErrors[name]) {
      setLoginErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (registerErrors[name]) {
      setRegisterErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateLoginForm = () => {
    const errors: Record<string, string> = {}

    if (!loginData.email) {
      errors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.email = "Email inválido"
    }

    if (!loginData.senha) {
      errors.senha = "Senha é obrigatória"
    } else if (loginData.senha.length < 6) {
      errors.senha = "A senha deve ter pelo menos 6 caracteres"
    }

    setLoginErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateRegisterForm = () => {
    const errors: Record<string, string> = {}

    if (!registerData.nome) {
      errors.nome = "Nome é obrigatório"
    }

    if (!registerData.email) {
      errors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      errors.email = "Email inválido"
    }

    if (!registerData.senha) {
      errors.senha = "Senha é obrigatória"
    } else if (registerData.senha.length < 6) {
      errors.senha = "A senha deve ter pelo menos 6 caracteres"
    }

    if (!registerData.confirmarSenha) {
      errors.confirmarSenha = "Confirmação de senha é obrigatória"
    } else if (registerData.senha !== registerData.confirmarSenha) {
      errors.confirmarSenha = "As senhas não coincidem"
    }

    setRegisterErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    if (!validateLoginForm()) {
      toast({
        variant: "destructive",
        title: "Erro no formulário",
        description: "Por favor, corrija os erros antes de continuar.",
      })
      return
    }

    try {
      await login({
        email: loginData.email,
        password: loginData.senha,
      })

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta à Academia Murim.",
      })

      // Redirect to home page after successful login
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Email ou senha incorretos. Tente novamente.",
      })
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()

    if (!validateRegisterForm()) {
      toast({
        variant: "destructive",
        title: "Erro no formulário",
        description: "Por favor, corrija os erros antes de continuar.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Call the register API
      await authService.register({
        name: registerData.nome,
        email: registerData.email,
        password: registerData.senha,
        password_confirmation: registerData.confirmarSenha,
      })

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Bem-vindo à Academia Murim. Faça login para continuar.",
      })

      // Clear form and switch to login tab
      setRegisterData({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
      })
      setActiveTab("login")

      // Pre-fill login form with registered email
      setLoginData((prev) => ({
        ...prev,
        email: registerData.email,
      }))
    } catch (error) {
      console.error("Erro ao fazer cadastro:", error)
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "Não foi possível completar o cadastro. Tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
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
                    className={loginErrors.email ? "border-red-500" : ""}
                  />
                  {loginErrors.email && <p className="text-red-500 text-sm">{loginErrors.email}</p>}
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
                    className={loginErrors.senha ? "border-red-500" : ""}
                  />
                  {loginErrors.senha && <p className="text-red-500 text-sm">{loginErrors.senha}</p>}
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
                  <Input
                    id="nome"
                    name="nome"
                    value={registerData.nome}
                    onChange={handleRegisterChange}
                    className={registerErrors.nome ? "border-red-500" : ""}
                  />
                  {registerErrors.nome && <p className="text-red-500 text-sm">{registerErrors.nome}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input
                    id="email-register"
                    name="email"
                    type="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className={registerErrors.email ? "border-red-500" : ""}
                  />
                  {registerErrors.email && <p className="text-red-500 text-sm">{registerErrors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha-register">Senha</Label>
                  <Input
                    id="senha-register"
                    name="senha"
                    type="password"
                    value={registerData.senha}
                    onChange={handleRegisterChange}
                    className={registerErrors.senha ? "border-red-500" : ""}
                  />
                  {registerErrors.senha && <p className="text-red-500 text-sm">{registerErrors.senha}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmar-senha">Confirmar Senha</Label>
                  <Input
                    id="confirmar-senha"
                    name="confirmarSenha"
                    type="password"
                    value={registerData.confirmarSenha}
                    onChange={handleRegisterChange}
                    className={registerErrors.confirmarSenha ? "border-red-500" : ""}
                  />
                  {registerErrors.confirmarSenha && (
                    <p className="text-red-500 text-sm">{registerErrors.confirmarSenha}</p>
                  )}
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

