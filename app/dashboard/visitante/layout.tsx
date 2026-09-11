"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function VisitanteDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, userType, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && (!user || userType !== "visitante")) router.replace(`/login?next=${encodeURIComponent(pathname)}`)
  }, [isLoading, user, userType, router, pathname])

  if (isLoading || !user || userType !== "visitante") return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando sessão...</div>
  return children
}
