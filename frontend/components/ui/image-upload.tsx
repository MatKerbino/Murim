"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onChange: (file: File | null) => void
  value?: string
  preview?: string
}

export function ImageUpload({ onChange, value, preview }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview || value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    
    if (file) {
      // Criar URL para preview local
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      onChange(file)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <div 
        className="border-2 border-dashed rounded-md p-4 hover:bg-muted/50 transition cursor-pointer"
        onClick={handleButtonClick}
      >
        {previewUrl ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <Image 
              src={previewUrl} 
              alt="Preview" 
              fill 
              className="object-cover"
            />
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Clique para selecionar uma imagem</p>
          </div>
        )}
      </div>
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  )
}

