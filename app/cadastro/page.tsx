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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, User, Building2, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"

export default function CadastroPage() {
  const router = useRouter()
  const { register, isAuthenticated, userType: authUserType } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState<"visitante" | "empreendedor">("visitante")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
    cnpj: "",
    nomeEmpresa: "",
    endereco: "",
    cidade: "",
    estado: "",
    descricao: "",
    aceitaTermos: false,
  })

  useEffect(() => {
    if (isAuthenticated && authUserType) {
      router.replace(authUserType === "empreendedor" ? "/dashboard/empreendedor" : "/dashboard/visitante")
    }
  }, [isAuthenticated, authUserType, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validações
    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem")
      return
    }

    if (formData.senha.length < 8 || !/[A-Z]/.test(formData.senha) || !/[0-9]/.test(formData.senha) || !/[^A-Za-z0-9]/.test(formData.senha)) {
      setError("A senha deve ter 8+ caracteres, maiúscula, número e símbolo.")
      return
    }

    if (!formData.aceitaTermos) {
      setError("Você precisa aceitar os termos de uso")
      return
    }

    setIsLoading(true)

    const result = await register({
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      telefone: formData.telefone,
      cpf: formData.cpf,
      tipo: userType,
      nomeEmpresa: formData.nomeEmpresa,
      cnpj: formData.cnpj,
      endereco: formData.endereco,
      cidade: formData.cidade,
      estado: formData.estado,
      descricao: formData.descricao,
    })

    if (result.success) {
      setSuccess(result.message)
      setTimeout(() => {
        if (userType === "empreendedor") {
          router.push("/dashboard/empreendedor")
        } else {
          router.push("/dashboard/visitante")
        }
      }, 500)
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
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Criar Conta
              </h1>
              <p className="text-muted-foreground">
                Junte-se à nossa comunidade de Ruralize
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tipo de Conta</CardTitle>
                <CardDescription>
                  Selecione o tipo de conta que deseja criar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={userType} onValueChange={(v) => setUserType(v as "visitante" | "empreendedor")}>
                  <TabsList className="grid grid-cols-2 w-full mb-6">
                    <TabsTrigger value="visitante" className="gap-2">
                      <User className="h-4 w-4" />
                      Visitante
                    </TabsTrigger>
                    <TabsTrigger value="empreendedor" className="gap-2">
                      <Building2 className="h-4 w-4" />
                      Empreendedor
                    </TabsTrigger>
                  </TabsList>

                  <form onSubmit={handleSubmit} className="space-y-6">
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

                    <TabsContent value="visitante" className="mt-0 space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Como visitante, você poderá consultar propriedades, fazer reservas e acompanhar suas viagens.
                      </p>
                    </TabsContent>

                    <TabsContent value="empreendedor" className="mt-0 space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Como empreendedor, você poderá cadastrar propriedades, atividades e gerenciar reservas.
                      </p>
                    </TabsContent>

                    {/* Campos comuns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                          id="nome"
                          placeholder="Seu nome completo"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF *</Label>
                        <Input
                          id="cpf"
                          placeholder="000.000.000-00"
                          value={formData.cpf}
                          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          placeholder="(00) 00000-0000"
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="senha">Senha *</Label>
                        <div className="relative">
                          <Input
                            id="senha"
                            type={showPassword ? "text" : "password"}
                            placeholder="8+ caracteres, maiúscula, número e símbolo"
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
                      <div className="space-y-2">
                        <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                        <div className="relative">
                          <Input
                            id="confirmarSenha"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Repita a senha"
                            value={formData.confirmarSenha}
                            onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Campos específicos do empreendedor */}
                    {userType === "empreendedor" && (
                      <>
                        <div className="border-t border-border pt-6">
                          <h3 className="font-semibold text-foreground mb-4">Dados da Propriedade/Empresa</h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="nomeEmpresa">Nome da Empresa/Propriedade *</Label>
                                <Input
                                  id="nomeEmpresa"
                                  placeholder="Ex: Fazenda Bela Vista"
                                  value={formData.nomeEmpresa}
                                  onChange={(e) => setFormData({ ...formData, nomeEmpresa: e.target.value })}
                                  required={userType === "empreendedor"}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cnpj">CNPJ (opcional)</Label>
                                <Input
                                  id="cnpj"
                                  placeholder="00.000.000/0000-00"
                                  value={formData.cnpj}
                                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="endereco">Endereço *</Label>
                              <Input
                                id="endereco"
                                placeholder="Rua, número, bairro"
                                value={formData.endereco}
                                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                                required={userType === "empreendedor"}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="cidade">Cidade *</Label>
                                <Input
                                  id="cidade"
                                  placeholder="Sua cidade"
                                  value={formData.cidade}
                                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                                  required={userType === "empreendedor"}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="estado">Estado *</Label>
                                <Select 
                                  value={formData.estado} 
                                  onValueChange={(value) => setFormData({ ...formData, estado: value })}
                                >
                                  <SelectTrigger id="estado">
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="AC">Acre</SelectItem>
                                    <SelectItem value="AL">Alagoas</SelectItem>
                                    <SelectItem value="AP">Amapá</SelectItem>
                                    <SelectItem value="AM">Amazonas</SelectItem>
                                    <SelectItem value="BA">Bahia</SelectItem>
                                    <SelectItem value="CE">Ceará</SelectItem>
                                    <SelectItem value="DF">Distrito Federal</SelectItem>
                                    <SelectItem value="ES">Espírito Santo</SelectItem>
                                    <SelectItem value="GO">Goiás</SelectItem>
                                    <SelectItem value="MA">Maranhão</SelectItem>
                                    <SelectItem value="MT">Mato Grosso</SelectItem>
                                    <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                                    <SelectItem value="MG">Minas Gerais</SelectItem>
                                    <SelectItem value="PA">Pará</SelectItem>
                                    <SelectItem value="PB">Paraíba</SelectItem>
                                    <SelectItem value="PR">Paraná</SelectItem>
                                    <SelectItem value="PE">Pernambuco</SelectItem>
                                    <SelectItem value="PI">Piauí</SelectItem>
                                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                    <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                                    <SelectItem value="RO">Rondônia</SelectItem>
                                    <SelectItem value="RR">Roraima</SelectItem>
                                    <SelectItem value="SC">Santa Catarina</SelectItem>
                                    <SelectItem value="SP">São Paulo</SelectItem>
                                    <SelectItem value="SE">Sergipe</SelectItem>
                                    <SelectItem value="TO">Tocantins</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="descricao">Descrição da Empresa</Label>
                              <Input
                                id="descricao"
                                placeholder="Breve descrição do seu negócio"
                                value={formData.descricao}
                                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="termos"
                        checked={formData.aceitaTermos}
                        onCheckedChange={(checked) => setFormData({ ...formData, aceitaTermos: checked as boolean })}
                        required
                      />
                      <Label htmlFor="termos" className="text-sm font-normal leading-relaxed">
                        Li e aceito os{" "}
                        <Link href="/termos" className="text-primary hover:underline">
                          Termos de Uso
                        </Link>{" "}
                        e a{" "}
                        <Link href="/privacidade" className="text-primary hover:underline">
                          Política de Privacidade
                        </Link>
                      </Label>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? "Criando conta..." : "Criar Conta"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Já possui uma conta?{" "}
                      <Link href="/login" className="text-primary hover:underline font-medium">
                        Entrar
                      </Link>
                    </p>
                  </form>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
