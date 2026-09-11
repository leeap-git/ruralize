"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { crudReserva, loadStore } from "@/lib/client-store"
import type { Propriedade, Atividade } from "@/lib/types"

function calcularNoites(inicio: string, fim: string): number {
  if (!inicio || !fim) return 1
  const start = new Date(`${inicio}T00:00:00`)
  const end = new Date(`${fim}T00:00:00`)
  const diff = Math.ceil((end.getTime() - start.getTime()) / 86400000)
  return Math.max(1, diff)
}

function NovaReservaContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialPropertyId = searchParams.get("propriedadeId") || ""
  const initialActivityId = searchParams.get("atividadeId") || ""
  const [props, setProps] = useState<Propriedade[]>([])
  const [activities, setActivities] = useState<Atividade[]>([])
  const [f, setF] = useState({
    propriedadeId: "",
    atividadeId: "",
    dataInicio: "",
    dataFim: "",
    pessoas: "1",
    valorTotal: "",
  })

  useEffect(() => {
    const store = loadStore()
    const active = store.propriedades.filter((p) => p.ativo)
    const activeActivities = store.atividades.filter((a) => a.ativo && store.propriedades.some((p) => p.id === a.propriedadeId && p.ativo))
    setProps(active)
    setActivities(activeActivities)
    setF((current) => ({ ...current, propriedadeId: current.propriedadeId || initialPropertyId || "", atividadeId: current.atividadeId || initialActivityId || "" }))
  }, [initialPropertyId, initialActivityId])

  const property = props.find((p) => p.id === f.propriedadeId)
  const activity = activities.find((a) => a.id === f.atividadeId)
  const hojeIso = useMemo(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
  }, [])
  const noites = useMemo(() => calcularNoites(f.dataInicio, f.dataFim), [f.dataInicio, f.dataFim])

  const totalCalculado = (property ? property.preco * Math.max(1, Number(f.pessoas) || 1) * noites : 0) + (activity ? activity.preco * Math.max(1, Number(f.pessoas) || 1) : 0)

  const set = (key: string, value: string) => setF((x) => ({ ...x, [key]: value }))

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || (!property && !activity)) return

    if (!f.dataInicio) { alert("Informe a data de entrada."); return }
    if (property && f.dataFim && f.dataFim <= f.dataInicio) { alert("A data de saída deve ser posterior à entrada."); return }
    if (activity && activity.dataEvento && f.dataInicio !== activity.dataEvento) { alert(`Esta atividade acontece em ${activity.dataEvento}.`); return }
    const pessoas = Number(f.pessoas)
    const maxPeople = property?.capacidade ?? activity?.vagas ?? 0
    if (!Number.isInteger(pessoas) || pessoas < 1 || pessoas > maxPeople) { alert("Número de pessoas inválido para este item."); return }

    try {
      crudReserva(
        null,
        {
          propriedadeId: property?.id,
          atividadeId: activity?.id,
          dataInicio: f.dataInicio,
          dataFim: f.dataFim || undefined,
          pessoas,
          valorTotal: totalCalculado,
          status: "pendente",
        },
        user.id,
      )
      router.push("/dashboard/visitante/reservas")
    } catch (error) {
      alert(error instanceof Error ? error.message : "Não foi possível criar a reserva.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader><CardTitle>Nova Reserva</CardTitle></CardHeader>
            <CardContent>
              {!props.length && !activities.length ? (
                <p className="text-muted-foreground">Nenhuma propriedade disponível no momento.</p>
              ) : (
                <form className="space-y-4" onSubmit={save}>
                  {!initialActivityId && <div>
                    <Label>Propriedade</Label>
                    <Select value={f.propriedadeId} onValueChange={(value) => set("propriedadeId", value)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{props.map((p) => <SelectItem key={p.id} value={p.id}>{p.nome} — R$ {p.preco.toFixed(2)}/noite</SelectItem>)}</SelectContent>
                    </Select>
                  </div>}
                  {activity && <div className="rounded-lg border p-3"><p className="font-medium">{activity.nome}</p><p className="text-sm text-muted-foreground">R$ {activity.preco.toFixed(2)} por pessoa</p></div>}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div><Label>Entrada</Label><Input type="date" required min={hojeIso} value={f.dataInicio} onChange={(e) => set("dataInicio", e.target.value)} /></div>
                    {property ? (
                      <div><Label>Saída</Label><Input type="date" min={f.dataInicio || undefined} value={f.dataFim} onChange={(e) => set("dataFim", e.target.value)} /></div>
                    ) : (
                      <div><Label>Data da atividade</Label><Input type="date" value={f.dataInicio} onChange={(e) => set("dataInicio", e.target.value)} disabled={Boolean(activity?.dataEvento)} /><p className="text-xs text-muted-foreground mt-1">Atividades não utilizam data de saída.</p></div>
                    )}
                    <div><Label>Pessoas</Label><Input type="number" min="1" max={property?.capacidade ?? activity?.vagas} required value={f.pessoas} onChange={(e) => set("pessoas", e.target.value)} /></div>
                  </div>
                  <div className="rounded-lg border p-4 bg-muted/30">
                    {property && <div className="flex justify-between"><span>Diária</span><span>R$ {property.preco.toFixed(2)}</span></div>}
                    {activity && <div className="flex justify-between"><span>Atividade</span><span>R$ {activity.preco.toFixed(2)}</span></div>}
                    {property && <div className="flex justify-between"><span>Noites</span><span>{noites}</span></div>}
                    <div className="flex justify-between font-semibold mt-2 pt-2 border-t"><span>Total</span><span>R$ {totalCalculado.toFixed(2)}</span></div>
                  </div>
                  <Button type="submit">Criar reserva</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}


export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando formulário...</div>}>
      <NovaReservaContent />
    </Suspense>
  )
}
