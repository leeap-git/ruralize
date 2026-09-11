import { TreePine, Calendar, MessageSquare, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: TreePine,
    title: "Propriedades Rurais",
    description: "Encontre fazendas, sítios e pousadas rurais com hospedagem, alimentação e atrações únicas.",
  },
  {
    icon: Calendar,
    title: "Reservas Online",
    description: "Faça suas reservas de forma simples e segura, diretamente pela plataforma.",
  },
  {
    icon: MessageSquare,
    title: "Contato Direto",
    description: "Envie mensagens e tire dúvidas diretamente com os empreendedores rurais.",
  },
  {
    icon: BarChart3,
    title: "Para Empreendedores",
    description: "Gerencie suas propriedades, atividades e reservas com relatórios completos.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como Funciona
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Nossa plataforma conecta visitantes a empreendedores rurais, facilitando a descoberta de experiências autênticas no campo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow bg-card">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
