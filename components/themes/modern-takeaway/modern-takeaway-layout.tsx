"use client"

import { CategoryHeader } from "./category-header"
import { MenuItem } from "./menu-item"
import { useLanguage } from "@/contexts/language-context"
import { Sparkles } from "lucide-react"

interface Product {
  id: string
  name: string
  name_en?: string
  description: string
  description_en?: string
  price: number
  image?: string
  badge?: string | null
  variants?: { size: string; price: number }[]
}

interface Category {
  id: string
  name: string
  name_en?: string
  products: Product[]
}

interface ModernTakeawayLayoutProps {
  categories: Category[]
  tenantId: string
  onAddToCart?: (item: any) => void
  dealOfTheDay?: Product[]
}

export function ModernTakeawayLayout({ categories, tenantId, onAddToCart, dealOfTheDay }: ModernTakeawayLayoutProps) {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {/* Deal of the Day Section */}
        {dealOfTheDay && dealOfTheDay.length > 0 && (
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-white" fill="white" />
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                {language === "en" ? "TODAY'S DEALS" : "GÜNÜN FIRSATLARI"}
              </h2>
            </div>
            <div className="space-y-3">
              {dealOfTheDay.map((product) => (
                <div key={product.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-lg">{product.name}</h3>
                      <p className="text-white/90 text-sm">{product.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white/70 line-through">
                        {Math.round(product.price * 1.2)}₺
                      </div>
                      <div className="text-2xl font-black text-white">
                        {product.price}₺
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {categories.map((category) => (
          <div key={category.id} className="space-y-4">
            <CategoryHeader name={category.name} nameEn={category.name_en} />
            <div className="space-y-3">
              {category.products.map((product) => (
                <MenuItem
                  key={product.id}
                  product={product}
                  tenantId={tenantId}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Custom Styles for Animation */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
