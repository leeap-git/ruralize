"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { loadStore, crudReserva, deleteReserva } from "@/lib/client-store"
import type { Propriedade, Atividade, Reserva } from "@/lib/types"

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

  const mine = data.filter((r) => r.usuarioId === user?.id)

  const cancel = (id: string) => {
    if (!user) return
    try { crudReserva(id, { status: "cancelada" }, user.id) } catch (error) {
      alert(error instanceof Error ? error.message : "Não foi possível cancelar a reserva.")
    }
  }

  const remove = (id: string) => {
    if (!user) return
    if (!window.confirm("Excluir esta reserva?")) return
    try { deleteReserva(id, user.id) } catch (error) {
      alert(error instanceof Error ? error.message : "Não foi possível excluir a reserva.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold">Minhas Reservas</h1>
              <p className="text-muted-foreground">Consulte, cancele ou exclua suas reservas.</p>
            </div>
            <Button asChild><Link href="/dashboard/visitante/reservas/nova">Nova Reserva</Link></Button>
          </div>

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
                <CardContent>
                  <p className="mb-3">{r.dataInicio}{r.dataFim ? ` até ${r.dataFim}` : ""} · {r.pessoas} pessoa(s) · R$ {r.valorTotal.toFixed(2)}</p>
                  <div className="flex gap-2">
                    {r.status !== "cancelada" && <Button variant="outline" onClick={() => cancel(r.id)}>Cancelar</Button>}
                    <Button variant="destructive" onClick={() => remove(r.id)}>Excluir</Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {!mine.length && <Card><CardContent className="py-12 text-center text-muted-foreground">Você ainda não possui reservas.</CardContent></Card>}
        </div>
      </main>
      <Footer />
    </div>
  )
}
