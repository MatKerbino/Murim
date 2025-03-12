"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { processarPagamento } from "@/lib/api"
import type { SimulacaoPagamento } from "@/lib/api"

export default function NovoPagamentoPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    alunoId: "",
    planoId: "",
    valor: "",
    dataVencimento: "",
  })
  const [pagamentoData, setPagamentoData] = useState<SimulacaoPagamento>({
    numeroCartao: "",
    nomeCartao: "",
    validade: "",
    cvv: "",
    valor: 0,
  })

  const alunos = [
    { id: "1", nome: "João Silva" },
    { id: "2", nome: "Maria Oliveira" },
    { id: "3", nome: "Pedro Santos" },
    { id: "4", nome: "Ana Costa" },
    { id: "5", nome: "Lucas Mendes" },
  ]

  const planos = [
    { id: "1", nome: "Mensal", valor: 99.9 },
    { id: "2", nome: "Trimestral", valor: 269.9 },
    { id: "3", nome: "Anual", valor: 899.9 },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePagamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Formatação específica para campos do cartão
    if (name === "numeroCartao") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 16)
      setPagamentoData((prev) => ({ ...prev, [name]: formattedValue }))
    } else if (name === "validade") {
      let formattedValue = value.replace(/\D/g, "")
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`
      }
      setPagamentoData((prev) => ({ ...prev, [name]: formattedValue }))
    } else if (name === "cvv") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 3)
      setPagamentoData((prev) => ({ ...prev, [name]: formattedValue }))
    } else {
      setPagamentoData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "planoId") {
      const plano = planos.find((p) => p.id === value)
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        valor: plano ? plano.valor.toString() : "",
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!formData.alunoId || !formData.planoId || !formData.dataVencimento) {
      toast({
        variant: "destructive",
        title: "Erro no formulário",
        description: "Por favor, preencha todos os campos obrigatórios.",
      })
      return
    }

    // Atualizar valor do pagamento
    const plano = planos.find((p) => p.id === formData.planoId)
    if (plano) {
      setPagamentoData((prev) => ({ ...prev, valor: plano.valor }))
    }

    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const resultado = await processarPagamento(pagamentoData)

      if (resultado.sucesso) {
        toast({
          title: "Pagamento processado com sucesso!",
          description: `${resultado.mensagem} ID da transação: ${resultado.idTransacao}`,
        })

        // Redirecionar para a lista de pagamentos
        setTimeout(() => {
          router.push("/admin/pagamentos")
        }, 2000)
      } else {
        toast({
          variant: "destructive",
          title: "Erro no processamento",
          description: resultado.mensagem,
        })
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error)
      toast({
        variant: "destructive",
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar o pagamento. Tente novamente.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Novo Pagamento</h1>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Registrar Pagamento</CardTitle>
          <CardDescription>
            {step === 1
              ? "Selecione o aluno e o plano para registrar um novo pagamento."
              : "Informe os dados do cartão para processar o pagamento."}
          </CardDescription>
        </CardHeader>
        {step === 1 ? (
          <form onSubmit={handleNextStep}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alunoId">Aluno</Label>
                <Select value={formData.alunoId} onValueChange={(value) => handleSelectChange("alunoId", value)}>
                  <SelectTrigger id="alunoId">
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {alunos.map((aluno) => (
                      <SelectItem key={aluno.id} value={aluno.id}>
                        {aluno.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="planoId">Plano</Label>
                <Select value={formData.planoId} onValueChange={(value) => handleSelectChange("planoId", value)}>
                  <SelectTrigger id="planoId">
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {planos.map((plano) => (
                      <SelectItem key={plano.id} value={plano.id}>
                        {plano.nome} - R$ {plano.valor.toFixed(2).replace(".", ",")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input id="valor" name="valor" value={formData.valor} readOnly className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                <Input
                  id="dataVencimento"
                  name="dataVencimento"
                  type="date"
                  value={formData.dataVencimento}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/pagamentos")}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Próximo
              </Button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-md mb-4">
                <p className="font-medium">Resumo do Pagamento</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <p>Aluno:</p>
                  <p>{alunos.find((a) => a.id === formData.alunoId)?.nome}</p>
                  <p>Plano:</p>
                  <p>{planos.find((p) => p.id === formData.planoId)?.nome}</p>
                  <p>Valor:</p>
                  <p>R$ {Number.parseFloat(formData.valor).toFixed(2).replace(".", ",")}</p>
                  <p>Vencimento:</p>
                  <p>{new Date(formData.dataVencimento).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroCartao">Número do Cartão</Label>
                <Input
                  id="numeroCartao"
                  name="numeroCartao"
                  value={pagamentoData.numeroCartao}
                  onChange={handlePagamentoChange}
                  placeholder="0000 0000 0000 0000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomeCartao">Nome no Cartão</Label>
                <Input
                  id="nomeCartao"
                  name="nomeCartao"
                  value={pagamentoData.nomeCartao}
                  onChange={handlePagamentoChange}
                  placeholder="NOME COMO ESTÁ NO CARTÃO"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validade">Validade (MM/AA)</Label>
                  <Input
                    id="validade"
                    name="validade"
                    value={pagamentoData.validade}
                    onChange={handlePagamentoChange}
                    placeholder="MM/AA"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    value={pagamentoData.cvv}
                    onChange={handlePagamentoChange}
                    placeholder="000"
                    required
                  />
                </div>
              </div>

              <div className="text-sm text-muted-foreground mt-2">
                <p>Este é um ambiente de simulação. Nenhum pagamento real será processado.</p>
                <p>Para testar, use qualquer número de cartão com 16 dígitos e CVV com 3 dígitos.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isProcessing}>
                {isProcessing ? "Processando..." : "Processar Pagamento"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}

