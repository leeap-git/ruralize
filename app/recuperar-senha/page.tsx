"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Check, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function RecuperarSenhaPage() {
  const [step, setStep] = useState<"email" | "enviado">("email")
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular envio
    setStep("enviado")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          {step === "email" ? (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <KeyRound className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
                <CardDescription>
                  Digite seu e-mail cadastrado para receber as instruções de recuperação de senha.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Enviar instruções
                  </Button>

                  <div className="text-center">
                    <Link 
                      href="/login" 
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Voltar para o login
                    </Link>
                  </div>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl">E-mail Enviado!</CardTitle>
                <CardDescription>
                  Enviamos as instruções de recuperação de senha para:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="font-medium">{email}</p>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Verifique sua caixa de entrada e siga as instruções para criar uma nova senha.</p>
                  <p>Se não encontrar o e-mail, verifique também a pasta de spam.</p>
                </div>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full" onClick={() => setStep("email")}>
                    Reenviar e-mail
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/login">Voltar para o login</Link>
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </main>

      <Footer />
    </div>
  )
}
