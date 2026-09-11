"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Lock, Unlock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { loadStore, toggleBloqueio, type Store } from "@/lib/client-store"


function localToday(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

export default function DisponibilidadePage() {
  const { user } = useAuth()
  const [store, setStore] = useState<Store | null>(null)
  const [blocked, setBlocked] = useState<Record<string,string[]>>({})
  useEffect(() => { const current=loadStore(); setStore(current); setBlocked(current.bloqueios || {}); const refresh=()=>{const next=loadStore();setStore(next);setBlocked(next.bloqueios || {})}; window.addEventListener("turismo-rural-store", refresh); return()=>window.removeEventListener("turismo-rural-store", refresh) }, [])
  const properties = useMemo(() => (store?.propriedades ?? []).filter(p => p.empreendedorId === user?.id), [store, user?.id])
  const toggle = (propertyId:string, date:string) => {
    if (!user) return
    try { toggleBloqueio(user.id, propertyId, date) } catch (error) { window.alert(error instanceof Error ? error.message : "Não foi possível alterar a disponibilidade.") }
  }
  const upcoming = (store?.reservas ?? []).filter(r => { const p=properties.some(p=>p.id===r.propriedadeId); return p && r.status !== "cancelada" }).sort((a,b)=>a.dataInicio.localeCompare(b.dataInicio)).slice(0,12)
  return <div className="min-h-screen flex flex-col"><Header/><main className="flex-1 py-8"><div className="container mx-auto px-4 space-y-6"><div><h1 className="text-3xl font-serif font-bold">Disponibilidade</h1><p className="text-muted-foreground">Acompanhe reservas e bloqueios manuais.</p></div><div className="grid gap-4">{properties.map(p=><Card key={p.id}><CardHeader><CardTitle className="flex items-center justify-between">{p.nome}<Badge>{p.ativo?"Ativa":"Inativa"}</Badge></CardTitle></CardHeader><CardContent className="space-y-3"><p className="text-sm text-muted-foreground">Capacidade: {p.capacidade} pessoas · Reservas próximas: {upcoming.filter(r=>r.propriedadeId===p.id).length}</p><div className="flex flex-wrap gap-2">{upcoming.filter(r=>r.propriedadeId===p.id).map(r=><span key={r.id} className="text-sm border rounded px-2 py-1">{r.dataInicio}{r.dataFim?` → ${r.dataFim}`:""} · {r.pessoas} pessoa(s)</span>)}</div><div className="flex items-center gap-2 flex-wrap"><CalendarDays className="h-4 w-4"/><Button size="sm" variant="outline" onClick={()=>toggle(p.id,localToday())}>{(blocked[p.id]||[]).includes(localToday())?<><Unlock className="mr-1 h-4 w-4"/>Liberar hoje</>:<><Lock className="mr-1 h-4 w-4"/>Bloquear hoje</>}</Button>{(blocked[p.id]||[]).map(d=><Badge key={d} variant="secondary">Bloqueado: {d}</Badge>)}</div></CardContent></Card>)}{!properties.length&&<Card><CardContent className="py-12 text-center text-muted-foreground">Cadastre uma propriedade para gerenciar a disponibilidade.</CardContent></Card>}</div></div></main><Footer/></div>
}
