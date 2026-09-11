"use client"

import { Suspense, useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal, MapPin } from "lucide-react"
import { loadStore } from "@/lib/client-store"
import type { Empreendedor, Propriedade } from "@/lib/types"

const tiposPropriedade = ["fazenda", "sitio", "chacara", "pousada", "camping"]

const tiposLabels: Record<string, string> = {
  fazenda: "Fazenda",
  sitio: "Sítio",
  chacara: "Chácara",
  pousada: "Pousada",
  camping: "Camping"
}

const amenidades = [
  "Piscina",
  "Wi-Fi",
  "Café da manhã",
  "Trilhas",
  "Churrasqueira",
  "Estacionamento"
]

function PropriedadesContent() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(queryParam)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedTipos, setSelectedTipos] = useState<string[]>([])
  const [ordenacao, setOrdenacao] = useState("relevancia")

  // Atualiza o search quando a URL muda
  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam)
    }
  }, [queryParam])

  const [todasPropriedades, setTodasPropriedades] = useState<Propriedade[]>([])
  const [empreendedores, setEmpreendedores] = useState<Empreendedor[]>([])

  useEffect(() => {
    const refresh = () => {
      const store = loadStore()
      setTodasPropriedades(store.propriedades)
      setEmpreendedores(store.empreendedores)
    }
    refresh()
    window.addEventListener("turismo-rural-store", refresh)
    return () => window.removeEventListener("turismo-rural-store", refresh)
  }, [])

  const allProperties = useMemo(() => {
    return todasPropriedades.filter(prop => prop.ativo).map(prop => {
      const emp = empreendedores.find(e => e.id === prop.empreendedorId)

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
        tags: [tiposLabels[prop.tipo] || prop.tipo, emp?.cidade || ""],
        tipo: prop.tipo,
        comodidades: prop.comodidades
      }
    })
  }, [todasPropriedades, empreendedores])

  const filteredProperties = allProperties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPrice =
      property.price >= priceRange[0] &&
      property.price <= priceRange[1]

    const matchesTipo =
      selectedTipos.length === 0 ||
      selectedTipos.includes(property.tipo)

    return matchesSearch && matchesPrice && matchesTipo
  })

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (ordenacao) {
      case "preco-menor":
        return a.price - b.price

      case "preco-maior":
        return b.price - a.price

      case "avaliacao":
        return b.rating - a.rating

      default:
        return b.reviews - a.reviews
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
              Propriedades Rurais
            </h1>

            <p className="text-muted-foreground">
              Encontre o destino perfeito para sua próxima aventura no campo
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">

            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

              <Input
                type="text"
                placeholder="Buscar por cidade ou nome da propriedade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={ordenacao} onValueChange={setOrdenacao}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="relevancia">
                  Mais relevantes
                </SelectItem>

                <SelectItem value="preco-menor">
                  Menor preço
                </SelectItem>

                <SelectItem value="preco-maior">
                  Maior preço
                </SelectItem>

                <SelectItem value="avaliacao">
                  Melhor avaliação
                </SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                </Button>
              </SheetTrigger>

              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>

                  <SheetDescription>
                    Refine sua busca com os filtros abaixo
                  </SheetDescription>
                </SheetHeader>

                <div className="py-6 space-y-6">

                  <div className="space-y-4">
                    <Label>Faixa de Preço (por noite)</Label>

                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500}
                      min={0}
                      step={10}
                    />

                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>R$ {priceRange[0]}</span>
                      <span>R$ {priceRange[1]}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Tipo de Propriedade</Label>

                    <div className="space-y-2">
                      {tiposPropriedade.map((tipo) => (
                        <div key={tipo} className="flex items-center gap-2">

                          <Checkbox
                            id={tipo}
                            checked={selectedTipos.includes(tipo)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTipos([
                                  ...selectedTipos,
                                  tipo
                                ])
                              } else {
                                setSelectedTipos(
                                  selectedTipos.filter(
                                    t => t !== tipo
                                  )
                                )
                              }
                            }}
                          />

                          <Label
                            htmlFor={tipo}
                            className="font-normal"
                          >
                            {tiposLabels[tipo]}
                          </Label>

                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Comodidades</Label>

                    <div className="space-y-2">
                      {amenidades.map((amenidade) => (
                        <div
                          key={amenidade}
                          className="flex items-center gap-2"
                        >

                          <Checkbox id={amenidade} />

                          <Label
                            htmlFor={amenidade}
                            className="font-normal"
                          >
                            {amenidade}
                          </Label>

                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">
                    Aplicar Filtros
                  </Button>

                </div>
              </SheetContent>
            </Sheet>

          </div>

          {/* Results */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {sortedProperties.length} propriedades encontradas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
              />
            ))}
          </div>

          {sortedProperties.length === 0 && (
            <div className="text-center py-12">

              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />

              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhuma propriedade encontrada
              </h3>

              <p className="text-muted-foreground">
                Tente ajustar os filtros ou buscar por outra região.
              </p>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PropriedadesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">
            Carregando propriedades...
          </p>
        </div>
      }
    >
      <PropriedadesContent />
    </Suspense>
  )
}
