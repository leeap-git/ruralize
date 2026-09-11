import Link from "next/link"
import { ArrowLeft, CalendarCheck, Compass, HeartHandshake, Search } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const steps = [
  { icon: Search, title: "Encontre experiências", text: "Pesquise propriedades e atividades de Ruralize por destino e tipo de experiência." },
  { icon: Compass, title: "Escolha seu destino", text: "Consulte detalhes, preços, capacidade, comodidades e informações da propriedade." },
  { icon: CalendarCheck, title: "Faça sua reserva", text: "Selecione as datas, informe a quantidade de pessoas e acompanhe o status da reserva no painel." },
  { icon: HeartHandshake, title: "Viva a experiência", text: "Após a viagem, você pode avaliar o destino e registrar sua experiência na plataforma." },
]

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Voltar ao início</Link>
            </Button>
            <h1 className="text-4xl font-serif font-bold">Como funciona</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">Veja como encontrar uma experiência, reservar sua viagem e acompanhar tudo pelo Ruralize.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <Card key={title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">{index + 1}</div>
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle>{title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent><p className="text-muted-foreground">{text}</p></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
