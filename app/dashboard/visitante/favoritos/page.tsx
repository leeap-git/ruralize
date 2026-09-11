"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { loadStore, toggleFavorito } from "@/lib/client-store"
import type { Favorito, Propriedade } from "@/lib/types"

export default function Page() {
  const { user } = useAuth()
  const [data, setData] = useState<Favorito[]>([])
  const [props, setProps] = useState<Propriedade[]>([])

  const refresh = () => {
    const store = loadStore()
    setData(store.favoritos)
    setProps(store.propriedades)
  }

  useEffect(() => {
    refresh()
    window.addEventListener("turismo-rural-store", refresh)
    return () => window.removeEventListener("turismo-rural-store", refresh)
  }, [])

  const mine = data.filter((f) => f.usuarioId === user?.id)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold mb-6">Meus Favoritos</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mine.map((favorite) => {
              const property = props.find((p) => p.id === favorite.propriedadeId)
              if (!property) return null

              return (
                <Card key={favorite.id}>
                  <img src={property.imagens[0] || "/placeholder.jpg"} alt={property.nome} className="h-40 w-full object-cover" />
                  <CardHeader><CardTitle>{property.nome}</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{property.cidade}, {property.estado}</p>
                    <Button variant="outline" onClick={() => user && toggleFavorito(user.id, property.id)}>
                      Remover dos favoritos
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
            {!mine.length && <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhum favorito ainda.</CardContent></Card>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
