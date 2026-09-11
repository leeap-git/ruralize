"use client"

import { useRef, useState } from "react"
import { ImagePlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const MAX_BYTES = 8 * 1024 * 1024
const MAX_DIMENSION = 1600
const MAX_IMAGES_DEFAULT = 6
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif"

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Não foi possível ler a imagem."))
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."))
    reader.readAsDataURL(file)
  })
}

async function optimizeImage(file: File): Promise<string> {
  if (file.size > MAX_BYTES) throw new Error("Cada imagem pode ter no máximo 8 MB antes da otimização.")
  const source = await readAsDataUrl(file)
  const image = new Image()

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error("O arquivo selecionado não é uma imagem válida."))
    image.src = source
  })

  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight))
  const width = Math.max(1, Math.round(image.naturalWidth * scale))
  const height = Math.max(1, Math.round(image.naturalHeight * scale))
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Não foi possível processar a imagem.")

  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL("image/webp", 0.82)
}

type ImageUploadProps = {
  images: string[]
  maxImages?: number
  onChange: (images: string[]) => void
  label?: string
}

export function ImageUpload({ images, maxImages = MAX_IMAGES_DEFAULT, onChange, label = "Imagens" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setError("")
    const remaining = Math.max(0, maxImages - images.length)
    if (!remaining) {
      setError(`Você pode adicionar no máximo ${maxImages} imagens.`)
      return
    }

    const selected = Array.from(files).slice(0, remaining)
    const invalid = selected.find((file) => !file.type.startsWith("image/"))
    if (invalid) {
      setError("Selecione apenas arquivos de imagem.")
      return
    }

    setLoading(true)
    try {
      const converted: string[] = []
      for (const file of selected) converted.push(await optimizeImage(file))
      onChange([...images, ...converted])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível adicionar a imagem.")
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const remove = (index: number) => onChange(images.filter((_, i) => i !== index))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-xs text-muted-foreground">{images.length}/{maxImages}</span>
      </div>

      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept={ACCEPT}
        multiple={maxImages > 1}
        onChange={(event) => void addFiles(event.target.files)}
      />

      <Button type="button" variant="outline" disabled={loading || images.length >= maxImages} onClick={() => inputRef.current?.click()}>
        <ImagePlus className="mr-2 h-4 w-4" />
        {loading ? "Processando..." : "Adicionar imagem"}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((src, index) => (
            <div key={`${src.slice(0, 30)}-${index}`} className="relative overflow-hidden rounded-lg border bg-muted aspect-video">
              <img src={src} alt={`Imagem ${index + 1}`} className="h-full w-full object-cover" />
              <Button type="button" size="icon" variant="destructive" className="absolute right-2 top-2 h-8 w-8" onClick={() => remove(index)} aria-label={`Remover imagem ${index + 1}`}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">JPG, PNG, WEBP ou GIF. A imagem é otimizada automaticamente antes de ser salva.</p>
    </div>
  )
}
