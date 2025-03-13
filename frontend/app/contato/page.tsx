"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { MapPin, Phone, Mail, Clock, AlertCircle } from "lucide-react"
import { contatoService } from "@/lib/contato-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }

    // Limpar erro da API quando o usuário digita
    setApiError(null)
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpa o erro do campo quando o usuário seleciona uma opção
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }

    // Limpar erro da API quando o usuário seleciona uma opção
    setApiError(null)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.assunto) {
      newErrors.assunto = "Assunto é obrigatório"
    }

    if (!formData.mensagem.trim()) {
      newErrors.mensagem = "Mensagem é obrigatória"
    } else if (formData.mensagem.trim().length < 10) {
      newErrors.mensagem = "A mensagem deve ter pelo menos 10 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Limpar erro da API
    setApiError(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Enviar para a API
      await contatoService.enviarContato({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone || undefined,
        assunto: formData.assunto,
        mensagem: formData.mensagem,
      })

      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Agradecemos seu contato. Responderemos em breve.",
        action: <ToastAction altText="OK">OK</ToastAction>,
      })

      // Resetar formulário
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        assunto: "",
        mensagem: "",
      })
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)

      // Tratar erros específicos
      if (error.errors) {
        // Erros de validação por campo
        const newErrors: Record<string, string> = {}

        if (error.errors.nome) {
          newErrors.nome = error.errors.nome
        }

        if (error.errors.email) {
          newErrors.email = error.errors.email
        }

        if (error.errors.telefone) {
          newErrors.telefone = error.errors.telefone
        }

        if (error.errors.assunto) {
          newErrors.assunto = error.errors.assunto
        }

        if (error.errors.mensagem) {
          newErrors.mensagem = error.errors.mensagem
        }

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors)
        } else {
          // Erro geral
          setApiError(error.message || "Não foi possível enviar sua mensagem. Tente novamente mais tarde.")
        }
      } else {
        // Erro geral
        setApiError(error.message || "Não foi possível enviar sua mensagem. Tente novamente mais tarde.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">Fale Conosco</h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
          Entre em contato com a Academia Murim. Estamos à disposição para atender suas dúvidas e sugestões.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-card">
          <CardHeader>
            <CardTitle className="text-murim-blue">Envie sua mensagem</CardTitle>
            <CardDescription>
              Preencha o formulário abaixo e entraremos em contato o mais breve possível.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {apiError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">
                    Nome <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className={errors.nome ? "border-red-500" : ""}
                  />
                  {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className={errors.telefone ? "border-red-500" : ""}
                  />
                  {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assunto">
                    Assunto <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.assunto} onValueChange={(value) => handleSelectChange("assunto", value)}>
                    <SelectTrigger id="assunto" className={errors.assunto ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione um assunto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="duvidas">Dúvidas</SelectItem>
                      <SelectItem value="sugestoes">Sugestões</SelectItem>
                      <SelectItem value="reclamacoes">Reclamações</SelectItem>
                      <SelectItem value="elogios">Elogios</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.assunto && <p className="text-red-500 text-sm">{errors.assunto}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mensagem">
                  Mensagem <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="mensagem"
                  name="mensagem"
                  rows={5}
                  value={formData.mensagem}
                  onChange={handleChange}
                  className={errors.mensagem ? "border-red-500" : ""}
                />
                {errors.mensagem && <p className="text-red-500 text-sm">{errors.mensagem}</p>}
              </div>
              <Button type="submit" className="w-full bg-gradient-murim hover:opacity-90" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-murim-pink">Informações de Contato</CardTitle>
            <CardDescription>Outras formas de entrar em contato conosco</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-murim-blue mt-0.5" />
              <div>
                <h3 className="font-medium">Endereço</h3>
                <p className="text-sm text-gray-500">
                  Rua das Artes Marciais, 123
                  <br />
                  Bairro Murim, Cidade - Estado
                  <br />
                  CEP: 00000-000
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-murim-pink mt-0.5" />
              <div>
                <h3 className="font-medium">Telefone</h3>
                <p className="text-sm text-gray-500">
                  (11) 99999-9999
                  <br />
                  (11) 2222-2222
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-murim-purple mt-0.5" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-gray-500">
                  contato@academiamurim.com
                  <br />
                  suporte@academiamurim.com
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-murim-cyan mt-0.5" />
              <div>
                <h3 className="font-medium">Horário de Funcionamento</h3>
                <p className="text-sm text-gray-500">
                  Segunda a Sexta: 06:00 - 22:00
                  <br />
                  Sábado: 08:00 - 18:00
                  <br />
                  Domingo: Fechado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Google Maps - Full Width */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-murim-blue mb-4 text-center">Nossa Localização</h3>
        <div className="w-full h-[400px] rounded-md overflow-hidden border border-gray-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1976900292297!2d-46.65390508502264!3d-23.56507968468041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1615589346212!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização Academia Murim"
            className="rounded-md"
          ></iframe>
        </div>
      </div>
    </div>
  )
}

