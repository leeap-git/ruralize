"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { crudAvaliacao, deleteAvaliacao, loadStore } from "@/lib/client-store"
import type { Avaliacao, Propriedade } from "@/lib/types"

export default function Page() {
  const { user } = useAuth()
  const [data, setData] = useState<Avaliacao[]>([])
  const [props, setProps] = useState<Propriedade[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [f, setF] = useState({ propriedadeId: "", nota: "5", comentario: "" })

  const refresh = () => {
    const store = loadStore()
    setData(store.avaliacoes)
    setProps(store.propriedades.filter((p) => p.ativo))
  }

  useEffect(() => {
    refresh()
    window.addEventListener("turismo-rural-store", refresh)
    return () => window.removeEventListener("turismo-rural-store", refresh)
  }, [])

  const mine = data.filter((a) => a.usuarioId === user?.id)
  const edit = data.find((a) => a.id === editId)

  const startEdit = (rating: Avaliacao) => {
    setEditId(rating.id)
    setF({
      propriedadeId: rating.propriedadeId || "",
      nota: String(rating.nota),
      comentario: rating.comentario,
    })
  }

  const create = (event: React.FormEvent) => {
    event.preventDefault()
    if (!user) return
    try {
      crudAvaliacao(null, { propriedadeId: f.propriedadeId, nota: Number(f.nota), comentario: f.comentario }, user.id)
      setF({ propriedadeId: "", nota: "5", comentario: "" })
    } catch (error) {
      alert(error instanceof Error ? error.message : "Não foi possível publicar a avaliação.")
    }
  }

  const update = (event: React.FormEvent) => {
    event.preventDefault()
    if (!user || !edit) return
    try {
      crudAvaliacao(edit.id, { nota: Number(f.nota), comentario: f.comentario }, user.id)
      setEditId(null)
      setF({ propriedadeId: "", nota: "5", comentario: "" })
    } catch (error) {
      alert(error instanceof Error ? error.message : "Não foi possível editar a avaliação.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <h1 className="text-3xl font-serif font-bold">Minhas Avaliações</h1>

          <Card>
            <CardHeader><CardTitle>Nova avaliação</CardTitle></CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={create}>
                <Label>Propriedade</Label>
                <select className="w-full border rounded-md p-2 bg-background" required value={f.propriedadeId} onChange={(e) => setF({ ...f, propriedadeId: e.target.value })}>
                  <option value="">Selecione</option>
                  {props.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
                <Label>Nota (1 a 5)</Label>
                <Input type="number" min="1" max="5" step="1" required value={f.nota} onChange={(e) => setF({ ...f, nota: e.target.value })} />
                <Label>Comentário</Label>
                <Textarea value={f.comentario} onChange={(e) => setF({ ...f, comentario: e.target.value })} />
                <Button type="submit">Publicar avaliação</Button>
              </form>
            </CardContent>
          </Card>

          {mine.map((a) => (
            <Card key={a.id}>
              <CardHeader><CardTitle>{props.find((p) => p.id === a.propriedadeId)?.nome || "Propriedade"} — {a.nota}/5</CardTitle></CardHeader>
              <CardContent>
                <p className="mb-3 whitespace-pre-wrap">{a.comentario}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(a)}>Editar</Button>
                  <Button size="sm" variant="destructive" onClick={() => user && deleteAvaliacao(a.id, user.id)}>Excluir</Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {edit && (
            <Card>
              <CardHeader><CardTitle>Editar avaliação</CardTitle></CardHeader>
              <CardContent>
                <form className="space-y-2" onSubmit={update}>
                  <Label>Nota</Label>
                  <Input type="number" min="1" max="5" step="1" required value={f.nota} onChange={(e) => setF({ ...f, nota: e.target.value })} />
                  <Label>Comentário</Label>
                  <Textarea value={f.comentario} onChange={(e) => setF({ ...f, comentario: e.target.value })} />
                  <div className="flex gap-2">
                    <Button type="submit">Salvar</Button>
                    <Button type="button" variant="outline" onClick={() => setEditId(null)}>Cancelar</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
