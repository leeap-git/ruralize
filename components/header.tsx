"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Menu, X, Leaf, User, LogIn, LogOut, LayoutDashboard, Settings, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, userType, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const dashboardLink = userType === "empreendedor" ? "/dashboard/empreendedor" : "/dashboard/visitante"
  const userName = user?.nome?.split(" ")[0] || "Usuário"
  const isEmpreendedor = userType === "empreendedor"
  const empresaNome = user?.tipo === "empreendedor" ? user.nomeEmpresa : null

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">Ruralize</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Início
            </Link>
            <Link href="/propriedades" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Propriedades
            </Link>
            <Link href="/atividades" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Atividades
            </Link>
            <Link href="/sobre" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Sobre
            </Link>
            <Link href="/contato" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Contato
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="max-w-[120px] truncate">{userName}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {isEmpreendedor ? empresaNome : user?.email}
                    </p>
                    <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {isEmpreendedor ? "Empreendedor" : "Visitante"}
                    </span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardLink} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Meu Painel
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`${dashboardLink}/perfil`} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Entrar
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/cadastro">
                    <User className="h-4 w-4 mr-2" />
                    Cadastrar
                  </Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Início
              </Link>
              <Link href="/propriedades" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Propriedades
              </Link>
              <Link href="/atividades" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Atividades
              </Link>
              <Link href="/sobre" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Sobre
              </Link>
              <Link href="/contato" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Contato
              </Link>
              
              {isAuthenticated ? (
                <div className="pt-2 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {isEmpreendedor ? "Empreendedor" : "Visitante"}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={dashboardLink}>Meu Painel</Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Button variant="ghost" size="sm" asChild className="flex-1">
                    <Link href="/login">Entrar</Link>
                  </Button>
                  <Button size="sm" asChild className="flex-1">
                    <Link href="/cadastro">Cadastrar</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
