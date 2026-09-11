"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { loadStore, type Store } from "@/lib/client-store"

export default function RelatoriosPage() {
  const { user } = useAuth(); const [store,setStore]=useState<Store | null>(null)
  useEffect(()=>{const refresh=()=>setStore(loadStore()); refresh(); window.addEventListener("turismo-rural-store",refresh); return()=>window.removeEventListener("turismo-rural-store",refresh)},[])
  const summary = useMemo(()=>{
    const props=(store?.propriedades ?? []).filter(p=>p.empreendedorId===user?.id); const ids=new Set(props.map(p=>p.id)); const acts=(store?.atividades ?? []).filter(a=>a.empreendedorId===user?.id||ids.has(a.propriedadeId)); const aid=new Set(acts.map(a=>a.id)); const reservations=(store?.reservas ?? []).filter(r=>(r.propriedadeId&&ids.has(r.propriedadeId))||(r.atividadeId&&aid.has(r.atividadeId))); const revenue=reservations.filter(r=>r.status==="confirmada"||r.status==="concluida").reduce((s,r)=>s+r.valorTotal,0); return {props,acts,reservations,revenue}
  },[store,user?.id])
  const byStatus = (status:string)=>summary.reservations.filter(r=>r.status===status).length
  return <div className="min-h-screen flex flex-col"><Header/><main className="flex-1 py-8"><div className="container mx-auto px-4 space-y-6"><div><h1 className="text-3xl font-serif font-bold">Relatórios</h1><p className="text-muted-foreground">Indicadores calculados a partir dos dados atuais.</p></div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[["Propriedades",summary.props.length],["Atividades",summary.acts.length],["Reservas confirmadas",byStatus("confirmada")],["Receita",`R$ ${summary.revenue.toFixed(2)}`]].map(([l,v])=><Card key={String(l)}><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">{l}</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{v}</p></CardContent></Card>)}</div><Card><CardHeader><CardTitle>Status das reservas</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">{(["pendente","confirmada","cancelada","concluida"] as const).map(s=><Badge key={s} variant="secondary">{s}: {byStatus(s)}</Badge>)}</CardContent></Card><Card><CardHeader><CardTitle>Atividades com reservas</CardTitle></CardHeader><CardContent className="space-y-3">{summary.acts.map(a=>{const count=summary.reservations.filter(r=>r.atividadeId===a.id).reduce((s,r)=>s+r.pessoas,0); return <div key={a.id} className="flex justify-between border-b last:border-0 py-2"><span>{a.nome}</span><span className="text-muted-foreground">{count} participante(s)</span></div>})}{!summary.acts.length&&<p className="text-muted-foreground">Nenhuma atividade cadastrada.</p>}</CardContent></Card></div></main><Footer/></div>
}
