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
      <header className="relative py-16 px-4 text-center border-b border-[#C9A961]/20">
        {headerSettings?.logo && (
          <div className="flex justify-center mb-6">
            <img
              src={headerSettings.logo}
              alt="Logo"
              className="h-20 w-auto object-contain"
            />
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-['Playfair_Display',serif] text-[#C9A961] tracking-[0.2em] mb-4 font-semibold">
          {headerSettings?.title || "MENU"}
        </h1>

        {headerSettings?.subtitle && (
          <p className="text-gray-400 font-light text-lg tracking-widest font-sans">
            {headerSettings.subtitle}
          </p>
        )}

        {/* Decorative line */}
        <div className="flex justify-center mt-8">
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#C9A961] to-transparent" />
        </div>
      </header>

      {/* Menu Content */}
      <main className="max-w-4xl mx-auto py-12 relative z-10">
        {categories.map((category, categoryIndex) => {
          const categoryProducts = products.filter(p => p.categoryId === category.id)

          if (categoryProducts.length === 0) return null

          const categoryName = language === "en" && category.name_en
            ? category.name_en
            : category.name

          return (
            <section key={category.id} className="mb-20">
              <CategoryHeader title={categoryName} />

              <div className="space-y-4">
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
      <footer className="relative py-12 px-4 text-center border-t border-[#C9A961]/20">
        <div className="flex justify-center mb-4">
          <svg width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ornate footer decoration */}
            <path d="M10 15 Q 30 10, 50 15 Q 70 20, 90 15" stroke="#C9A961" strokeWidth="0.5" fill="none"/>
            <path d="M0 15 L8 15 M92 15 L120 15" stroke="#C9A961" strokeWidth="0.5"/>
            <circle cx="50" cy="15" r="2" fill="#C9A961" opacity="0.6"/>
            <circle cx="60" cy="15" r="1.5" fill="#C9A961" opacity="0.4"/>
            <circle cx="40" cy="15" r="1.5" fill="#C9A961" opacity="0.4"/>
          </svg>
        </div>
        <p className="text-gray-500 text-sm font-light tracking-[0.3em] font-['Playfair_Display',serif] italic">
          BON APPÉTIT
        </p>
      </footer>
    </div>
  )
}
