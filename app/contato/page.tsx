"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular envio
    alert("Mensagem enviada com sucesso!")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Entre em Contato
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tem alguma dúvida, sugestão ou precisa de ajuda? Nossa equipe está pronta para atendê-lo.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
            {/* Informações de Contato */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">E-mail</h3>
                      <p className="text-sm text-muted-foreground">contato@turismorural.com.br</p>
                      <p className="text-sm text-muted-foreground">suporte@turismorural.com.br</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Telefone</h3>
                      <p className="text-sm text-muted-foreground">(14) 3322-1100</p>
                      <p className="text-sm text-muted-foreground">(14) 99999-0000</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Endereço</h3>
                      <p className="text-sm text-muted-foreground">
                        FATEC Ourinhos<br />
                        Av. Vitalina Marcusso, 1400<br />
                        Ourinhos - SP, 19910-206
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Horário de Atendimento</h3>
                      <p className="text-sm text-muted-foreground">Segunda a Sexta: 8h - 18h</p>
                      <p className="text-sm text-muted-foreground">Sábado: 8h - 12h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulário de Contato */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Envie sua mensagem</CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo e responderemos o mais breve possível.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                          id="nome"
                          placeholder="Seu nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          placeholder="(00) 00000-0000"
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assunto">Assunto *</Label>
                        <Select
                          value={formData.assunto}
                          onValueChange={(value) => setFormData({ ...formData, assunto: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o assunto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="duvida">Dúvida</SelectItem>
                            <SelectItem value="sugestao">Sugestão</SelectItem>
                            <SelectItem value="reclamacao">Reclamação</SelectItem>
                            <SelectItem value="parceria">Parceria</SelectItem>
                            <SelectItem value="suporte">Suporte Técnico</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensagem">Mensagem *</Label>
                      <Textarea
                        id="mensagem"
                        placeholder="Escreva sua mensagem aqui..."
                        rows={6}
                        value={formData.mensagem}
                        onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full md:w-auto gap-2">
                      <Send className="h-4 w-4" />
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mapa */}
          <div className="mt-12 max-w-6xl mx-auto">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-[21/9] bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Mapa de localização</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
