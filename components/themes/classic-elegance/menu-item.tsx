"use client"

import { useLanguage } from "@/contexts/language-context"

interface MenuItemProps {
  product: {
    id: string
    name: string
    name_en?: string
    description: string
    description_en?: string
    price: number
    image?: string
    badge?: string | null
  }
  featured?: boolean
}

export function MenuItem({ product, featured = false }: MenuItemProps) {
  const { language } = useLanguage()

  const name = language === "en" && product.name_en ? product.name_en : product.name
  const description = language === "en" && product.description_en ? product.description_en : product.description

  if (featured && product.image) {
    // Öne çıkan ürün - görsel ile
    return (
      <div className="mb-12 flex flex-col items-center">
        <div className="w-full max-w-md mb-6">
          <div className="relative p-1 bg-gradient-to-br from-[#C9A961] via-[#D4AF37] to-[#C9A961] rounded-lg">
            <img
              src={product.image}
              alt={name}
              className="w-full h-64 object-cover rounded-md"
            />
          </div>
        </div>
        <div className="text-center max-w-xl">
          <h3 className="text-2xl sm:text-3xl font-serif text-[#C9A961] mb-3">
            {name}
          </h3>
          <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed mb-3">
            {description}
          </p>
          <span className="text-xl text-[#C9A961] font-light">{product.price} ₺</span>
        </div>
      </div>
    )
  }

  // Normal ürün - görselsiz
  return (
    <div className="mb-8 px-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-xl sm:text-2xl font-serif text-[#C9A961] mb-2">
            {name}
          </h3>
          <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
            {description}
          </p>
        </div>

        {/* Dotted line ve fiyat */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:block w-12 border-b border-dotted border-[#C9A961] opacity-40" />
          <span className="text-lg sm:text-xl text-[#C9A961] font-light whitespace-nowrap">
            {product.price} ₺
          </span>
        </div>
      </div>
    </div>
  )
}
