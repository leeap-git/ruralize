"use client"

import { useEffect, useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { BarChart3, CalendarDays, DollarSign, Filter, Users, UserRoundCheck } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { loadStore, type Store } from "@/lib/client-store"
import type { Reserva } from "@/lib/types"

type PeriodPreset = "all" | "today" | "7d" | "30d" | "custom"

function toIsoLocal(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function formatDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const [year, month, day] = value.split("-")
  return `${day}/${month}/${year}`
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function statusLabel(status: Reserva["status"]) {
  return {
    pendente: "Pendente",
    confirmada: "Confirmada",
    cancelada: "Cancelada",
    concluida: "Concluída",
  }[status]
}

export default function RelatoriosPage() {
  const { user } = useAuth()
  const [store, setStore] = useState<Store | null>(null)
  const [preset, setPreset] = useState<PeriodPreset>("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    const refresh = () => setStore(loadStore())
    refresh()
    window.addEventListener("turismo-rural-store", refresh)
    return () => window.removeEventListener("turismo-rural-store", refresh)
  }, [])

  const owned = useMemo(() => {
    const properties = (store?.propriedades ?? []).filter((property) => property.empreendedorId === user?.id)
    const propertyIds = new Set(properties.map((property) => property.id))
    const activities = (store?.atividades ?? []).filter(
      (activity) => activity.empreendedorId === user?.id || propertyIds.has(activity.propriedadeId),
    )
    const activityIds = new Set(activities.map((activity) => activity.id))
    const reservations = (store?.reservas ?? []).filter(
      (reservation) =>
        (reservation.propriedadeId && propertyIds.has(reservation.propriedadeId)) ||
        (reservation.atividadeId && activityIds.has(reservation.atividadeId)),
    )
    return { properties, activities, reservations }
  }, [store, user?.id])

  const range = useMemo(() => {
    if (preset === "all") return { start: "", end: "" }
    const now = new Date()
    const today = toIsoLocal(now)
    if (preset === "today") return { start: today, end: today }
    if (preset === "7d" || preset === "30d") {
      const days = preset === "7d" ? 6 : 29
      const start = new Date(now)
      start.setDate(start.getDate() - days)
      return { start: toIsoLocal(start), end: today }
    }
    return { start: startDate, end: endDate }
  }, [preset, startDate, endDate])

  const reservations = useMemo(() => {
    return owned.reservations
      .filter((reservation) => !range.start || reservation.createdAt >= range.start)
      .filter((reservation) => !range.end || reservation.createdAt <= range.end)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [owned.reservations, range])

  const metrics = useMemo(() => {
    const paid = reservations.filter((reservation) => reservation.status === "confirmada" || reservation.status === "concluida")
    return {
      reservations: reservations.length,
      people: reservations.filter((reservation) => reservation.status !== "cancelada").reduce((sum, reservation) => sum + reservation.pessoas, 0),
      uniqueVisitors: new Set(reservations.filter((reservation) => reservation.status !== "cancelada").map((reservation) => reservation.usuarioId)).size,
      revenue: paid.reduce((sum, reservation) => sum + reservation.valorTotal, 0),
    }
  }, [reservations])

  const chartData = useMemo(() => {
    const grouped = new Map<string, { date: string; reservas: number; pessoas: number; receita: number }>()
    for (const reservation of reservations) {
      const current = grouped.get(reservation.createdAt) ?? { date: reservation.createdAt, reservas: 0, pessoas: 0, receita: 0 }
      current.reservas += 1
      if (reservation.status !== "cancelada") current.pessoas += reservation.pessoas
      if (reservation.status === "confirmada" || reservation.status === "concluida") current.receita += reservation.valorTotal
      grouped.set(reservation.createdAt, current)
    }
    return [...grouped.values()].sort((a, b) => a.date.localeCompare(b.date)).map((item) => ({ ...item, label: formatDate(item.date).slice(0, 5) }))
  }, [reservations])

  const propertyRows = useMemo(() => {
    return owned.properties
      .map((property) => {
        const propertyActivityIds = new Set(owned.activities.filter((activity) => activity.propriedadeId === property.id).map((activity) => activity.id))
        const related = reservations.filter(
          (reservation) => reservation.propriedadeId === property.id || (reservation.atividadeId && propertyActivityIds.has(reservation.atividadeId)),
        )
        return {
          id: property.id,
          name: property.nome,
          reservations: related.length,
          people: related.filter((reservation) => reservation.status !== "cancelada").reduce((sum, reservation) => sum + reservation.pessoas, 0),
          revenue: related
            .filter((reservation) => reservation.status === "confirmada" || reservation.status === "concluida")
            .reduce((sum, reservation) => sum + reservation.valorTotal, 0),
        }
      })
      .sort((a, b) => b.reservations - a.reservations)
  }, [owned.activities, owned.properties, reservations])

  const byStatus = (status: Reserva["status"]) => reservations.filter((reservation) => reservation.status === status).length

  const clearFilters = () => {
    setPreset("all")
    setStartDate("")
    setEndDate("")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-3xl font-serif font-bold">Relatórios</h1>
                {user?.tipo === "empreendedor" && user.isAdmin && <Badge>ADM</Badge>}
              </div>
              <p className="text-muted-foreground mt-1">
                Movimentação das propriedades e atividades vinculadas a esta conta.
              </p>
            </div>
            <Badge variant="secondary" className="w-fit">
              {reservations.length} reserva(s) no período
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Filter className="h-5 w-5" />Período</CardTitle>
              <CardDescription>O filtro usa a data em que a reserva foi criada, mostrando a movimentação da conta.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-[220px_1fr_1fr_auto] md:items-end">
              <div className="space-y-2">
                <Label>Filtro rápido</Label>
                <Select value={preset} onValueChange={(value) => setPreset(value as PeriodPreset)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todo o período</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>De</Label>
                <Input type="date" value={preset === "custom" ? startDate : range.start} disabled={preset !== "custom"} onChange={(event) => setStartDate(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Até</Label>
                <Input type="date" value={preset === "custom" ? endDate : range.end} disabled={preset !== "custom"} onChange={(event) => setEndDate(event.target.value)} />
              </div>
              <Button variant="outline" onClick={clearFilters}>Limpar</Button>
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div><p className="text-sm text-muted-foreground">Reservas</p><p className="text-3xl font-bold">{metrics.reservations}</p></div>
                <CalendarDays className="h-7 w-7 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div><p className="text-sm text-muted-foreground">Pessoas reservadas</p><p className="text-3xl font-bold">{metrics.people}</p></div>
                <Users className="h-7 w-7 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div><p className="text-sm text-muted-foreground">Visitantes únicos</p><p className="text-3xl font-bold">{metrics.uniqueVisitors}</p></div>
                <UserRoundCheck className="h-7 w-7 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div><p className="text-sm text-muted-foreground">Receita confirmada</p><p className="text-2xl font-bold">{formatCurrency(metrics.revenue)}</p></div>
                <DollarSign className="h-7 w-7 text-primary" />
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Movimentação por dia</CardTitle>
                <CardDescription>Quantidade de reservas criadas em cada dia do período selecionado.</CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length ? (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                        <Tooltip
                          labelFormatter={(_, payload) => payload?.[0]?.payload?.date ? formatDate(payload[0].payload.date) : ""}
                          formatter={(value, name) => [value, name === "reservas" ? "Reservas" : name]}
                        />
                        <Bar dataKey="reservas" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground text-center px-6">
                    Nenhuma movimentação encontrada para este período.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status das reservas</CardTitle>
                <CardDescription>Distribuição no período selecionado.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(["pendente", "confirmada", "concluida", "cancelada"] as const).map((status) => (
                  <div key={status} className="flex items-center justify-between rounded-lg border p-3">
                    <span>{statusLabel(status)}</span>
                    <Badge variant={status === "cancelada" ? "outline" : "secondary"}>{byStatus(status)}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Desempenho por propriedade</CardTitle>
              <CardDescription>Reservas, pessoas e receita ligadas a cada propriedade, incluindo suas atividades.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-3 pr-4 font-medium">Propriedade</th>
                      <th className="py-3 px-4 font-medium text-right">Reservas</th>
                      <th className="py-3 px-4 font-medium text-right">Pessoas</th>
                      <th className="py-3 pl-4 font-medium text-right">Receita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyRows.map((row) => (
                      <tr key={row.id} className="border-b last:border-0">
                        <td className="py-3 pr-4 font-medium">{row.name}</td>
                        <td className="py-3 px-4 text-right">{row.reservations}</td>
                        <td className="py-3 px-4 text-right">{row.people}</td>
                        <td className="py-3 pl-4 text-right font-medium">{formatCurrency(row.revenue)}</td>
                      </tr>
                    ))}
                    {!propertyRows.length && (
                      <tr><td colSpan={4} className="py-10 text-center text-muted-foreground">Nenhuma propriedade vinculada à conta.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Movimentações recentes</CardTitle>
              <CardDescription>Detalhamento das reservas encontradas no período.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reservations.slice(0, 20).map((reservation) => {
                const property = reservation.propriedadeId ? owned.properties.find((item) => item.id === reservation.propriedadeId) : undefined
                const activity = reservation.atividadeId ? owned.activities.find((item) => item.id === reservation.atividadeId) : undefined
                const visitor = store?.usuarios.find((item) => item.id === reservation.usuarioId)
                return (
                  <div key={reservation.id} className="grid gap-2 rounded-lg border p-4 md:grid-cols-[1.5fr_1fr_auto] md:items-center">
                    <div>
                      <p className="font-medium">{activity?.nome || property?.nome || "Reserva"}</p>
                      <p className="text-sm text-muted-foreground">{visitor?.nome || "Visitante"} · {reservation.pessoas} pessoa(s) · visita em {formatDate(reservation.dataInicio)}</p>
                    </div>
                    <div className="text-sm text-muted-foreground md:text-center">Criada em {formatDate(reservation.createdAt)}</div>
                    <div className="flex items-center gap-2 md:justify-end">
                      <Badge variant="secondary">{statusLabel(reservation.status)}</Badge>
                      <span className="font-semibold">{formatCurrency(reservation.valorTotal)}</span>
                    </div>
                  </div>
                )
              })}
              {!reservations.length && <p className="py-10 text-center text-muted-foreground">Nenhuma reserva encontrada para o período selecionado.</p>}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
