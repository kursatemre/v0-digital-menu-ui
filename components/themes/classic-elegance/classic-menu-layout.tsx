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
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#C9A961] tracking-wider mb-4">
          {headerSettings?.title || "MENU"}
        </h1>

        {headerSettings?.subtitle && (
          <p className="text-gray-400 font-light text-lg tracking-wide">
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
          <svg width="80" height="20" viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10 L25 10 M55 10 L80 10" stroke="#C9A961" strokeWidth="0.5"/>
            <circle cx="40" cy="10" r="4" stroke="#C9A961" strokeWidth="0.5" fill="none"/>
          </svg>
        </div>
        <p className="text-gray-500 text-sm font-light tracking-wider">
          BON APPÉTIT
        </p>
      </footer>
    </div>
  )
}
