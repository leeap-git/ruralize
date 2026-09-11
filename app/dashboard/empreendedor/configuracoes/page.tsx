"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell, Lock, LogOut, Save, Settings } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"

const KEY="turismo_rural_notifications_v1"
const defaults={emailReservas:true,emailMensagens:true,emailMarketing:false,pushReservas:true,pushMensagens:true}
export default function ConfiguracoesEmpreendedorPage(){
  const {user,logout}=useAuth(); const [settings,setSettings]=useState(defaults); const [saved,setSaved]=useState(false)
  useEffect(()=>{try{const raw=localStorage.getItem(`${KEY}_${user?.id}`); if(raw)setSettings({...defaults,...JSON.parse(raw)})}catch{}},[user?.id])
  const save=()=>{if(user)localStorage.setItem(`${KEY}_${user.id}`,JSON.stringify(settings));setSaved(true);setTimeout(()=>setSaved(false),1500)}
  const exit=()=>{logout()}
  return <div className="min-h-screen flex flex-col"><Header/><main className="flex-1 py-8"><div className="container mx-auto px-4 max-w-3xl space-y-6"><Link href="/dashboard/empreendedor" className="text-sm text-muted-foreground">← Voltar ao painel</Link><div><h1 className="text-3xl font-serif font-bold">Configurações</h1><p className="text-muted-foreground">Preferências da conta de {user?.nome}.</p></div>{saved&&<Alert><AlertDescription>Preferências salvas.</AlertDescription></Alert>}<Card><CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5"/>Notificações</CardTitle><CardDescription>Estas preferências ficam locais no protótipo e serão persistidas no backend.</CardDescription></CardHeader><CardContent className="space-y-5">{Object.entries(settings).map(([key,value])=><div key={key} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"><div><p className="font-medium">{({emailReservas:"E-mail de novas reservas",emailMensagens:"E-mail de novas mensagens",emailMarketing:"E-mails de novidades",pushReservas:"Notificações de reservas",pushMensagens:"Notificações de mensagens"} as Record<string,string>)[key]}</p></div><Switch checked={value} onCheckedChange={(checked)=>setSettings(s=>({...s,[key]:checked}))}/></div>)}<Button onClick={save}><Save className="h-4 w-4 mr-2"/>Salvar preferências</Button></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5"/>Conta</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2"><Button variant="outline" asChild><Link href="/dashboard/empreendedor/perfil"><Lock className="h-4 w-4 mr-2"/>Segurança e perfil</Link></Button><Button variant="destructive" onClick={exit}><LogOut className="h-4 w-4 mr-2"/>Sair</Button></CardContent></Card></div></main><Footer/></div>
}
