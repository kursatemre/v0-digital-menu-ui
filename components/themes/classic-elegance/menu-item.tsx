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
    // Öne çıkan ürün - görsel ile (sadece ilk ürün)
    return (
      <div className="mb-16 flex flex-col items-center">
        <div className="w-full max-w-md mb-6">
          {/* Ornate gold frame around featured image */}
          <div className="relative p-2 bg-gradient-to-br from-[#C9A961] via-[#D4AF37] to-[#C9A961] rounded-sm">
            <div className="p-1 bg-[#1a1a1a] rounded-sm">
              <img
                src={product.image}
                alt={name}
                className="w-full h-72 object-cover rounded-sm"
              />
            </div>
          </div>
        </div>
        <div className="text-center max-w-xl">
          <h3 className="text-2xl sm:text-3xl font-['Playfair_Display',serif] text-[#C9A961] mb-4 font-semibold">
            {name}
          </h3>
          <p className="text-sm sm:text-base text-[#E8E0D5] font-light leading-relaxed mb-4 font-sans italic">
            {description}
          </p>
          <span className="text-2xl text-[#C9A961] font-light font-['Playfair_Display',serif]">
            {product.price} ₺
          </span>
        </div>
      </div>
    )
  }

  // Normal ürün - görselsiz, sadece metin
  return (
    <div className="mb-8 px-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-xl sm:text-2xl font-['Playfair_Display',serif] text-[#C9A961] mb-2 font-medium">
            {name}
          </h3>
          <p className="text-sm sm:text-base text-[#D4C5B0] font-light leading-relaxed font-sans">
            {description}
          </p>
        </div>

        {/* Dotted line ve fiyat */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:block w-16 border-b border-dotted border-[#C9A961] opacity-50" />
          <span className="text-lg sm:text-xl text-[#C9A961] font-light whitespace-nowrap font-['Playfair_Display',serif]">
            {product.price} ₺
          </span>
        </div>
      </div>
    </div>
  )
}
