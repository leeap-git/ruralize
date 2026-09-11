"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, User, Mail, Phone, MapPin, Lock, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"

export default function PerfilVisitantePage() {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth()
  const [form, setForm] = useState({ nome: "", telefone: "" })
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" })
  const [message, setMessage] = useState("")
  useEffect(() => { if (user) setForm({ nome: user.nome, telefone: user.telefone }) }, [user])
  if (!user) return null
  const save = () => setMessage(updateProfile(form).message)
  const change = () => { if (password.next !== password.confirm) { setMessage("As senhas não coincidem."); return } const result = changePassword(password.current, password.next); setMessage(result.message); if (result.success) setPassword({ current: "", next: "", confirm: "" }) }
  const remove = () => { if (window.confirm("Excluir sua conta e todos os dados associados?")) { const result = deleteAccount(); setMessage(result.message) } }
  return <div className="min-h-screen flex flex-col"><Header/><main className="flex-1 py-8"><div className="container mx-auto px-4 max-w-3xl"><Link href="/dashboard/visitante" className="inline-flex items-center gap-2 text-muted-foreground mb-6"><ArrowLeft className="h-4 w-4"/>Voltar ao painel</Link><h1 className="text-3xl font-serif font-bold mb-6">Meu perfil</h1>{message && <Alert className="mb-6"><AlertDescription>{message}</AlertDescription></Alert>}<Tabs defaultValue="dados" className="space-y-6"><TabsList><TabsTrigger value="dados">Dados</TabsTrigger><TabsTrigger value="seguranca">Segurança</TabsTrigger></TabsList><TabsContent value="dados"><Card><CardHeader><CardTitle>Dados pessoais</CardTitle><CardDescription>Atualize as informações da sua conta.</CardDescription></CardHeader><CardContent className="space-y-4"><div><Label>Nome</Label><div className="relative"><User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input className="pl-9" value={form.nome} onChange={(e)=>setForm({...form,nome:e.target.value})}/></div></div><div><Label>E-mail</Label><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input className="pl-9" value={user.email} disabled/></div></div><div><Label>Telefone</Label><div className="relative"><Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input className="pl-9" value={form.telefone} onChange={(e)=>setForm({...form,telefone:e.target.value})}/></div></div><Button onClick={save}><Save className="mr-2 h-4 w-4"/>Salvar alterações</Button></CardContent></Card></TabsContent><TabsContent value="seguranca"><Card><CardHeader><CardTitle>Alterar senha</CardTitle></CardHeader><CardContent className="space-y-4"><div><Label>Senha atual</Label><Input type="password" value={password.current} onChange={(e)=>setPassword({...password,current:e.target.value})}/></div><div><Label>Nova senha</Label><Input type="password" value={password.next} onChange={(e)=>setPassword({...password,next:e.target.value})}/></div><div><Label>Confirmar nova senha</Label><Input type="password" value={password.confirm} onChange={(e)=>setPassword({...password,confirm:e.target.value})}/></div><Button onClick={change}>Alterar senha</Button></CardContent></Card><Card className="mt-6 border-destructive/50"><CardHeader><CardTitle className="text-destructive">Excluir conta</CardTitle></CardHeader><CardContent><Button variant="destructive" onClick={remove}>Excluir minha conta</Button></CardContent></Card></TabsContent></Tabs></div></main><Footer/></div>
}
