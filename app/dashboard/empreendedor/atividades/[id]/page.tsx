"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { loadStore, crudAtividade } from "@/lib/client-store"
import type { Atividade, Propriedade } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { ImageUpload } from "@/components/image-upload"

const TIPOS = ["passeio", "workshop", "gastronomia", "aventura", "cultural", "infantil"] as const

export default function Page() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [activity, setActivity] = useState<Atividade | null>(null)
  const [props, setProps] = useState<Propriedade[]>([])

  useEffect(() => {
    const store = loadStore()
    const current = store.atividades.find((a) => a.id === id && a.empreendedorId === user?.id) || null
    setActivity(current)
    setProps(store.propriedades.filter((p) => p.empreendedorId === user?.id))
  }, [id, user?.id])

  if (!activity) return <div className="p-10">Atividade não encontrada ou você não tem acesso a ela.</div>

  const set = (key: keyof Atividade, value: string | number) => {
    setActivity((current) => current ? { ...current, [key]: value } : current)
  }

  const save = (event: React.FormEvent) => {
    event.preventDefault()
    if (!user) return

    try {
      crudAtividade(
        id,
        {
          nome: activity.nome.trim(),
          tipo: activity.tipo,
          propriedadeId: activity.propriedadeId,
          preco: Math.max(0, Number(activity.preco) || 0),
          vagas: Math.max(1, Number(activity.vagas) || 1),
          duracao: activity.duracao.trim(),
          descricao: activity.descricao.trim(),
          imagem: activity.imagem,
          dataEvento: activity.dataEvento,
          horario: activity.horario,
        },
        user.id,
      )
      router.push("/dashboard/empreendedor/atividades")
    } catch (error) {
      alert(error instanceof Error ? error.message : "Não foi possível salvar a atividade.")
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
            <CardHeader><CardTitle>Editar Atividade</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={save} className="space-y-5">
                <div><Label>Nome *</Label><Input required value={activity.nome} onChange={(e) => set("nome", e.target.value)} /></div>
                <div>
                  <Label>Propriedade *</Label>
                  <select className="w-full border rounded-md p-2 bg-background" required value={activity.propriedadeId} onChange={(e) => set("propriedadeId", e.target.value)}>
                    {props.map((property) => <option key={property.id} value={property.id}>{property.nome}</option>)}
                  </select>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>Tipo</Label>
                    <select className="w-full border rounded-md p-2 bg-background" value={activity.tipo} onChange={(e) => set("tipo", e.target.value as (typeof TIPOS)[number])}>
                      {TIPOS.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div><Label>Preço</Label><Input type="number" min="0" step="0.01" required value={activity.preco} onChange={(e) => set("preco", Number(e.target.value))} /></div>
                  <div><Label>Vagas</Label><Input type="number" min="1" required value={activity.vagas} onChange={(e) => set("vagas", Number(e.target.value))} /></div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><Label>Duração</Label><Input required value={activity.duracao} onChange={(e) => set("duracao", e.target.value)} /></div>
                  <div><Label>Data</Label><Input type="date" min={new Date().toISOString().slice(0, 10)} value={activity.dataEvento || ""} onChange={(e) => set("dataEvento", e.target.value)} /></div>
                  <div><Label>Horário</Label><Input type="time" value={activity.horario || ""} onChange={(e) => set("horario", e.target.value)} /></div>
                </div>
                <div><Label>Descrição</Label><Textarea rows={5} value={activity.descricao} onChange={(e) => set("descricao", e.target.value)} /></div>
                <ImageUpload images={activity.imagem ? [activity.imagem] : []} maxImages={1} onChange={(images) => setActivity((current) => current ? { ...current, imagem: images[0] || "" } : current)} label="Foto da atividade" />
                <Button type="submit"><Save className="mr-2 h-4 w-4" />Salvar alterações</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
