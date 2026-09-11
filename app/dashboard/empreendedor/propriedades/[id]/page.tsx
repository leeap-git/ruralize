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
import { loadStore, crudPropriedade } from "@/lib/client-store"
import type { Propriedade } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { ImageUpload } from "@/components/image-upload"

export default function Page() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [f, setF] = useState<Propriedade | null>(null)

  useEffect(() => {
    if (!user) { setF(null); return }
    const property = loadStore().propriedades.find((p) => p.id === id && p.empreendedorId === user.id)
    setF(property ? { ...property } : null)
  }, [id, user?.id])

  if (!f) {
    return <div className="p-10">Propriedade não encontrada ou você não tem acesso a ela.</div>
  }

  const set = (key: keyof Propriedade, value: string | number) => {
    setF((current) => current ? { ...current, [key]: value } : current)
  }

  const save = (event: React.FormEvent) => {
    event.preventDefault()
    if (!user) return

    try {
      crudPropriedade(
        id,
        {
          nome: f.nome.trim(),
          cidade: f.cidade.trim(),
          estado: f.estado.trim().toUpperCase(),
          preco: Math.max(0, Number(f.preco) || 0),
          capacidade: Math.max(1, Number(f.capacidade) || 1),
          endereco: f.endereco.trim(),
          descricao: f.descricao.trim(),
          imagens: f.imagens,
        },
        user.id,
      )
      router.push("/dashboard/empreendedor/propriedades")
    } catch (error) {
      alert(error instanceof Error ? error.message : "Não foi possível salvar a propriedade.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/dashboard/empreendedor/propriedades" className="inline-flex gap-2 mb-6 text-muted-foreground"><ArrowLeft className="h-4 w-4" />Voltar</Link>
          <Card>
            <CardHeader><CardTitle>Editar Propriedade</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={save} className="space-y-5">
                <div><Label>Nome *</Label><Input required value={f.nome} onChange={(e) => set("nome", e.target.value)} /></div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label>Cidade</Label><Input value={f.cidade} onChange={(e) => set("cidade", e.target.value)} /></div>
                  <div><Label>Estado</Label><Input maxLength={2} value={f.estado} onChange={(e) => set("estado", e.target.value)} /></div>
                  <div><Label>Preço</Label><Input type="number" min="0" step="0.01" value={f.preco} onChange={(e) => set("preco", Number(e.target.value))} /></div>
                  <div><Label>Capacidade</Label><Input type="number" min="1" value={f.capacidade} onChange={(e) => set("capacidade", Number(e.target.value))} /></div>
                </div>
                <div><Label>Endereço</Label><Input value={f.endereco} onChange={(e) => set("endereco", e.target.value)} /></div>
                <div><Label>Descrição</Label><Textarea rows={5} value={f.descricao} onChange={(e) => set("descricao", e.target.value)} /></div>
                <ImageUpload images={f.imagens || []} onChange={(images) => setF((current) => current ? { ...current, imagens: images } : current)} label="Fotos da propriedade" />
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
