"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { crudMensagem, deleteMensagem, loadStore, marcarLida } from "@/lib/client-store"
import type { Mensagem, Usuario, Empreendedor } from "@/lib/types"

export default function Page() {
  const { user } = useAuth()
  const [data, setData] = useState<Mensagem[]>([])
  const [accounts, setAccounts] = useState<Array<Usuario | Empreendedor>>([])
  const [f, setF] = useState({ destinatarioId: "", assunto: "", conteudo: "" })

  const refresh = () => {
    const store = loadStore()
    setData(store.mensagens)
    setAccounts([...store.usuarios, ...store.empreendedores])
  }

  useEffect(() => {
    refresh()
    window.addEventListener("turismo-rural-store", refresh)
    return () => window.removeEventListener("turismo-rural-store", refresh)
  }, [])

  useEffect(() => {
    if (!f.destinatarioId && accounts.length) {
      const fallback = accounts.find((account) => account.id !== user?.id)
      if (fallback) setF((current) => ({ ...current, destinatarioId: fallback.id }))
    }
  }, [accounts, f.destinatarioId, user?.id])

  const mine = data.filter((m) => m.remetenteId === user?.id || m.destinatarioId === user?.id)
  const nome = (id: string) => accounts.find((account) => account.id === id)?.nome || id

  const send = (event: React.FormEvent) => {
    event.preventDefault()
    if (!user) return
    try {
      crudMensagem(null, f, user.id)
      setF({ destinatarioId: "", assunto: "", conteudo: "" })
    } catch (error) {
      alert(error instanceof Error ? error.message : "Não foi possível enviar a mensagem.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <h1 className="text-3xl font-serif font-bold">Mensagens</h1>

          <Card>
            <CardHeader><CardTitle>Nova mensagem</CardTitle></CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={send}>
                <Label>Destinatário</Label>
                <select
                  className="w-full border rounded-md p-2 bg-background"
                  required
                  value={f.destinatarioId}
                  onChange={(e) => setF({ ...f, destinatarioId: e.target.value })}
                >
                  <option value="">Selecione</option>
                  {accounts.filter((account) => account.id !== user?.id).map((account) => (
                    <option key={account.id} value={account.id}>{account.nome} — {account.email}</option>
                  ))}
                </select>
                <Label>Assunto</Label>
                <Input required value={f.assunto} onChange={(e) => setF({ ...f, assunto: e.target.value })} />
                <Label>Mensagem</Label>
                <Textarea required value={f.conteudo} onChange={(e) => setF({ ...f, conteudo: e.target.value })} />
                <Button type="submit">Enviar</Button>
              </form>
            </CardContent>
          </Card>

          {mine.map((m) => (
            <Card key={m.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>{m.assunto}</CardTitle>
                  {!m.lida && <Badge>Não lida</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">De: {nome(m.remetenteId)} · Para: {nome(m.destinatarioId)} · {m.createdAt}</p>
              </CardHeader>
              <CardContent>
                <p className="mb-3 whitespace-pre-wrap">{m.conteudo}</p>
                <div className="flex gap-2">
                  {m.destinatarioId === user?.id && !m.lida && (
                    <Button size="sm" variant="outline" onClick={() => user && marcarLida(m.id, user.id)}>Marcar como lida</Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => user && deleteMensagem(m.id, user.id)}>Excluir</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
