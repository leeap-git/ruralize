import Image from "next/image"
import Link from "next/link"
import { MapPin, Star, Users, Bed } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface PropertyCardProps {
  id: string
  name: string
  location: string
  description: string
  image: string
  rating: number
  reviews: number
  price: number
  capacity: number
  rooms: number
  tags: string[]
}

export function PropertyCard({
  id,
  name,
  location,
  description,
  image,
  rating,
  reviews,
  price,
  capacity,
  rooms,
  tags,
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-card/90 text-card-foreground">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1">{name}</h3>
          <div className="flex items-center gap-1 text-sm shrink-0">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviews})</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4" />
          {location}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Até {capacity} pessoas</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{rooms} quartos</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-foreground">R$ {price.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">/noite</span>
        </div>
        <Button asChild>
          <Link href={`/propriedades/${id}`}>Ver detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
