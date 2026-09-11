import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Target, Heart, Leaf, MapPin, Calendar, MessageSquare, BarChart3 } from "lucide-react"

export default function SobrePage() {
  const valores = [
    {
      icon: Heart,
      titulo: "Paixão pelo Campo",
      descricao: "Acreditamos no potencial do Ruralize como forma de valorizar a cultura e tradições do interior."
    },
    {
      icon: Leaf,
      titulo: "Sustentabilidade",
      descricao: "Promovemos práticas sustentáveis que preservam o meio ambiente e geram renda para comunidades rurais."
    },
    {
      icon: Users,
      titulo: "Conexão Humana",
      descricao: "Facilitamos encontros autênticos entre visitantes e famílias que vivem e trabalham no campo."
    },
  ]

  const funcionalidades = [
    {
      icon: MapPin,
      titulo: "Busca por Localização",
      descricao: "Encontre propriedades rurais próximas a você ou em qualquer região do Brasil."
    },
    {
      icon: Calendar,
      titulo: "Sistema de Reservas",
      descricao: "Reserve atividades e hospedagens diretamente pela plataforma de forma simples e segura."
    },
    {
      icon: MessageSquare,
      titulo: "Comunicação Direta",
      descricao: "Entre em contato com empreendedores para tirar dúvidas antes de fazer sua reserva."
    },
    {
      icon: BarChart3,
      titulo: "Gestão para Empreendedores",
      descricao: "Ferramentas completas para gerenciar propriedades, atividades e reservas."
    },
  ]


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Conectando pessoas à experiência rural autêntica
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
              O Ruralize é uma plataforma desenvolvida para aproximar visitantes de propriedades rurais,
              promovendo experiências únicas e valorizando o trabalho de empreendedores do campo.
            </p>
          </div>
        </section>

        {/* Nossa Missão */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Nossa Missão</h2>
                <p className="text-muted-foreground mb-4">
                  Democratizar o acesso ao Ruralize brasileiro, conectando turistas a experiências
                  autênticas no campo enquanto fortalecemos a economia local de pequenos e médios
                  empreendedores rurais.
                </p>
                <p className="text-muted-foreground mb-6">
                  Acreditamos que o Ruralize pode ser uma ferramenta poderosa para o desenvolvimento
                  sustentável, preservação cultural e geração de renda para comunidades do interior.
                </p>
                <div className="flex items-center gap-4">
                  <Target className="h-12 w-12 text-primary" />
                  <div>
                    <p className="font-semibold">Projeto Acadêmico</p>
                    <p className="text-sm text-muted-foreground">FATEC Ourinhos - 2026</p>
                  </div>
                </div>
              </div>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src="/placeholder.jpg&text=Ruralize"
                  alt="Ruralize"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Nossos Valores */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
              Nossos Valores
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {valores.map((valor) => (
                <Card key={valor.titulo} className="text-center">
                  <CardContent className="pt-8 pb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <valor.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{valor.titulo}</h3>
                    <p className="text-muted-foreground">{valor.descricao}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Funcionalidades */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
              O que oferecemos
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Uma plataforma completa tanto para visitantes quanto para empreendedores rurais
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {funcionalidades.map((func) => (
                <Card key={func.titulo}>
                  <CardContent className="pt-6">
                    <func.icon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">{func.titulo}</h3>
                    <p className="text-sm text-muted-foreground">{func.descricao}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>


        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Pronto para explorar o campo?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Comece agora mesmo a descobrir propriedades rurais incríveis ou cadastre
              seu empreendimento para alcançar novos visitantes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/propriedades">Explorar Propriedades</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/cadastro">Cadastrar-se</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
