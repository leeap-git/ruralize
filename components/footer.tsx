import Link from "next/link"
import { Leaf, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-7 w-7 text-sidebar-primary" />
              <span className="text-xl font-bold">Ruralize</span>
            </Link>
            <p className="text-sidebar-foreground/80 text-sm leading-relaxed">
              Conectando você às melhores experiências do campo brasileiro. Descubra propriedades rurais, atividades ao ar livre e momentos inesquecíveis.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sidebar-primary">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/propriedades" className="text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors">
                  Propriedades
                </Link>
              </li>
              <li>
                <Link href="/atividades" className="text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors">
                  Atividades
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sidebar-primary">Para Empreendedores</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cadastro" className="text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors">
                  Cadastre sua Propriedade
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors">
                  Área do Empreendedor
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors">
                  Como Funciona
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sidebar-primary">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-sidebar-foreground/80">
                <Mail className="h-4 w-4" />
                contato@turismorural.com.br
              </li>
              <li className="flex items-center gap-2 text-sidebar-foreground/80">
                <Phone className="h-4 w-4" />
                (14) 99999-9999
              </li>
              <li className="flex items-start gap-2 text-sidebar-foreground/80">
                <MapPin className="h-4 w-4 mt-0.5" />
                Ourinhos - SP, Brasil
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sidebar-border mt-8 pt-8 text-center text-sm text-sidebar-foreground/60">
          <p>&copy; 2025 Ruralize. Desenvolvido pela FATEC Ourinhos - Análise e Desenvolvimento de Sistemas.</p>
        </div>
      </div>
    </footer>
  )
}
