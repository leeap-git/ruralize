"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-foreground/50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
          Descubra o Encanto do
          <span className="block text-accent">Ruralize</span>
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed text-pretty">
          Conecte-se com a natureza. Encontre propriedades rurais, atividades ao ar livre e experiências autênticas no campo brasileiro.
        </p>

        <div className="max-w-2xl mx-auto bg-card rounded-lg p-2 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por cidade ou região..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button size="lg" className="h-12 px-8" asChild>
              <Link href={`/propriedades?q=${searchQuery}`}>
                <Search className="h-5 w-5 mr-2" />
                Buscar
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <span className="text-white/80 text-sm">Destinos populares:</span>
          <Link href="/propriedades?q=ourinhos" className="text-white text-sm hover:text-accent transition-colors underline underline-offset-4">
            Ourinhos
          </Link>
          <Link href="/propriedades?q=marilia" className="text-white text-sm hover:text-accent transition-colors underline underline-offset-4">
            Marília
          </Link>
          <Link href="/propriedades?q=assis" className="text-white text-sm hover:text-accent transition-colors underline underline-offset-4">
            Assis
          </Link>
          <Link href="/propriedades?q=bauru" className="text-white text-sm hover:text-accent transition-colors underline underline-offset-4">
            Bauru
          </Link>
        </div>
      </div>
    </section>
  )
}
