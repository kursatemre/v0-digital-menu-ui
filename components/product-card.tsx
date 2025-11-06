"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { LanguageAwareText } from "@/components/language-aware-text"

interface ProductCardProps {
  product: {
    id: string
    name: string
    name_en: string
    description: string
    description_en: string
    price: number
    badge?: string | null
  }
  onAddToCart: (product: { id: string; name: string; price: number }, quantity: number) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    onAddToCart({ id: product.id, name: product.name, price: product.price }, quantity)
    setQuantity(1)
  }

  const incrementQuantity = () => setQuantity((q) => q + 1)
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1))

  const { language } = useLanguage()

  const displayName = language === "tr" ? product.name : product.name_en
  const displayDescription = language === "tr" ? product.description : product.description_en

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative w-full h-48 bg-muted flex items-center justify-center overflow-hidden">
        <Image
          src={`/.jpg?height=192&width=300&query=${encodeURIComponent(displayName)}`}
          alt={displayName}
          width={300}
          height={192}
          className="w-full h-full object-cover"
        />
        {product.badge && (
          <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
            {product.badge}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-foreground mb-1">{displayName}</h3>
        <p className="text-muted-foreground text-sm mb-4">{displayDescription}</p>

        {/* Price and Quantity */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-primary">₺{product.price}</div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-2 bg-muted rounded-lg">
            <button
              onClick={decrementQuantity}
              className="px-2 py-1 text-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              −
            </button>
            <span className="px-3 py-1 font-medium text-foreground w-8 text-center">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="px-2 py-1 text-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button onClick={handleAddToCart} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          <LanguageAwareText tr="Sepete Ekle" en="Add to Cart" />
        </Button>
      </div>
    </div>
  )
}
