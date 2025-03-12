"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"

const routes = [
  {
    href: "/",
    label: "Início",
  },
  {
    href: "/horarios",
    label: "Horários",
  },
  {
    href: "/agenda",
    label: "Agendar Personal",
  },
  {
    href: "/dicas",
    label: "Dicas",
  },
  {
    href: "/loja",
    label: "Loja",
  },
  {
    href: "/contato",
    label: "Fale Conosco",
  },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, isAdmin, user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105">
          <Image
            src="/images/logo.svg"
            alt="Academia Murim"
            width={40}
            height={40}
            className="transition-transform duration-300 hover:rotate-3"
          />
          <span className="text-xl font-bold text-primary">Academia Murim</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="text-sm font-medium transition-all duration-300 hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-2 border rounded-full px-2 py-1 hover:bg-accent/10 transition-colors duration-200">
                <div className="relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCircle className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{user?.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex transition-transform duration-300 hover:scale-105"
                onClick={() => logout()}
              >
                Sair
              </Button>
              {isAdmin && (
                <Link href="/admin">
                  <Button
                    variant="default"
                    size="sm"
                    className="hidden md:flex transition-transform duration-300 hover:scale-105"
                  >
                    Admin
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex transition-transform duration-300 hover:scale-105"
                >
                  Login
                </Button>
              </Link>
              <Link href="/login?tab=register">
                <Button
                  variant="default"
                  size="sm"
                  className="hidden md:flex bg-gradient-murim text-white hover:opacity-90 transition-all duration-300 hover:shadow-md hover:scale-105"
                >
                  Registrar
                </Button>
              </Link>
            </>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="transition-transform duration-300 hover:scale-105">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="text-sm font-medium transition-all duration-300 hover:text-primary hover:translate-x-1"
                    onClick={() => setIsOpen(false)}
                  >
                    {route.label}
                  </Link>
                ))}
                <div className="flex items-center justify-between mt-4">
                  {isAuthenticated ? (
                    <div className="space-y-2 w-full">
                      <div className="flex items-center gap-2 border rounded-full px-2 py-1">
                        <div className="relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCircle className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">{user?.name}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => logout()}>
                        Sair
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 w-full">
                      <Link href="/login" onClick={() => setIsOpen(false)} className="w-full block">
                        <Button variant="outline" size="sm" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/login?tab=register" onClick={() => setIsOpen(false)} className="w-full block">
                        <Button variant="default" size="sm" className="w-full bg-gradient-murim text-white">
                          Registrar
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

