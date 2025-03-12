import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/80 backdrop-blur-md">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105">
              <Image
                src="/images/logo.svg"
                alt="Academia Murim"
                width={40}
                height={40}
                className="transition-transform duration-300 hover:rotate-3"
              />
              <h3 className="text-lg font-bold text-primary">Academia Murim</h3>
            </div>
            <p className="text-sm text-muted-foreground">Transformando vidas através do treinamento de qualidade.</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-primary">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center"
                >
                  <span className="inline-block transition-transform duration-300 hover:translate-x-1">Início</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/horarios"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center"
                >
                  <span className="inline-block transition-transform duration-300 hover:translate-x-1">Horários</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/agenda"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center"
                >
                  <span className="inline-block transition-transform duration-300 hover:translate-x-1">
                    Agendar Personal
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dicas"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center"
                >
                  <span className="inline-block transition-transform duration-300 hover:translate-x-1">Dicas</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-secondary">Contato</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">Rua das Artes Marciais, 123</li>
              <li className="text-sm text-muted-foreground">Bairro Murim, Cidade - Estado</li>
              <li className="text-sm text-muted-foreground hover:text-secondary transition-colors duration-300">
                <a href="mailto:contato@academiamurim.com">contato@academiamurim.com</a>
              </li>
              <li className="text-sm text-muted-foreground hover:text-secondary transition-colors duration-300">
                <a href="tel:+551199999999">(11) 99999-9999</a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-accent">Redes Sociais</h3>
            <div className="flex space-x-4">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-300 hover:scale-105"
              >
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-secondary transition-colors duration-300" />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-300 hover:scale-105"
              >
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors duration-300" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-300 hover:scale-105"
              >
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors duration-300" />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-300 hover:scale-105"
              >
                <Youtube className="h-5 w-5 text-muted-foreground hover:text-accent transition-colors duration-300" />
              </Link>
            </div>
            <div className="mt-4">
              <Link
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-secondary transition-colors duration-300 flex items-center"
              >
                <span className="inline-block transition-transform duration-300 hover:translate-x-1">
                  WhatsApp: (11) 99999-9999
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Academia Murim. Todos os direitos reservados. Desenvolvido por Equipe de
            Desenvolvimento.
          </p>
        </div>
      </div>
    </footer>
  )
}

