"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Settings, 
  LogOut, 
  Search,
  CalendarCheck,
  CalendarX,
  CalendarClock,
  Heart,
  Star,
  MessageSquare
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { loadStore, crudReserva } from "@/lib/client-store"
import type { Store } from "@/lib/client-store"

const statusConfig = {
  confirmada: { label: "Confirmada", variant: "default" as const, icon: CalendarCheck },
  pendente: { label: "Aguardando Pagamento", variant: "secondary" as const, icon: CalendarClock },
  concluida: { label: "Concluída", variant: "outline" as const, icon: CalendarCheck },
  cancelada: { label: "Cancelada", variant: "destructive" as const, icon: CalendarX },
}

export default function DashboardVisitantePage() {
  const { user, userType, isLoading, logout } = useAuth()
  const router = useRouter()
  const [store, setStore] = useState<Store | null>(null)

  useEffect(() => {
    const refresh = () => setStore(loadStore())
    if (!isLoading && user && userType === "visitante") refresh()
    window.addEventListener("turismo-rural-store", refresh)
    return () => window.removeEventListener("turismo-rural-store", refresh)
  }, [isLoading, user, userType])

  if (isLoading || !user || userType !== "visitante") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  const usuario = user?.tipo === "visitante" ? user : null

  if (!usuario || !store) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div><p className="text-muted-foreground">Carregando dados...</p></div></div>
  }

  // Cria uma referência estável depois da guarda para o TypeScript não tratar o estado como possivelmente nulo.
  const currentStore = store
  const reservasUsuario = currentStore.reservas.filter(r => r.usuarioId === usuario.id)

  const reservas = reservasUsuario.map(reserva => {
    const propriedade = reserva.propriedadeId ? currentStore.propriedades.find(p => p.id === reserva.propriedadeId) : undefined
    const atividade = reserva.atividadeId ? currentStore.atividades.find(a => a.id === reserva.atividadeId) : null
    
    return {
      id: reserva.id,
      propriedade: propriedade?.nome || "Propriedade",
      atividade: atividade?.nome || "Hospedagem",
      imagem: propriedade?.imagens[0] || "/images/fazenda-boa-vista.jpg",
      dataInicio: reserva.dataInicio,
      dataFim: reserva.dataFim,
      valor: reserva.valorTotal,
      status: reserva.status,
      local: propriedade ? `${propriedade.cidade}, ${propriedade.estado}` : "",
    }
  })

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleCancelReservation = (id: string) => {
    if (!usuario || !window.confirm("Cancelar esta reserva?")) return
    try { crudReserva(id, { status: "cancelada" }, usuario.id) } catch (error) { alert(error instanceof Error ? error.message : "Não foi possível cancelar a reserva.") }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-64 shrink-0">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="font-semibold text-foreground">{usuario.nome}</h2>
                    <p className="text-sm text-muted-foreground">{usuario.email}</p>
                    <Badge variant="secondary" className="mt-2">Visitante</Badge>
                  </div>

                  <nav className="space-y-1">
                    <Link 
                      href="/dashboard/visitante" 
                      className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary font-medium"
                    >
                      <Calendar className="h-4 w-4" />
                      Minhas Reservas
                    </Link>
                    <Link 
                      href="/dashboard/visitante/favoritos" 
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <Heart className="h-4 w-4" />
                      Favoritos
                    </Link>
                    <Link 
                      href="/dashboard/visitante/avaliacoes" 
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <Star className="h-4 w-4" />
                      Minhas Avaliações
                    </Link>
                    <Link 
                      href="/dashboard/visitante/mensagens" 
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Mensagens
                    </Link>
                    <Link 
                      href="/propriedades" 
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <Search className="h-4 w-4" />
                      Buscar Propriedades
                    </Link>
                    <Link 
                      href="/dashboard/visitante/perfil" 
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Configurações
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Minhas Reservas
                </h1>
                <p className="text-muted-foreground">
                  Gerencie suas reservas e acompanhe o status
                </p>
              </div>

              <Tabs defaultValue="todas" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="todas">Todas ({reservas.length})</TabsTrigger>
                  <TabsTrigger value="confirmadas">Confirmadas ({reservas.filter(r => r.status === "confirmada").length})</TabsTrigger>
                  <TabsTrigger value="pendentes">Pendentes ({reservas.filter(r => r.status === "pendente").length})</TabsTrigger>
                  <TabsTrigger value="historico">Histórico ({reservas.filter(r => r.status === "concluida").length})</TabsTrigger>
                </TabsList>

                <TabsContent value="todas" className="space-y-4">
                  {reservas.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold text-foreground mb-2">Nenhuma reserva encontrada</h3>
                        <p className="text-muted-foreground mb-4">Você ainda não fez nenhuma reserva.</p>
                        <Button asChild>
                          <Link href="/propriedades">Explorar Propriedades</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    reservas.map((reserva) => {
                      const config = statusConfig[reserva.status as keyof typeof statusConfig]
                      const StatusIcon = config.icon
                      
                      return (
                        <Card key={reserva.id}>
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                              <div className="relative w-full md:w-48 h-40 md:h-auto shrink-0">
                                <Image
                                  src={reserva.imagem}
                                  alt={reserva.propriedade}
                                  fill
                                  className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                                />
                              </div>
                              <div className="flex-1 p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-semibold text-foreground">{reserva.propriedade}</h3>
                                    <p className="text-sm text-primary">{reserva.atividade}</p>
                                  </div>
                                  <Badge variant={config.variant} className="shrink-0">
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {config.label}
                                  </Badge>
                                </div>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {reserva.local}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {reserva.dataInicio} - {reserva.dataFim}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="text-lg font-bold text-foreground">
                                      R$ {reserva.valor.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                      <Link href={`/dashboard/visitante/reservas/${reserva.id}`}>Ver Detalhes</Link>
                                    </Button>
                                    {reserva.status === "pendente" && (
                                      <Button size="sm" asChild>
                                        <Link href={`/dashboard/visitante/reservas/${reserva.id}/pagamento`}>Pagar Agora</Link>
                                      </Button>
                                    )}
                                    {reserva.status === "confirmada" && (
                                      <Button variant="destructive" size="sm" onClick={() => handleCancelReservation(reserva.id)}>Cancelar</Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </TabsContent>

                <TabsContent value="confirmadas" className="space-y-4">
                  {reservas.filter(r => r.status === "confirmada").length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">Nenhuma reserva confirmada.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    reservas.filter(r => r.status === "confirmada").map((reserva) => (
                      <Card key={reserva.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{reserva.propriedade}</h3>
                              <p className="text-sm text-muted-foreground">{reserva.dataInicio} - {reserva.dataFim}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/dashboard/visitante/reservas/${reserva.id}`}>Ver Detalhes</Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="pendentes" className="space-y-4">
                  {reservas.filter(r => r.status === "pendente").length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">Nenhuma reserva pendente.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    reservas.filter(r => r.status === "pendente").map((reserva) => (
                      <Card key={reserva.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{reserva.propriedade}</h3>
                              <p className="text-sm text-muted-foreground">{reserva.dataInicio} - {reserva.dataFim}</p>
                            </div>
                            <Button size="sm" asChild>
                              <Link href={`/dashboard/visitante/reservas/${reserva.id}/pagamento`}>Pagar Agora</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="historico" className="space-y-4">
                  {reservas.filter(r => r.status === "concluida").length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">Nenhuma reserva concluída ainda.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    reservas.filter(r => r.status === "concluida").map((reserva) => (
                      <Card key={reserva.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{reserva.propriedade}</h3>
                              <p className="text-sm text-muted-foreground">{reserva.dataInicio} - {reserva.dataFim}</p>
                            </div>
                            <Badge variant="outline">Concluída</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
