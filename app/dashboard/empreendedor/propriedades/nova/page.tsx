"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { useAuth } from "@/contexts/auth-context"
import { crudPropriedade } from "@/lib/client-store"
import type { Propriedade } from "@/lib/types"

const TYPES: Propriedade["tipo"][] = ["fazenda", "sitio", "chacara", "pousada", "camping"]

export default function NovaPropriedadePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [form, setForm] = useState({ nome: "", tipo: "sitio" as Propriedade["tipo"], preco: "", capacidade: "", endereco: "", cidade: "", estado: "", descricao: "" })
  const [error, setError] = useState("")
  const [images, setImages] = useState<string[]>([])

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    if (!user) { setError("Sessão expirada."); return }
    try {
      crudPropriedade(null, { ...form, preco: Number(form.preco), capacidade: Number(form.capacidade), tipo: form.tipo, imagens: images, comodidades: [] }, user.id)
      router.push("/dashboard/empreendedor/propriedades")
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível cadastrar a propriedade.") }
  }

  return <div className="min-h-screen flex flex-col"><Header/><main className="flex-1 py-8"><div className="container mx-auto px-4 max-w-3xl"><Link href="/dashboard/empreendedor/propriedades" className="inline-flex gap-2 mb-6 text-muted-foreground"><ArrowLeft className="h-4 w-4"/>Voltar</Link><Card><CardHeader><CardTitle>Nova Propriedade</CardTitle></CardHeader><CardContent>{error&&<p className="mb-4 text-sm text-destructive">{error}</p>}<form onSubmit={submit} className="space-y-5"><div><Label>Nome *</Label><Input required value={form.nome} onChange={(e)=>update("nome",e.target.value)}/></div><div className="grid md:grid-cols-2 gap-4"><div><Label>Tipo</Label><Select value={form.tipo} onValueChange={(v)=>setForm(x=>({...x,tipo:v as Propriedade["tipo"]}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{TYPES.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div><div><Label>Preço por noite *</Label><Input type="number" min="0" step="0.01" required value={form.preco} onChange={(e)=>update("preco",e.target.value)}/></div><div><Label>Capacidade *</Label><Input type="number" min="1" step="1" required value={form.capacidade} onChange={(e)=>update("capacidade",e.target.value)}/></div><div><Label>Estado</Label><Input value={form.estado} onChange={(e)=>update("estado",e.target.value)}/></div></div><div><Label>Endereço</Label><Input value={form.endereco} onChange={(e)=>update("endereco",e.target.value)}/></div><div><Label>Cidade</Label><Input value={form.cidade} onChange={(e)=>update("cidade",e.target.value)}/></div><div><Label>Descrição</Label><Textarea rows={5} value={form.descricao} onChange={(e)=>update("descricao",e.target.value)}/></div><ImageUpload images={images} onChange={setImages} label="Fotos da propriedade"/><Button type="submit"><Save className="mr-2 h-4 w-4"/>Cadastrar</Button></form></CardContent></Card></div></main><Footer/></div>
}
