"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { crudAtividade, loadStore } from "@/lib/client-store"
import type { Propriedade } from "@/lib/types"
import { ImageUpload } from "@/components/image-upload"

const TIPOS = ["passeio", "workshop", "gastronomia", "aventura", "cultural", "infantil"] as const

export default function Page() {
  const router = useRouter()
  const { user } = useAuth()
  const [props, setProps] = useState<Propriedade[]>([])
  const [f, setF] = useState({
    nome: "",
    descricao: "",
    tipo: "passeio",
    preco: "",
    duracao: "1 hora",
    vagas: "10",
    propriedadeId: "",
    dataEvento: "",
    horario: "",
    imagem: "",
  })

  useEffect(() => {
    const mine = loadStore().propriedades.filter((p) => p.empreendedorId === user?.id && p.ativo)
    setProps(mine)
    setF((current) => ({ ...current, propriedadeId: current.propriedadeId || mine[0]?.id || "" }))
  }, [user?.id])

  const set = (key: string, value: string) => setF((x) => ({ ...x, [key]: value }))

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      crudAtividade(
        null,
        {
          ...f,
          preco: Number(f.preco),
          vagas: Number(f.vagas),
          tipo: f.tipo as (typeof TIPOS)[number],
        },
        user.id,
      )
      router.push("/dashboard/empreendedor/atividades")
    } catch (error) {
      alert(error instanceof Error ? error.message : "Não foi possível cadastrar a atividade.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-3xl mx-auto px-4">
          <Link href="/dashboard/empreendedor/atividades" className="inline-flex gap-2 mb-6 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />Voltar
          </Link>
          <Card>
            <CardHeader><CardTitle>Nova Atividade</CardTitle></CardHeader>
            <CardContent>
              {!props.length ? (
                <p className="text-muted-foreground">Cadastre uma propriedade antes de criar uma atividade.</p>
              ) : (
                <form onSubmit={save} className="space-y-5">
                  <div><Label>Nome *</Label><Input required value={f.nome} onChange={(e) => set("nome", e.target.value)} /></div>
                  <div>
                    <Label>Propriedade *</Label>
                    <Select value={f.propriedadeId} onValueChange={(v) => set("propriedadeId", v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{props.map((p) => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div><Label>Tipo</Label><Select value={f.tipo} onValueChange={(v) => set("tipo", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TIPOS.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div>
                    <div><Label>Preço</Label><Input type="number" min="0" step="0.01" required value={f.preco} onChange={(e) => set("preco", e.target.value)} /></div>
                    <div><Label>Vagas</Label><Input type="number" min="1" required value={f.vagas} onChange={(e) => set("vagas", e.target.value)} /></div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div><Label>Duração</Label><Input required value={f.duracao} onChange={(e) => set("duracao", e.target.value)} /></div>
                    <div><Label>Data</Label><Input type="date" min={new Date().toISOString().slice(0, 10)} value={f.dataEvento} onChange={(e) => set("dataEvento", e.target.value)} /></div>
                    <div><Label>Horário</Label><Input type="time" value={f.horario} onChange={(e) => set("horario", e.target.value)} /></div>
                  </div>
                  <div><Label>Descrição</Label><Textarea rows={5} value={f.descricao} onChange={(e) => set("descricao", e.target.value)} /></div>
                  <ImageUpload images={f.imagem ? [f.imagem] : []} maxImages={1} onChange={(imgs) => set("imagem", imgs[0] || "")} label="Foto da atividade" />
                  <Button type="submit"><Save className="mr-2 h-4 w-4" />Cadastrar</Button>
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
