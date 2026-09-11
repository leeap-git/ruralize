"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Plus, Search, Edit, Trash2, RotateCcw, Eye, MapPin } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { deletePropriedade, loadStore } from "@/lib/client-store"
import type { Propriedade } from "@/lib/types"

export default function Page() {
  const { user, isLoading } = useAuth()
  const [props, setProps] = useState<Propriedade[]>([])
  const [busca, setBusca] = useState("")

  const refresh = () => setProps(loadStore().propriedades)

  useEffect(() => {
    refresh()
    window.addEventListener("turismo-rural-store", refresh)
    return () => window.removeEventListener("turismo-rural-store", refresh)
  }, [])

  const list = useMemo(() => {
    const query = busca.trim().toLowerCase()
    return props
      .filter((p) => p.empreendedorId === user?.id)
      .filter((p) => !query || `${p.nome} ${p.cidade} ${p.estado}`.toLowerCase().includes(query))
  }, [props, user?.id, busca])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold">Minhas Propriedades</h1>
              <p className="text-muted-foreground">Cadastre, visualize, edite, desative e reative suas propriedades.</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/empreendedor/propriedades/nova">
                <Plus className="mr-2 h-4 w-4" />Nova Propriedade
              </Link>
            </Button>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input className="pl-10" placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>

          {isLoading ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">Carregando...</CardContent></Card>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <Card key={p.id} className="overflow-hidden">
                  <img src={p.imagens[0] || "/placeholder.jpg"} alt={p.nome} className="h-44 w-full object-cover" />
                  <CardHeader>
                    <div className="flex justify-between gap-2">
                      <CardTitle>{p.nome}</CardTitle>
                      <Badge variant={p.ativo ? "default" : "secondary"}>{p.ativo ? "Ativa" : "Inativa"}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex gap-1">
                      <MapPin className="h-4 w-4" />{p.cidade}, {p.estado}
                    </p>
                  </CardHeader>
                  <CardContent className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/propriedades/${p.id}`}><Eye className="mr-1 h-4 w-4" />Ver</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/empreendedor/propriedades/${p.id}`}><Edit className="mr-1 h-4 w-4" />Editar</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePropriedade(p.id, user?.id)}
                      aria-label={p.ativo ? "Desativar propriedade" : "Reativar propriedade"}
                    >
                      {p.ativo ? <Trash2 className="h-4 w-4 text-destructive" /> : <RotateCcw className="h-4 w-4" />}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && !list.length && (
            <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhuma propriedade encontrada.</CardContent></Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
