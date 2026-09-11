"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ActivityCard } from "@/components/activity-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin } from "lucide-react"
import { loadStore } from "@/lib/client-store"
import type { Atividade, Empreendedor, Propriedade } from "@/lib/types"

const tiposLabels: Record<string, string> = {
  passeio: "Passeio",
  workshop: "Workshop",
  gastronomia: "Gastronomia",
  aventura: "Aventura",
  cultural: "Cultural",
  infantil: "Infantil"
}

const tipos = ["Todos", "passeio", "workshop", "gastronomia", "aventura", "cultural", "infantil"]

export default function AtividadesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("Todos")
  const [ordenacao, setOrdenacao] = useState("data")

  const [todasAtividades, setTodasAtividades] = useState<Atividade[]>([])
  const [empreendedores, setEmpreendedores] = useState<Empreendedor[]>([])
  const [properties, setProperties] = useState<Propriedade[]>([])
  const [reservas, setReservas] = useState<ReturnType<typeof loadStore>["reservas"]>([])
  const [hojeIso, setHojeIso] = useState("")

  useEffect(() => {
    const now = new Date()
    setHojeIso(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`)
    const refresh = () => {
      const store = loadStore()
      setTodasAtividades(store.atividades)
      setEmpreendedores(store.empreendedores)
      setProperties(store.propriedades)
      setReservas(store.reservas)
    }
    refresh()
    window.addEventListener("turismo-rural-store", refresh)
    return () => window.removeEventListener("turismo-rural-store", refresh)
  }, [])

  const allActivities = useMemo(() => {
    return todasAtividades
      .filter(ativ => ativ.ativo && !!properties.find(p => p.id === ativ.propriedadeId && p.ativo))
      .filter(ativ => !ativ.dataEvento || !hojeIso || ativ.dataEvento >= hojeIso)
      .map(ativ => {
      const emp = empreendedores.find(e => e.id === ativ.empreendedorId)
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
        spotsAvailable: Math.max(0, ativ.vagas - reservas
          .filter(r => r.atividadeId === ativ.id && (r.status === "pendente" || r.status === "confirmada"))
          .filter(r => !ativ.dataEvento || r.dataInicio === ativ.dataEvento)
          .reduce((sum, r) => sum + r.pessoas, 0)),
        type: ativ.tipo,
      }
    })
  }, [todasAtividades, empreendedores, properties, reservas, hojeIso])

  const filteredActivities = allActivities.filter((activity) => {
    const matchesSearch = 
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTipo = tipoFiltro === "Todos" || activity.type === tipoFiltro
    return matchesSearch && matchesTipo
  })

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    switch (ordenacao) {
      case "preco-menor":
        return a.price - b.price
      case "preco-maior":
        return b.price - a.price
      case "vagas":
        return b.spotsAvailable - a.spotsAvailable
      default:
        if (a.date === "Sob consulta") return 1
        if (b.date === "Sob consulta") return -1
        return a.date.localeCompare(b.date)
    }
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Atividades e Eventos
            </h1>
            <p className="text-muted-foreground">
              Descubra experiências únicas no campo e na natureza
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por atividade, propriedade ou cidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                {tipos.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo === "Todos" ? "Todos" : tiposLabels[tipo] || tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={ordenacao} onValueChange={setOrdenacao}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="data">Próximas datas</SelectItem>
                <SelectItem value="preco-menor">Menor preço</SelectItem>
                <SelectItem value="preco-maior">Maior preço</SelectItem>
                <SelectItem value="vagas">Mais vagas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {sortedActivities.length} atividades encontradas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedActivities.map((activity) => (
              <ActivityCard key={activity.id} {...activity} />
            ))}
          </div>

          {sortedActivities.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhuma atividade encontrada
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou buscar por outra atividade.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
