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
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-[#1a1a1a] relative overflow-x-hidden">
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
      <header className="relative py-20 px-4 text-center border-b border-[#C9A961]/30">
        {/* Top decorative ornament */}
        <div className="flex justify-center mb-8">
          <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20 Q 30 15, 50 20 T 90 20" stroke="#C9A961" strokeWidth="1.5" fill="none"/>
            <circle cx="50" cy="20" r="3" fill="#C9A961"/>
            <circle cx="35" cy="17" r="1.5" fill="#C9A961" opacity="0.6"/>
            <circle cx="65" cy="17" r="1.5" fill="#C9A961" opacity="0.6"/>
          </svg>
        </div>

        {headerSettings?.logo && (
          <div className="flex justify-center mb-8">
            <div className="relative p-2 bg-gradient-to-br from-[#C9A961]/20 via-transparent to-[#C9A961]/20 rounded-full">
              <img
                src={headerSettings.logo}
                alt="Logo"
                className="h-24 w-auto object-contain"
              />
            </div>
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-['Playfair_Display',serif] text-[#C9A961] tracking-[0.3em] mb-6 font-bold">
          {headerSettings?.title || "MENU"}
        </h1>

        {headerSettings?.subtitle && (
          <p className="text-[#D4C5B0] font-light text-lg sm:text-xl tracking-[0.3em] font-sans italic">
            {headerSettings.subtitle}
          </p>
        )}

        {/* Decorative line */}
        <div className="flex justify-center mt-10">
          <svg width="250" height="20" viewBox="0 0 250 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 10 L110 10" stroke="#C9A961" strokeWidth="1" opacity="0.6"/>
            <path d="M140 10 L230 10" stroke="#C9A961" strokeWidth="1" opacity="0.6"/>
            <circle cx="125" cy="10" r="4" fill="#C9A961"/>
            <circle cx="115" cy="10" r="2" fill="#C9A961" opacity="0.5"/>
            <circle cx="135" cy="10" r="2" fill="#C9A961" opacity="0.5"/>
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
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4">
                {/* Left Column: Category Image */}
                {category.image && (
                  <div className="lg:w-80 xl:w-96 flex-shrink-0">
                    <div className="sticky top-8">
                      {/* Elegant frame for category image */}
                      <div className="relative p-3 bg-gradient-to-br from-[#C9A961] via-[#D4AF37] to-[#C9A961] rounded-sm shadow-2xl">
                        <div className="p-2 bg-[#1a1a1a] rounded-sm">
                          <img
                            src={category.image}
                            alt={categoryName}
                            className="w-full h-80 object-cover rounded-sm"
                          />
                        </div>
                      </div>

                      {/* Decorative element below image */}
                      <div className="flex justify-center mt-4">
                        <svg width="120" height="20" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 10 Q 35 6, 60 10 T 110 10" stroke="#C9A961" strokeWidth="1" fill="none" opacity="0.6"/>
                          <circle cx="60" cy="10" r="2" fill="#C9A961" opacity="0.8"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Right Column: Products */}
                <div className="flex-1 space-y-4">
                  {categoryProducts.map((product, index) => {
                    // İlk ürünü featured olarak göster (eğer görseli varsa)
                    const isFeatured = index === 0 && product.image

                    return (
                      <MenuItem
                        key={product.id}
                        product={product}
                        featured={isFeatured}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Category separator */}
              {categoryIndex < categories.length - 1 && (
                <div className="flex justify-center mt-16">
                  <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#C9A961]/30 to-transparent" />
                </div>
              )}
            </section>
          )
        })}
      </main>

      {/* Footer */}
      <footer className="relative py-16 px-4 text-center border-t border-[#C9A961]/30 mt-20">
        <div className="flex justify-center mb-6">
          <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ornate footer decoration */}
            <path d="M20 20 Q 50 15, 80 20 Q 110 25, 140 20" stroke="#C9A961" strokeWidth="1.2" fill="none"/>
            <path d="M0 20 L15 20 M145 20 L200 20" stroke="#C9A961" strokeWidth="1"/>
            <circle cx="80" cy="20" r="3" fill="#C9A961"/>
            <circle cx="100" cy="20" r="2" fill="#C9A961" opacity="0.6"/>
            <circle cx="60" cy="20" r="2" fill="#C9A961" opacity="0.6"/>
            <circle cx="80" cy="12" r="1.5" fill="#C9A961" opacity="0.4"/>
            <circle cx="80" cy="28" r="1.5" fill="#C9A961" opacity="0.4"/>
          </svg>
        </div>
        <p className="text-[#C9A961] text-base sm:text-lg font-light tracking-[0.4em] font-['Playfair_Display',serif] italic mb-4">
          BON APPÉTIT
        </p>
        <p className="text-[#8B7355] text-xs tracking-[0.3em] font-light uppercase">
          Fine Dining Experience
        </p>
      </footer>
    </div>
  )
}
