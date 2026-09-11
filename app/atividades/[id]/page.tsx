"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Clock, Users, MapPin, Calendar, Star } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { loadStore } from "@/lib/client-store"
import type { Atividade, Propriedade } from "@/lib/types"

export default function AtividadeDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const [activity, setActivity] = useState<Atividade | null>(null)
  const [property, setProperty] = useState<Propriedade | null>(null)
  const [spotsAvailable, setSpotsAvailable] = useState(0)
  const [hojeIso, setHojeIso] = useState("")

  useEffect(() => {
    const refresh = () => {
      const now = new Date()
      const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
      setHojeIso(todayIso)
      const store = loadStore()
      const candidate = store.atividades.find((a) => a.id === id && a.ativo) || null
      const linkedProperty = candidate ? store.propriedades.find((p) => p.id === candidate.propriedadeId && p.ativo) || null : null
      const current = candidate && linkedProperty ? candidate : null
      setActivity(current)
      setProperty(linkedProperty)
      setSpotsAvailable(current
        ? Math.max(0, current.vagas - store.reservas
          .filter((r) => r.atividadeId === current.id && (r.status === "pendente" || r.status === "confirmada"))
          .filter((r) => !current.dataEvento || r.dataInicio === current.dataEvento)
          .reduce((sum, r) => sum + r.pessoas, 0))
        : 0)
    }
    refresh()
    window.addEventListener("turismo-rural-store", refresh)
    return () => window.removeEventListener("turismo-rural-store", refresh)
  }, [id])

  if (!activity) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <p className="mb-4 text-muted-foreground">Atividade não encontrada ou indisponível.</p>
          <Button asChild variant="outline"><Link href="/atividades"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Link></Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Link href="/atividades" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />Voltar às atividades
          </Link>
        </div>

        <section className="container mx-auto px-4 pb-12">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-[16/8] rounded-xl overflow-hidden bg-muted">
                <img src={activity.imagem || "/placeholder.jpg"} alt={activity.nome} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-wrap gap-2"><Badge>{activity.tipo}</Badge>{property && <Badge variant="outline">{property.nome}</Badge>}</div>
              <h1 className="text-4xl font-bold">{activity.nome}</h1>
              {property && <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />{property.cidade}, {property.estado}</p>}
              <div className="flex flex-wrap gap-5 text-sm">
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{activity.duracao}</span>
                <span className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" />{spotsAvailable}/{activity.vagas} vagas disponíveis</span>
                {activity.dataEvento && <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{activity.dataEvento}{activity.horario ? ` às ${activity.horario}` : ""}</span>}
              </div>
              <p className="text-muted-foreground whitespace-pre-wrap">{activity.descricao}</p>

              {!!activity.inclui.length && (
                <Card><CardHeader><CardTitle>O que está incluso</CardTitle></CardHeader><CardContent><ul className="list-disc pl-5 space-y-1">{activity.inclui.map((item) => <li key={item}>{item}</li>)}</ul></CardContent></Card>
              )}
              {!!activity.requisitos.length && (
                <Card><CardHeader><CardTitle>Requisitos</CardTitle></CardHeader><CardContent><ul className="list-disc pl-5 space-y-1">{activity.requisitos.map((item) => <li key={item}>{item}</li>)}</ul></CardContent></Card>
              )}
            </div>

            <Card className="h-fit lg:sticky lg:top-6">
              <CardHeader>
                <CardTitle>R$ {activity.preco.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ pessoa</span></CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {spotsAvailable === 0 || (activity.dataEvento && hojeIso && activity.dataEvento < hojeIso) ? (
                  <Button className="w-full" size="lg" disabled>Indisponível</Button>
                ) : (
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/dashboard/visitante/reservas/nova?atividadeId=${activity.id}`}>Reservar agora</Link>
                  </Button>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Star className="h-4 w-4" />Atividade cadastrada pelo empreendedor</div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
