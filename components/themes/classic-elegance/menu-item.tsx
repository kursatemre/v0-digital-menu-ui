"use client"

import { useLanguage } from "@/contexts/language-context"
import { Plus } from "lucide-react"

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
  onAddToCart?: (product: { id: string; name: string; price: number }) => void
}

export function MenuItem({ product, featured = false, onAddToCart }: MenuItemProps) {
  const { language } = useLanguage()

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ id: product.id, name: product.name, price: product.price })
    }
  }

  const name = language === "en" && product.name_en ? product.name_en : product.name
  const description = language === "en" && product.description_en ? product.description_en : product.description

  // Badge translations
  const getBadgeText = (badge: string) => {
    const badgeKey = badge.toUpperCase().replace(/ /g, '_')

    const badgeTranslations: { [key: string]: { tr: string; en: string } } = {
      'SEFIN_ONERISI': { tr: 'Şefin Önerisi', en: 'Chef Special' },
      'SEFİN_ONERİSİ': { tr: 'Şefin Önerisi', en: 'Chef Special' },
      'GUNUN_ONERILERI': { tr: 'Günün Önerileri', en: 'Daily Specials' },
      'GUNUN_ONERISI': { tr: 'Günün Önerisi', en: 'Daily Special' },
      'POPULER': { tr: 'Popüler', en: 'Popular' },
      'YENI': { tr: 'Yeni', en: 'New' },
      'VEGETERYAN': { tr: 'Vejetaryen', en: 'Vegetarian' },
      'VEGAN': { tr: 'Vegan', en: 'Vegan' },
      'GLUTEN_FREE': { tr: 'Glütensiz', en: 'Gluten Free' },
      'GLÜTENSIZ': { tr: 'Glütensiz', en: 'Gluten Free' },
      'ORGANIK': { tr: 'Organik', en: 'Organic' },
      'ORGANIC': { tr: 'Organik', en: 'Organic' },
    }

    const translation = badgeTranslations[badgeKey]
    if (translation) {
      return language === 'en' ? translation.en : translation.tr
    }

    // Fallback: replace underscores with spaces and capitalize
    return badge.replace(/_/g, ' ')
  }

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
              {getBadgeText(product.badge)}
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
          {/* Add to Cart Button - Square with + icon */}
          {onAddToCart && (
            <button
              onClick={handleAddToCart}
              className="ml-2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#1a1a1a] hover:bg-[#2a2210]/50 transition-all duration-300 rounded-sm group"
              aria-label="Add to cart"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* Subtle bottom border with shimmer */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
    </div>
  )
}
