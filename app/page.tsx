"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { PropertyCard } from "@/components/property-card"
import { ActivityCard } from "@/components/activity-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { loadStore } from "@/lib/client-store"
import type { Propriedade, Atividade, Empreendedor } from "@/lib/types"
import type { Store } from "@/lib/client-store"

export default function HomePage() {
  const [store, setStore] = useState<Store | null>(null)
  useEffect(() => {
    const refresh = () => setStore(loadStore())
    refresh()
    window.addEventListener("turismo-rural-store", refresh)
    return () => window.removeEventListener("turismo-rural-store", refresh)
  }, [])

  const hoje = new Date()
  const hojeIso = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`

  const propriedadesDestaque = useMemo(() => (store?.propriedades ?? []).filter(p => p.ativo).sort((a,b) => (b.avaliacao - a.avaliacao) || (b.totalAvaliacoes - a.totalAvaliacoes)).slice(0, 3), [store])
  const atividadesProximas = useMemo(() => (store?.atividades ?? [])
    .filter(a => a.ativo)
    .filter(a => store?.propriedades.some(p => p.id === a.propriedadeId && p.ativo))
    .filter(a => !a.dataEvento || a.dataEvento >= hojeIso)
    .sort((a,b) => (a.dataEvento || "9999-99-99").localeCompare(b.dataEvento || "9999-99-99"))
    .slice(0, 3), [store, hojeIso])

  const featuredProperties = propriedadesDestaque.map(prop => {
    const emp = store?.empreendedores.find(e => e.id === prop.empreendedorId)
    return {
      id: prop.id,
      name: prop.nome,
      location: `${prop.cidade}, ${prop.estado}`,
      description: prop.descricao.substring(0, 150) + "...",
      image: prop.imagens[0] || "/placeholder.jpg",
      rating: prop.avaliacao,
      reviews: prop.totalAvaliacoes,
      price: prop.preco,
      capacity: prop.capacidade,
      rooms: Math.ceil(prop.capacidade / 3),
      tags: [prop.tipo.charAt(0).toUpperCase() + prop.tipo.slice(1), emp?.cidade || ""],
    }
  })

  const upcomingActivities = atividadesProximas.map(ativ => {
    const emp = store?.empreendedores.find(e => e.id === ativ.empreendedorId)
    return {
      id: ativ.id,
      name: ativ.nome,
      property: emp?.nomeEmpresa || "",
      location: emp ? `${emp.cidade}, ${emp.estado}` : "",
      description: ativ.descricao.substring(0, 100) + "...",
      image: ativ.imagem || "/placeholder.jpg",
      date: ativ.dataEvento || "Sob consulta",
      time: ativ.horario || "",
      price: ativ.preco,
      spots: ativ.vagas,
      spotsAvailable: Math.max(0, ativ.vagas - (store?.reservas ?? [])
        .filter(r => r.atividadeId === ativ.id && (r.status === "pendente" || r.status === "confirmada"))
        .filter(r => !ativ.dataEvento || r.dataInicio === ativ.dataEvento)
        .reduce((sum, r) => sum + r.pessoas, 0)),
      type: ativ.tipo.charAt(0).toUpperCase() + ativ.tipo.slice(1),
    }
  })
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        
        <FeaturesSection />

        {/* Propriedades em Destaque */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Propriedades em Destaque
                </h2>
                <p className="text-muted-foreground">
                  Conheça as propriedades rurais mais bem avaliadas pelos visitantes
                </p>
              </div>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link href="/propriedades">
                  Ver todas
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button variant="outline" asChild>
                <Link href="/propriedades">
                  Ver todas as propriedades
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Atividades e Eventos */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Próximas Atividades
                </h2>
                <p className="text-muted-foreground">
                  Experiências únicas aguardando por você
                </p>
              </div>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link href="/atividades">
                  Ver todas
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingActivities.map((activity) => (
                <ActivityCard key={activity.id} {...activity} />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button variant="outline" asChild>
                <Link href="/atividades">
                  Ver todas as atividades
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Tem uma propriedade rural?
            </h2>
            <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8 text-pretty">
              Cadastre-se gratuitamente e comece a divulgar sua propriedade, atividades e eventos para milhares de visitantes interessados em Ruralize.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/cadastro">
                  Cadastrar Propriedade
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link href="/como-funciona">
                  Saiba Mais
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
