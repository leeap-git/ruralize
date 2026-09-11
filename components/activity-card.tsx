import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Users, MapPin } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface ActivityCardProps {
  id: string
  name: string
  property: string
  location: string
  description: string
  image: string
  date: string
  time: string
  price: number
  spots: number
  spotsAvailable: number
  type: string
}

export function ActivityCard({
  id,
  name,
  property,
  location,
  description,
  image,
  date,
  time,
  price,
  spots,
  spotsAvailable,
  type,
}: ActivityCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative h-40 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-primary text-primary-foreground">
            {type}
          </Badge>
        </div>
        {spotsAvailable < 5 && spotsAvailable > 0 && (
          <div className="absolute top-3 right-3">
            <Badge variant="destructive">
              Últimas {spotsAvailable} vagas
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-foreground line-clamp-1 mb-1">{name}</h3>
        <p className="text-sm text-primary font-medium mb-2">{property}</p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4" />
          {location}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{spotsAvailable}/{spots} vagas</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-foreground">R$ {price.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">/pessoa</span>
        </div>
        {spotsAvailable === 0 ? (
          <Button disabled>Esgotado</Button>
        ) : (
          <Button asChild>
            <Link href={`/atividades/${id}`}>Reservar</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
