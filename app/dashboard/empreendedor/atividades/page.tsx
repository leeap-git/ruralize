"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Plus, Search, Edit, Trash2, RotateCcw } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { loadStore, deleteAtividade } from "@/lib/client-store"
import type { Atividade } from "@/lib/types"

export default function Page() {
  const { user } = useAuth()
  const [data, setData] = useState<Atividade[]>([])
  const [q, setQ] = useState("")

  const refresh = () => setData(loadStore().atividades)

  useEffect(() => {
    refresh()
    window.addEventListener("turismo-rural-store", refresh)
    return () => window.removeEventListener("turismo-rural-store", refresh)
  }, [])

  const mine = useMemo(
    () =>
      data.filter(
        (a) =>
          a.empreendedorId === user?.id &&
          `${a.nome} ${a.descricao}`.toLowerCase().includes(q.trim().toLowerCase()),
      ),
    [data, user?.id, q],
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold">Minhas Atividades</h1>
              <p className="text-muted-foreground">Cadastre, edite, desative e reative atividades.</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/empreendedor/atividades/nova"><Plus className="mr-2 h-4 w-4" />Nova Atividade</Link>
            </Button>
          </div>

          <div className="max-w-md">
            <Input placeholder="Buscar atividade..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          <div className="grid gap-4">
            {mine.map((a) => (
              <Card key={a.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>{a.nome}</CardTitle>
                    <Badge variant={a.ativo ? "default" : "secondary"}>{a.ativo ? "Ativa" : "Inativa"}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{a.tipo} · R$ {a.preco.toFixed(2)} · {a.vagas} vagas</p>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/empreendedor/atividades/${a.id}`}><Edit className="mr-1 h-4 w-4" />Editar</Link>
                  </Button>
                  <Button variant="outline" onClick={() => deleteAtividade(a.id, user?.id)}>
                    {a.ativo ? <><Trash2 className="mr-1 h-4 w-4" />Desativar</> : <><RotateCcw className="mr-1 h-4 w-4" />Reativar</>}
                  </Button>
                </CardContent>
              </Card>
            ))}
            {!mine.length && <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhuma atividade encontrada.</CardContent></Card>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
