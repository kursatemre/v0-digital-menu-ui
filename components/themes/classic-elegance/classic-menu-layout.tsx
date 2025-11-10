"use client"

import { CategoryHeader } from "./category-header"
import { MenuItem } from "./menu-item"
import { useLanguage } from "@/contexts/language-context"

interface Product {
  id: string
  name: string
  name_en?: string
  description: string
  description_en?: string
  price: number
  categoryId: string
  image?: string
  badge?: string | null
}

interface Category {
  id: string
  name: string
  name_en?: string
  image?: string
}

interface ClassicMenuLayoutProps {
  categories: Category[]
  products: Product[]
  headerSettings?: {
    title?: string
    subtitle?: string
    logo?: string
  }
}

export function ClassicMenuLayout({
  categories,
  products,
  headerSettings
}: ClassicMenuLayoutProps) {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-[#1a1a1a] relative overflow-x-hidden">
      {/* CSS for shine animation */}
      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Rich suede/fabric texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.5' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      {/* Additional subtle diagonal lines for fabric feel */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.1) 2px,
            rgba(255, 255, 255, 0.1) 4px
          )`,
        }}
      />

      {/* Header */}
      <header className="relative py-20 px-4 text-center border-b border-[#D4AF37]/30">
        {/* Language Toggle Button */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8">
          <button
            onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
            className="group relative px-4 py-2 bg-[#1a1a1a] border border-[#D4AF37]/40 rounded-sm transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#2a2210]/30"
          >
            <span className="relative text-sm font-['Playfair_Display',serif] font-medium tracking-wider text-[#D4AF37]">
              {language === "tr" ? "EN" : "TR"}
            </span>
          </button>
        </div>

        {/* Top decorative ornament */}
        <div className="flex justify-center mb-8">
          <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20 Q 30 15, 50 20 T 90 20" stroke="#D4AF37" strokeWidth="1.5" fill="none"/>
            <circle cx="50" cy="20" r="2.5" fill="#D4AF37" opacity="0.8"/>
            <circle cx="35" cy="17" r="1.5" fill="#D4AF37" opacity="0.5"/>
            <circle cx="65" cy="17" r="1.5" fill="#D4AF37" opacity="0.5"/>
          </svg>
        </div>

        {headerSettings?.logo && (
          <div className="flex justify-center mb-8">
            <div className="relative p-2 bg-gradient-to-br from-[#FFD700]/20 via-transparent to-[#FDB931]/20 rounded-full">
              <img
                src={headerSettings.logo}
                alt="Logo"
                className="h-24 w-auto object-contain"
              />
            </div>
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-['Playfair_Display',serif] tracking-[0.25em] mb-6 font-semibold text-[#D4AF37]">
          {headerSettings?.title || "MENU"}
        </h1>

        {headerSettings?.subtitle && (
          <p className="text-[#D4C5B0] font-light text-lg sm:text-xl tracking-[0.3em] font-sans italic">
            {headerSettings.subtitle}
          </p>
        )}

        {/* Decorative line */}
        <div className="flex justify-center mt-10">
          <svg width="200" height="16" viewBox="0 0 200 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 8 L90 8" stroke="#D4AF37" strokeWidth="1" opacity="0.5"/>
            <path d="M110 8 L180 8" stroke="#D4AF37" strokeWidth="1" opacity="0.5"/>
            <circle cx="100" cy="8" r="3" fill="#D4AF37" opacity="0.8"/>
            <circle cx="92" cy="8" r="1.5" fill="#D4AF37" opacity="0.5"/>
            <circle cx="108" cy="8" r="1.5" fill="#D4AF37" opacity="0.5"/>
          </svg>
        </div>
      </header>

      {/* Menu Content */}
      <main className="max-w-7xl mx-auto py-16 relative z-10">
        {categories.map((category, categoryIndex) => {
          const categoryProducts = products.filter(p => p.categoryId === category.id)

          if (categoryProducts.length === 0) return null

          const categoryName = language === "en" && category.name_en
            ? category.name_en
            : category.name

          return (
            <section key={category.id} className="mb-20">
              <CategoryHeader title={categoryName} />

              {/* Two-column layout: Category image on left, products on right */}
              <div className="flex flex-row gap-4 sm:gap-6 lg:gap-10 px-4 items-center">
                {/* Left Column: Category Image - Portrait */}
                {category.image && (
                  <div className="w-[120px] sm:w-[180px] md:w-[220px] lg:w-[270px] xl:w-[320px] flex-shrink-0">
                    <div className="lg:sticky lg:top-8">
                      {/* Elegant frame with decorative thin borders */}
                      <div className="relative p-[2px] bg-gradient-to-br from-[#D4AF37] via-[#C9A961] to-[#D4AF37] rounded-sm shadow-xl overflow-hidden">
                        {/* Shine effect overlay */}
                        <div
                          className="absolute inset-0 opacity-40 pointer-events-none"
                          style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                            animation: 'shine 4s infinite',
                          }}
                        />

                        {/* Inner decorative border */}
                        <div className="relative p-[1px] bg-[#1a1a1a] rounded-sm">
                          <div className="p-1 bg-gradient-to-br from-[#D4AF37]/10 to-[#C9A961]/10 rounded-sm">
                            <img
                              src={category.image}
                              alt={categoryName}
                              className="w-full aspect-[9/16] object-cover rounded-sm"
                            />
                          </div>
                        </div>

                        {/* Corner decorative accents */}
                        <div className="absolute top-1 left-1 w-3 h-3 sm:w-4 sm:h-4 border-t border-l border-[#D4AF37]" />
                        <div className="absolute top-1 right-1 w-3 h-3 sm:w-4 sm:h-4 border-t border-r border-[#D4AF37]" />
                        <div className="absolute bottom-1 left-1 w-3 h-3 sm:w-4 sm:h-4 border-b border-l border-[#D4AF37]" />
                        <div className="absolute bottom-1 right-1 w-3 h-3 sm:w-4 sm:h-4 border-b border-r border-[#D4AF37]" />
                      </div>

                      {/* Decorative element below image */}
                      <div className="flex justify-center mt-4">
                        <svg width="120" height="20" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 10 Q 40 7, 60 10 T 105 10" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6"/>
                          <circle cx="60" cy="10" r="2" fill="#D4AF37" opacity="0.8"/>
                          <circle cx="48" cy="9" r="1.5" fill="#D4AF37" opacity="0.5"/>
                          <circle cx="72" cy="9" r="1.5" fill="#D4AF37" opacity="0.5"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Right Column: Products (2-3 items in grid) */}
                <div className="flex-1">
                  <div className="space-y-2">
                    {categoryProducts.map((product, index) => (
                      <MenuItem
                        key={product.id}
                        product={product}
                        featured={false}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Category separator */}
              {categoryIndex < categories.length - 1 && (
                <div className="flex justify-center mt-16">
                  <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
                </div>
              )}
            </section>
          )
        })}
      </main>

      {/* Footer */}
      <footer className="relative py-16 px-4 text-center border-t border-[#D4AF37]/30 mt-20">
        <div className="flex justify-center mb-6">
          <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ornate footer decoration */}
            <path d="M25 20 Q 55 15, 90 20 Q 125 25, 155 20" stroke="#D4AF37" strokeWidth="1.5" fill="none"/>
            <path d="M5 20 L20 20 M160 20 L175 20" stroke="#D4AF37" strokeWidth="1"/>
            <circle cx="90" cy="20" r="2.5" fill="#D4AF37" opacity="0.8"/>
            <circle cx="102" cy="20" r="1.5" fill="#D4AF37" opacity="0.5"/>
            <circle cx="78" cy="20" r="1.5" fill="#D4AF37" opacity="0.5"/>
            <circle cx="90" cy="13" r="1.5" fill="#D4AF37" opacity="0.5"/>
            <circle cx="90" cy="27" r="1.5" fill="#D4AF37" opacity="0.5"/>
          </svg>
        </div>
        <p className="text-base sm:text-lg font-light tracking-[0.3em] font-['Playfair_Display',serif] italic mb-4 text-[#D4AF37]">
          BON APPÉTIT
        </p>
        <p className="text-[#B8956A] text-xs tracking-[0.3em] font-light uppercase">
          Fine Dining Experience
        </p>
      </footer>
    </div>
  )
}
