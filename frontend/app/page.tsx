"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Dumbbell, Clock, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const banners = [
    {
      image: "/images/banner-1.jpg",
      title: "Transforme seu corpo",
      description: "Treine com os melhores profissionais e equipamentos de última geração",
    },
    {
      image: "/images/banner-2.jpg",
      title: "Supere seus limites",
      description: "Programas personalizados para todos os níveis de condicionamento",
    },
    {
      image: "/images/banner-3.jpg",
      title: "Resultados reais",
      description: "Acompanhamento profissional para alcançar seus objetivos",
    },
  ]

  const categorias = [
    {
      title: "Musculação",
      icon: Dumbbell,
      image: "/images/categorias/musculacao.jpg",
      description: "Equipamentos modernos para todos os grupos musculares",
    },
    {
      title: "Cardio",
      icon: Clock,
      image: "/images/categorias/cardio.jpg",
      description: "Esteiras, bicicletas e elípticos de última geração",
    },
    {
      title: "Funcional",
      icon: Users,
      image: "/images/categorias/funcional.jpg",
      description: "Treinamento dinâmico para melhorar sua performance",
    },
    {
      title: "Yoga",
      icon: Award,
      image: "/images/categorias/yoga.jpg",
      description: "Equilíbrio entre corpo e mente para seu bem-estar",
    },
  ]

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative">
        <Carousel className="w-full">
          <CarouselContent>
            {banners.map((banner, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[50vh] md:h-[60vh] w-full">
                  <Image
                    src={banner.image || "/placeholder.svg?height=600&width=1200"}
                    alt={banner.title}
                    fill
                    className="object-cover brightness-50 hover-bright"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-center slide-in">
                      {banner.title}
                    </h1>
                    <p className="text-lg md:text-xl text-center max-w-2xl fade-in">{banner.description}</p>
                    <div className="mt-8 flex gap-4">
                      <Link href="/horarios">
                        <Button className="bg-gradient-murim hover:opacity-90 transition-all duration-300 hover:shadow-md hover:scale-105 text-white border-0">
                          Ver Horários
                        </Button>
                      </Link>
                      <Link href="/contato">
                        <Button
                          variant="outline"
                          className="border-white text-white hover:bg-white/20 transition-all duration-300"
                        >
                          Fale Conosco
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            <CarouselPrevious className="relative left-0 translate-y-0 bg-black/50 text-white hover:bg-black/70" />
            <CarouselNext className="relative right-0 translate-y-0 bg-black/50 text-white hover:bg-black/70" />
          </div>
        </Carousel>
      </section>

      {/* Categories Section */}
      <section className="w-full py-12 md:py-24 bg-slate-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
              Nossas Modalidades
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Conheça as diversas modalidades disponíveis na Academia Murim
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categorias.map((categoria, index) => (
              <Card
                key={index}
                className="overflow-hidden border shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg bg-gradient-murim text-white"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={categoria.image || "/placeholder.svg?height=200&width=400"}
                    alt={categoria.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium text-white">{categoria.title}</CardTitle>
                  <categoria.icon className="h-5 w-5 text-white" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/90">{categoria.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                Nossos Diferenciais
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Conheça o que faz da Academia Murim a melhor escolha para seu treinamento.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <Card className="border shadow-sm transition-all duration-300 hover:shadow-lg bg-gradient-murim text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Equipamentos Modernos</CardTitle>
                <Dumbbell className="h-5 w-5 text-white" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/90">
                  Equipamentos de última geração para garantir o melhor desempenho nos seus treinos.
                </p>
              </CardContent>
            </Card>
            <Card className="border shadow-sm transition-all duration-300 hover:shadow-lg bg-gradient-murim text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Horários Flexíveis</CardTitle>
                <Clock className="h-5 w-5 text-white" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/90">
                  Funcionamento estendido para atender a sua rotina, com aulas em diversos horários.
                </p>
              </CardContent>
            </Card>
            <Card className="border shadow-sm transition-all duration-300 hover:shadow-lg bg-gradient-murim text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Instrutores Qualificados</CardTitle>
                <Users className="h-5 w-5 text-white" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/90">
                  Profissionais experientes e certificados para orientar seu treinamento.
                </p>
              </CardContent>
            </Card>
            <Card className="border shadow-sm transition-all duration-300 hover:shadow-lg bg-gradient-murim text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Planos Personalizados</CardTitle>
                <Award className="h-5 w-5 text-white" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/90">
                  Planos adaptados às suas necessidades e objetivos, com acompanhamento constante.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-secondary">
                Comece Sua Jornada Hoje
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Junte-se à Academia Murim e transforme sua vida com saúde e bem-estar.
              </p>
            </div>
            <Link href="/contato">
              <Button className="bg-gradient-murim text-white hover:opacity-90 transition-all duration-300 hover:shadow-md hover:scale-105 group border-0">
                Entre em Contato
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

