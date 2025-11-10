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

  // Tüm ürünler görselsiz - sadece metin formatında
  return (
    <div className="mb-6 px-5 py-6 relative group hover:bg-[#252525]/50 transition-all duration-500 rounded-sm overflow-hidden">
      {/* Shine effect on hover - rafine parlaklık */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.1) 50%, transparent 100%)',
          animation: 'shine 3s infinite',
        }}
      />

      {/* Subtle left border accent with gold gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#FFD700]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex justify-between items-start gap-6 relative z-10">
        <div className="flex-1">
          {/* Optional badge */}
          {product.badge && (
            <span className="inline-block text-xs text-[#FFD700] border border-[#FDB931]/50 px-3 py-1 rounded-full mb-3 font-light tracking-widest uppercase shadow-sm">
              {product.badge}
            </span>
          )}

          <h3 className="text-lg sm:text-xl font-['Playfair_Display',serif] text-[#FFD700] mb-2 font-semibold tracking-wide">
            {name}
          </h3>
          <p className="text-xs sm:text-sm text-[#D4C5B0] font-light leading-relaxed font-sans">
            {description}
          </p>
        </div>

        {/* Dotted line ve fiyat */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:block w-16 border-b border-dotted border-[#FFD700] opacity-30" />
          <span className="text-lg sm:text-xl text-[#FFD700] font-semibold whitespace-nowrap font-['Playfair_Display',serif]">
            {product.price} ₺
          </span>
        </div>
      </div>

      {/* Subtle bottom border with shimmer */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent" />
    </div>
  )
}
