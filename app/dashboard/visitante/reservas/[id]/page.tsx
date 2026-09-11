"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Users, MapPin, Clock, CreditCard, MessageSquare, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { crudReserva, loadStore } from "@/lib/client-store"
import type { Reserva, Propriedade, Atividade } from "@/lib/types"

export default function DetalheReservaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [reserva, setReserva] = useState<Reserva | null>(null)
  const [property, setProperty] = useState<Propriedade | null>(null)
  const [activity, setActivity] = useState<Atividade | null>(null)

  useEffect(() => {
    if (!user) return
    const refresh = () => {
      const store = loadStore()
      const current = store.reservas.find((r) => r.id === id && r.usuarioId === user.id) || null
      setReserva(current)
      setProperty(current?.propriedadeId ? store.propriedades.find((p) => p.id === current.propriedadeId) || null : null)
      setActivity(current?.atividadeId ? store.atividades.find((a) => a.id === current.atividadeId) || null : null)
    }
    refresh()
    window.addEventListener("turismo-rural-store", refresh)
    return () => window.removeEventListener("turismo-rural-store", refresh)
  }, [id, user])

  if (isLoading) return <div className="p-10 text-muted-foreground">Carregando...</div>
  if (!user || !reserva) return <div className="min-h-screen flex flex-col"><Header/><main className="flex-1 container mx-auto px-4 py-16"><p className="mb-4 text-muted-foreground">Reserva não encontrada ou você não tem acesso a ela.</p><Button asChild variant="outline"><Link href="/dashboard/visitante/reservas"><ArrowLeft className="mr-2 h-4 w-4"/>Voltar</Link></Button></main><Footer/></div>

  const statusLabel: Record<Reserva["status"], string> = { pendente: "Pendente", confirmada: "Confirmada", cancelada: "Cancelada", concluida: "Concluída" }
  const StatusIcon = reserva.status === "cancelada" ? XCircle : reserva.status === "pendente" ? Clock : CheckCircle
  const cancel = () => {
    try { crudReserva(reserva.id, { status: "cancelada" }, user.id); router.refresh() } catch (error) { alert(error instanceof Error ? error.message : "Não foi possível cancelar a reserva.") }
  }

  return <div className="min-h-screen flex flex-col bg-background">
    <Header/>
    <main className="flex-1 py-8"><div className="container mx-auto px-4 max-w-4xl space-y-6">
      <Link href="/dashboard/visitante/reservas" className="inline-flex items-center gap-2 text-muted-foreground"><ArrowLeft className="h-4 w-4"/>Voltar às reservas</Link>
      <div className="flex items-center justify-between gap-4"><div><h1 className="text-3xl font-serif font-bold">Reserva {reserva.id}</h1><p className="text-muted-foreground">Criada em {reserva.createdAt}</p></div><Badge>{statusLabel[reserva.status]}</Badge></div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card><CardHeader><CardTitle>{property?.nome || activity?.nome || "Reserva"}</CardTitle></CardHeader><CardContent className="space-y-4">
            {property && <><img src={property.imagens[0] || "/placeholder.jpg"} alt={property.nome} className="w-full h-56 object-cover rounded-lg"/><p className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4"/>{property.cidade}, {property.estado}</p></>}
            {activity && <p className="text-primary font-medium">Atividade: {activity.nome}</p>}
            <div className="grid sm:grid-cols-3 gap-4"><div><p className="text-sm text-muted-foreground">Entrada</p><p className="font-semibold flex items-center gap-2"><Calendar className="h-4 w-4"/>{reserva.dataInicio}</p></div><div><p className="text-sm text-muted-foreground">Saída</p><p className="font-semibold">{reserva.dataFim || "Mesmo dia"}</p></div><div><p className="text-sm text-muted-foreground">Pessoas</p><p className="font-semibold flex items-center gap-2"><Users className="h-4 w-4"/>{reserva.pessoas}</p></div></div>
            {reserva.observacoes && <div><p className="text-sm text-muted-foreground mb-1">Observações</p><p className="whitespace-pre-wrap">{reserva.observacoes}</p></div>}
          </CardContent></Card>
        </div>
        <div className="space-y-6">
          <Card><CardHeader><CardTitle>Status</CardTitle></CardHeader><CardContent><div className="flex items-center gap-3"><StatusIcon className="h-5 w-5"/><div><p className="font-semibold">{statusLabel[reserva.status]}</p><p className="text-sm text-muted-foreground">{reserva.status === "pendente" ? "Aguardando pagamento/confirmacão." : reserva.status === "confirmada" ? "Sua reserva está confirmada." : reserva.status === "cancelada" ? "Reserva cancelada." : "Reserva concluída."}</p></div></div></CardContent></Card>
          <Card><CardHeader><CardTitle>Resumo financeiro</CardTitle></CardHeader><CardContent className="space-y-3"><div className="flex justify-between"><span>Total</span><strong>R$ {reserva.valorTotal.toFixed(2)}</strong></div>{reserva.metodoPagamento && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Pagamento</span><span>{reserva.metodoPagamento.toUpperCase()}</span></div>}</CardContent></Card>
          {reserva.status === "pendente" && <Button className="w-full" asChild><Link href={`/dashboard/visitante/reservas/${reserva.id}/pagamento`}><CreditCard className="mr-2 h-4 w-4"/>Pagar reserva</Link></Button>}
          {reserva.status === "confirmada" && <Button variant="destructive" className="w-full" onClick={cancel}><XCircle className="mr-2 h-4 w-4"/>Cancelar reserva</Button>}
          {property && <Button variant="outline" className="w-full" asChild><Link href={`/propriedades/${property.id}`}><MapPin className="mr-2 h-4 w-4"/>Ver propriedade</Link></Button>}
          <Button variant="outline" className="w-full" asChild><Link href="/dashboard/visitante/mensagens"><MessageSquare className="mr-2 h-4 w-4"/>Enviar mensagem</Link></Button>
          <Alert><AlertCircle className="h-4 w-4"/><AlertTitle>Importante</AlertTitle><AlertDescription>O pagamento real deverá ser processado pelo backend/gateway na próxima etapa.</AlertDescription></Alert>
        </div>
      </div>
    </div></main><Footer/></div>
}
