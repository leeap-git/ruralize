"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Leaf, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, userType } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    lembrar: false,
  })

  useEffect(() => {
    if (isAuthenticated && userType) {
      const requestedNext = new URLSearchParams(window.location.search).get("next")
      const safeNext = requestedNext && requestedNext.startsWith("/") && !requestedNext.startsWith("//")
        ? requestedNext
        : userType === "empreendedor"
          ? "/dashboard/empreendedor"
          : "/dashboard/visitante"
      router.replace(safeNext)
    }
  }, [isAuthenticated, userType, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    const result = await login(formData.email, formData.senha, formData.lembrar)
    
    if (result.success) {
      setSuccess(result.message)
      const requestedNext = new URLSearchParams(window.location.search).get("next")
      const safeNext = requestedNext && requestedNext.startsWith("/") && !requestedNext.startsWith("//")
        ? requestedNext
        : result.userType === "empreendedor"
          ? "/dashboard/empreendedor"
          : "/dashboard/visitante"
      setTimeout(() => router.push(safeNext), 500)
    } else {
      setError(result.message)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Bem-vindo de volta
              </h1>
              <p className="text-muted-foreground">
                Entre na sua conta para continuar
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Entrar</CardTitle>
                <CardDescription>
                  Use seu e-mail e senha para acessar a plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-primary bg-primary/10">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-primary">{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="senha">Senha</Label>
                      <Link href="/recuperar-senha" className="text-sm text-primary hover:underline">
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="senha"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        value={formData.senha}
                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="lembrar"
                      checked={formData.lembrar}
                      onCheckedChange={(checked) => setFormData({ ...formData, lembrar: checked as boolean })}
                    />
                    <Label htmlFor="lembrar" className="text-sm font-normal">
                      Manter conectado
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">ou</span>
                    </div>
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    Não possui uma conta?{" "}
                    <Link href="/cadastro" className="text-primary hover:underline font-medium">
                      Cadastre-se
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>

            <div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm font-medium text-foreground">Contas de teste:</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Visitante:</strong> maria@email.com / 123456</p>
                <p><strong>Empreendedor:</strong> carlos@fazendaboavista.com / 123456</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
