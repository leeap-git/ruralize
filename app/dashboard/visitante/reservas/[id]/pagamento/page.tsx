"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Copy, CreditCard, QrCode, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { loadStore, pagarReserva } from "@/lib/client-store"
import type { Reserva, Propriedade, Atividade } from "@/lib/types"

export default function PagamentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [reservation, setReservation] = useState<Reserva | null>(null)
  const [property, setProperty] = useState<Propriedade | null>(null)
  const [activity, setActivity] = useState<Atividade | null>(null)
  const [method, setMethod] = useState<Reserva["metodoPagamento"]>("pix")
  const [processing, setProcessing] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user) return
    const store = loadStore()
    const current = store.reservas.find((r) => r.id === id && r.usuarioId === user.id) || null
    setReservation(current)
    setProperty(current?.propriedadeId ? store.propriedades.find((p) => p.id === current.propriedadeId) || null : null)
    setActivity(current?.atividadeId ? store.atividades.find((a) => a.id === current.atividadeId) || null : null)
  }, [id, user])

  if (isLoading) return <div className="p-10 text-muted-foreground">Carregando...</div>
  if (!user || !reservation) return <div className="min-h-screen flex flex-col"><Header/><main className="flex-1 container mx-auto px-4 py-16"><p className="mb-4 text-muted-foreground">Reserva não encontrada.</p><Button asChild variant="outline"><Link href="/dashboard/visitante/reservas"><ArrowLeft className="mr-2 h-4 w-4"/>Voltar</Link></Button></main><Footer/></div>

  const pay = () => {
    setProcessing(true)
    try { pagarReserva(reservation.id, user.id, method); router.push(`/dashboard/visitante/reservas/${reservation.id}`) } catch (error) { alert(error instanceof Error ? error.message : "Não foi possível processar o pagamento."); setProcessing(false) }
  }
  const copyPix = async () => {
    try { await navigator.clipboard.writeText(`TURISMO-RURAL-${reservation.id}`); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { alert("Não foi possível copiar o código.") }
  }

  return <div className="min-h-screen flex flex-col bg-background"><Header/><main className="flex-1 py-8"><div className="container mx-auto px-4 max-w-4xl space-y-6">
    <Link href={`/dashboard/visitante/reservas/${reservation.id}`} className="inline-flex items-center gap-2 text-muted-foreground"><ArrowLeft className="h-4 w-4"/>Voltar</Link>
    <h1 className="text-3xl font-serif font-bold">Pagamento</h1>
    <div className="grid lg:grid-cols-3 gap-6"><Card className="lg:col-span-2"><CardHeader><CardTitle>Forma de pagamento</CardTitle></CardHeader><CardContent className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">{(["pix","cartao","boleto"] as const).map((x) => <button key={x} type="button" onClick={() => setMethod(x)} className={`border rounded-lg p-4 text-left ${method === x ? "ring-2 ring-primary" : ""}`}><CreditCard className="h-5 w-5 mb-2"/><span className="capitalize">{x === "cartao" ? "Cartão" : x}</span></button>)}</div>
      {method === "pix" && <div className="rounded-lg border p-5 text-center"><QrCode className="mx-auto h-20 w-20 mb-3"/><p className="text-sm text-muted-foreground mb-3">Código PIX demonstrativo para o protótipo</p><Button variant="outline" onClick={copyPix}>{copied ? <Check className="mr-2 h-4 w-4"/> : <Copy className="mr-2 h-4 w-4"/>}{copied ? "Copiado" : "Copiar código"}</Button></div>}
      {method === "cartao" && <p className="text-sm text-muted-foreground">Os campos de cartão serão conectados a um gateway seguro no backend. Nenhum dado de cartão é armazenado nesta versão.</p>}
      {method === "boleto" && <p className="text-sm text-muted-foreground">O boleto será gerado pelo backend/gateway na implementação definitiva.</p>}
      <Alert><Shield className="h-4 w-4"/><AlertDescription>Este fluxo é apenas demonstrativo. O processamento financeiro real deve ocorrer no servidor.</AlertDescription></Alert>
      <Button className="w-full" size="lg" disabled={processing} onClick={pay}>{processing ? "Processando..." : "Confirmar pagamento"}</Button>
    </CardContent></Card><Card className="h-fit"><CardHeader><CardTitle>Resumo</CardTitle></CardHeader><CardContent className="space-y-3"><p className="font-semibold">{property?.nome || activity?.nome || "Reserva"}</p><p className="text-sm text-muted-foreground">{reservation.dataInicio}{reservation.dataFim ? ` até ${reservation.dataFim}` : ""}</p><p className="text-sm text-muted-foreground">{reservation.pessoas} pessoa(s)</p><Separator/><div className="flex justify-between font-semibold"><span>Total</span><span>R$ {reservation.valorTotal.toFixed(2)}</span></div></CardContent></Card></div>
  </div></main><Footer/></div>
}
