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
    <div className="mb-4 sm:mb-6 px-2 sm:px-5 py-4 sm:py-6 relative group hover:bg-[#252525]/50 transition-all duration-500 rounded-sm overflow-hidden">
      {/* Shine effect on hover - rafine parlaklık */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.1) 50%, transparent 100%)',
          animation: 'shine 3s infinite',
        }}
      />

      {/* Subtle left border accent with gold gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex justify-between items-start gap-2 sm:gap-6 relative z-10">
        <div className="flex-1 min-w-0">
          {/* Optional badge */}
          {product.badge && (
            <span className="inline-block text-[9px] sm:text-[10px] px-2 py-0.5 sm:py-1 rounded-sm mb-2 font-normal tracking-wide uppercase bg-[#2a2210] text-[#D4AF37] border border-[#D4AF37]/30">
              {product.badge.replace(/_/g, ' ')}
            </span>
          )}

          <h3 className="text-sm sm:text-lg md:text-xl font-['Playfair_Display',serif] mb-1 sm:mb-2 font-semibold tracking-wide text-[#D4AF37]">
            {name}
          </h3>
          <p className="text-[10px] sm:text-xs md:text-sm text-[#D4C5B0] font-light leading-relaxed font-sans line-clamp-2 sm:line-clamp-none">
            {description}
          </p>
        </div>

        {/* Dotted line ve fiyat */}
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          <div className="hidden md:block w-12 lg:w-16 border-b border-dotted border-[#D4AF37] opacity-30" />
          <span className="text-sm sm:text-lg md:text-xl font-semibold whitespace-nowrap font-['Playfair_Display',serif] text-[#D4AF37]">
            {product.price} ₺
          </span>
        </div>
      </div>

      {/* Subtle bottom border with shimmer */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
    </div>
  )
}
