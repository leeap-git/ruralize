"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { loadStore, crudReserva, deleteReserva } from "@/lib/client-store"
import { useAuth } from "@/contexts/auth-context"
import type { Atividade, Propriedade, Reserva } from "@/lib/types"

export default function Page() {
  const { user } = useAuth()
  const [data, setData] = useState<Reserva[]>([])
  const [props, setProps] = useState<Propriedade[]>([])
  const [atividades, setAtividades] = useState<Atividade[]>([])

  const refresh = () => {
    const store = loadStore()
    setData(store.reservas)
    setProps(store.propriedades)
    setAtividades(store.atividades)
  }

  useEffect(() => {
    refresh()
    window.addEventListener("turismo-rural-store", refresh)
    return () => window.removeEventListener("turismo-rural-store", refresh)
  }, [])

  const mine = data.filter((r) => {
    const property = props.find((p) => p.id === r.propriedadeId)
    const activity = atividades.find((a) => a.id === r.atividadeId)
    return property?.empreendedorId === user?.id || activity?.empreendedorId === user?.id
  })

  const changeStatus = (r: Reserva, status: "confirmada" | "cancelada") => {
    if (!user) return
    try { crudReserva(r.id, { status }, user.id) } catch (error) {
      alert(error instanceof Error ? error.message : "Não foi possível alterar a reserva.")
    }
  }

  const remove = (id: string) => {
    if (!user || !window.confirm("Excluir esta reserva?")) return
    try { deleteReserva(id, user.id) } catch (error) {
      alert(error instanceof Error ? error.message : "Não foi possível excluir a reserva.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold">Reservas</h1>
          <p className="text-muted-foreground mb-6">Gerencie o status ou exclua reservas da sua propriedade.</p>

          <div className="grid gap-4">
            {mine.map((r) => {
              const property = props.find((p) => p.id === r.propriedadeId)
              const activity = atividades.find((a) => a.id === r.atividadeId)
              return (
                <Card key={r.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>{property?.nome || activity?.nome || "Reserva"}</CardTitle>
                      <Badge>{r.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p>Data: {r.dataInicio} · Pessoas: {r.pessoas} · Total: R$ {r.valorTotal.toFixed(2)}</p>
                    <div className="flex gap-2 flex-wrap">
                      {r.status !== "confirmada" && r.status !== "concluida" && <Button size="sm" onClick={() => changeStatus(r, "confirmada")}>Confirmar</Button>}
                      {r.status !== "cancelada" && <Button size="sm" variant="outline" onClick={() => changeStatus(r, "cancelada")}>Cancelar</Button>}
                      <Button size="sm" variant="destructive" onClick={() => remove(r.id)}>Excluir</Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {!mine.length && <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhuma reserva encontrada.</CardContent></Card>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
