"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MinhaPropriedadePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard/empreendedor/propriedades")
  }, [router])

  return <div className="p-10 text-muted-foreground">Abrindo suas propriedades...</div>
}
