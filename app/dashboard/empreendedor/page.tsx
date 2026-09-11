"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { BarChart3, Building2, Calendar, CalendarCheck, DollarSign, Eye, MessageSquare, Plus, Settings, Users } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { loadStore, type Store } from "@/lib/client-store"

export default function DashboardEmpreendedorPage() {
  const { user } = useAuth()
  const [store, setStore] = useState<Store | null>(null)

  useEffect(() => {
    const refresh = () => setStore(loadStore())
    refresh()
    window.addEventListener("turismo-rural-store", refresh)
    return () => window.removeEventListener("turismo-rural-store", refresh)
  }, [])

  const mine = useMemo(() => {
    if (!user || !store) return { properties: [], activities: [], reservations: [], messages: [] as Store["mensagens"] }
    const properties = store.propriedades.filter((p) => p.empreendedorId === user.id)
    const propertyIds = new Set(properties.map((p) => p.id))
    const activities = store.atividades.filter((a) => a.empreendedorId === user.id || propertyIds.has(a.propriedadeId))
    const activityIds = new Set(activities.map((a) => a.id))
    const reservations = store.reservas.filter((r) => (r.propriedadeId && propertyIds.has(r.propriedadeId)) || (r.atividadeId && activityIds.has(r.atividadeId)))
    const messages = store.mensagens.filter((m) => m.destinatarioId === user.id || m.remetenteId === user.id)
    return { properties, activities, reservations, messages }
  }, [store, user])

  const revenue = mine.reservations.filter((r) => r.status === "confirmada" || r.status === "concluida").reduce((sum, r) => sum + r.valorTotal, 0)
  const unread = mine.messages.filter((m) => m.destinatarioId === user?.id && !m.lida).length
  const people = mine.reservations.reduce((sum, r) => sum + r.pessoas, 0)
  const recent = [...mine.reservations].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)

  return <div className="min-h-screen flex flex-col bg-background"><Header/><main className="flex-1 py-8"><div className="container mx-auto px-4 space-y-6">
    <div className="flex flex-col sm:flex-row justify-between gap-4"><div><h1 className="font-serif text-3xl font-bold">Painel do Empreendedor</h1><p className="text-muted-foreground">Dados reais das suas propriedades, atividades e reservas.</p></div><Button asChild><Link href="/dashboard/empreendedor/atividades/nova"><Plus className="h-4 w-4 mr-2"/>Nova Atividade</Link></Button></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[{label:"Propriedades",value:mine.properties.length,icon:Building2},{label:"Atividades",value:mine.activities.length,icon:Calendar},{label:"Reservas",value:mine.reservations.length,icon:CalendarCheck},{label:"Receita confirmada",value:`R$ ${revenue.toFixed(2)}`,icon:DollarSign}].map(({label,value,icon:Icon})=><Card key={label}><CardContent className="p-5 flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold">{value}</p></div><Icon className="h-6 w-6 text-primary"/></CardContent></Card>)}
    </div>
    <div className="grid md:grid-cols-3 gap-4"><Card><CardHeader><CardTitle className="text-base">Visitantes</CardTitle></CardHeader><CardContent><div className="flex items-center gap-3"><Users className="h-5 w-5 text-primary"/><span className="text-2xl font-bold">{people}</span><span className="text-sm text-muted-foreground">pessoas em reservas</span></div></CardContent></Card><Card><CardHeader><CardTitle className="text-base">Mensagens</CardTitle></CardHeader><CardContent><div className="flex items-center gap-3"><MessageSquare className="h-5 w-5 text-primary"/><span className="text-2xl font-bold">{unread}</span><span className="text-sm text-muted-foreground">não lidas</span></div></CardContent></Card><Card><CardHeader><CardTitle className="text-base">Cadastros ativos</CardTitle></CardHeader><CardContent><div className="flex items-center gap-3"><Eye className="h-5 w-5 text-primary"/><span className="text-2xl font-bold">{mine.properties.filter(p=>p.ativo).length + mine.activities.filter(a=>a.ativo).length}</span><span className="text-sm text-muted-foreground">itens publicados</span></div></CardContent></Card></div>
    <Card><CardHeader><div className="flex items-center justify-between"><div><CardTitle>Reservas recentes</CardTitle><CardDescription>Últimas reservas associadas às suas ofertas.</CardDescription></div><Button variant="outline" asChild><Link href="/dashboard/empreendedor/reservas">Ver todas</Link></Button></div></CardHeader><CardContent>{recent.length ? <div className="space-y-3">{recent.map((r)=>{const target = r.propriedadeId ? mine.properties.find(p=>p.id===r.propriedadeId)?.nome : r.atividadeId ? mine.activities.find(a=>a.id===r.atividadeId)?.nome : "Reserva"; return <div key={r.id} className="flex items-center justify-between border-b last:border-0 py-3"><div><p className="font-medium">{target}</p><p className="text-sm text-muted-foreground">{r.dataInicio} · {r.pessoas} pessoa(s)</p></div><div className="text-right"><p className="font-semibold">R$ {r.valorTotal.toFixed(2)}</p><Badge>{r.status}</Badge></div></div>})}</div> : <p className="text-muted-foreground py-8 text-center">Nenhuma reserva ainda.</p>}</CardContent></Card>
    <div className="flex flex-wrap gap-2"><Button variant="outline" asChild><Link href="/dashboard/empreendedor/propriedades">Propriedades</Link></Button><Button variant="outline" asChild><Link href="/dashboard/empreendedor/atividades">Atividades</Link></Button><Button variant="outline" asChild><Link href="/dashboard/empreendedor/mensagens">Mensagens</Link></Button><Button variant="outline" asChild><Link href="/dashboard/empreendedor/relatorios"><BarChart3 className="h-4 w-4 mr-2"/>Relatórios</Link></Button><Button variant="outline" asChild><Link href="/dashboard/empreendedor/configuracoes"><Settings className="h-4 w-4 mr-2"/>Configurações</Link></Button></div>
  </div></main><Footer/></div>
}
