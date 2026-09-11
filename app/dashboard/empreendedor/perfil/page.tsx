"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Building2, Lock, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"

export default function PerfilEmpreendedorPage() {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth()
  const emp = user?.tipo === "empreendedor" ? user : null
  const [form, setForm] = useState({ nome: "", telefone: "", nomeEmpresa: "", cnpj: "", endereco: "", cidade: "", estado: "", descricao: "" })
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" })
  const [message, setMessage] = useState("")
  useEffect(() => { if (emp) setForm({ nome: emp.nome, telefone: emp.telefone, nomeEmpresa: emp.nomeEmpresa, cnpj: emp.cnpj, endereco: emp.endereco, cidade: emp.cidade, estado: emp.estado, descricao: emp.descricao || "" }) }, [emp])
  if (!emp) return null
  const save = () => setMessage(updateProfile(form).message)
  const change = () => { if (password.next !== password.confirm) { setMessage("As senhas não coincidem."); return } const result = changePassword(password.current, password.next); setMessage(result.message); if (result.success) setPassword({ current: "", next: "", confirm: "" }) }
  const remove = () => { if (window.confirm("Excluir sua conta, propriedades, atividades e dados associados?")) setMessage(deleteAccount().message) }
  return <div className="min-h-screen flex flex-col"><Header/><main className="flex-1 py-8"><div className="container mx-auto px-4 max-w-4xl"><Link href="/dashboard/empreendedor" className="inline-flex items-center gap-2 text-muted-foreground mb-6"><ArrowLeft className="h-4 w-4"/>Voltar ao painel</Link><h1 className="text-3xl font-serif font-bold mb-6">Meu perfil</h1>{message && <Alert className="mb-6"><AlertDescription>{message}</AlertDescription></Alert>}<Tabs defaultValue="pessoal" className="space-y-6"><TabsList><TabsTrigger value="pessoal">Pessoal</TabsTrigger><TabsTrigger value="empresa">Empresa</TabsTrigger><TabsTrigger value="seguranca">Segurança</TabsTrigger></TabsList><TabsContent value="pessoal"><Card><CardHeader><CardTitle>Dados pessoais</CardTitle></CardHeader><CardContent className="space-y-4"><div><Label>Nome</Label><Input value={form.nome} onChange={(e)=>setForm({...form,nome:e.target.value})}/></div><div><Label>E-mail</Label><Input value={emp.email} disabled/></div><div><Label>Telefone</Label><Input value={form.telefone} onChange={(e)=>setForm({...form,telefone:e.target.value})}/></div><Button onClick={save}><Save className="mr-2 h-4 w-4"/>Salvar alterações</Button></CardContent></Card></TabsContent><TabsContent value="empresa"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5"/>Dados da empresa</CardTitle><CardDescription>Informações usadas no cadastro do negócio.</CardDescription></CardHeader><CardContent className="space-y-4"><div><Label>Nome da empresa</Label><Input value={form.nomeEmpresa} onChange={(e)=>setForm({...form,nomeEmpresa:e.target.value})}/></div><div><Label>CNPJ</Label><Input value={form.cnpj} onChange={(e)=>setForm({...form,cnpj:e.target.value})}/></div><div><Label>Endereço</Label><Input value={form.endereco} onChange={(e)=>setForm({...form,endereco:e.target.value})}/></div><div className="grid md:grid-cols-2 gap-4"><div><Label>Cidade</Label><Input value={form.cidade} onChange={(e)=>setForm({...form,cidade:e.target.value})}/></div><div><Label>Estado</Label><Input value={form.estado} onChange={(e)=>setForm({...form,estado:e.target.value})}/></div></div><div><Label>Descrição</Label><Textarea value={form.descricao} onChange={(e)=>setForm({...form,descricao:e.target.value})}/></div><Button onClick={save}><Save className="mr-2 h-4 w-4"/>Salvar alterações</Button></CardContent></Card></TabsContent><TabsContent value="seguranca"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5"/>Alterar senha</CardTitle></CardHeader><CardContent className="space-y-4"><Input type="password" placeholder="Senha atual" value={password.current} onChange={(e)=>setPassword({...password,current:e.target.value})}/><Input type="password" placeholder="Nova senha" value={password.next} onChange={(e)=>setPassword({...password,next:e.target.value})}/><Input type="password" placeholder="Confirmar nova senha" value={password.confirm} onChange={(e)=>setPassword({...password,confirm:e.target.value})}/><Button onClick={change}>Alterar senha</Button></CardContent></Card><Card className="mt-6 border-destructive/50"><CardHeader><CardTitle className="text-destructive">Excluir conta</CardTitle></CardHeader><CardContent><Button variant="destructive" onClick={remove}>Excluir minha conta</Button></CardContent></Card></TabsContent></Tabs></div></main><Footer/></div>
}
