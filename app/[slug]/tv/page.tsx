"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

interface Category {
  id: string
  name: string
  display_order: number
}

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category_id: string
}

interface Settings {
  restaurant_name: string
  logo_url: string | null
  currency: string
}

// MenuItem component for individual product cards
const MenuItem = ({ item, currency }: { item: Product; currency: string }) => (
  <div className="flex flex-col items-center justify-start text-white p-2">
    {/* Product Image */}
    <div className="w-full h-24 relative mb-2 rounded-lg overflow-hidden bg-gray-800/50">
      {item.image_url ? (
        <Image 
          src={item.image_url} 
          alt={item.name} 
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-600">
          <span className="text-4xl">🍔</span>
        </div>
      )}
    </div>
    
    {/* Product Name */}
    <h3 className="text-sm md:text-base font-semibold mb-1 uppercase text-center line-clamp-2">
      {item.name}
    </h3>
    
    {/* Price */}
    <div className="text-xs md:text-sm text-center">
      <p>
        <span className="text-yellow-400 font-bold">{currency}</span>
        <span className="text-yellow-400 font-bold text-lg">{item.price.toFixed(2)}</span>
      </p>
    </div>
  </div>
)

export default function TVMenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [slug, setSlug] = useState<string>("")

  const supabase = createClient()

  useEffect(() => {
    const initializeSlug = async () => {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    initializeSlug()
  }, [params])

  useEffect(() => {
    if (!slug) return

    const fetchData = async () => {
      try {
        // Get tenant
        const { data: tenantData } = await supabase
          .from("tenants")
          .select("id")
          .eq("slug", slug)
          .single()

        if (!tenantData) return

        // Get settings
        const { data: settingsData } = await supabase
          .from("settings")
          .select("restaurant_name, logo_url, currency")
          .eq("tenant_id", tenantData.id)
          .maybeSingle()

        if (settingsData) setSettings(settingsData)

        // Get categories
        const { data: categoriesData } = await supabase
          .from("categories")
          .select("id, name, display_order")
          .eq("tenant_id", tenantData.id)
          .order("display_order")

        if (categoriesData) setCategories(categoriesData)

        // Get products
        const { data: productsData } = await supabase
          .from("products")
          .select("id, name, description, price, image_url, category_id")
          .eq("tenant_id", tenantData.id)
          .eq("is_available", true)
          .order("display_order")

        if (productsData) setProducts(productsData)
      } catch (error) {
        console.error("Data fetch error:", error)
      }
    }

    fetchData()
  }, [slug, supabase])

  // Auto-rotate categories every 10 seconds
  useEffect(() => {
    if (categories.length === 0) return

    const interval = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % categories.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [categories.length])

  if (!settings || categories.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-3xl">Yükleniyor...</div>
      </div>
    )
  }

  const currentCategory = categories[currentCategoryIndex]
  const categoryProducts = products.filter((p) => p.category_id === currentCategory.id).slice(0, 8)
  const featuredProduct = categoryProducts.find(p => p.image_url)

  return (
    // Main Container - Full screen
    <div className="w-screen h-screen bg-black shadow-2xl overflow-hidden flex font-sans">
      
      {/* LEFT PROMOTIONAL AREA (Yellow Section - 30% width) */}
      <div className="w-[30%] bg-yellow-400 p-8 flex flex-col justify-between relative overflow-hidden">
        {/* Background Patterns (Low opacity food emojis) */}
        <div className="absolute inset-0 opacity-10 transform scale-150">
          <div className="text-[180px] text-gray-800 tracking-widest leading-none">
            🍔🍟🥤
          </div>
          <div className="text-[180px] text-gray-800 tracking-widest leading-none translate-x-1/2 translate-y-1/2">
            🍔🍟🥤
          </div>
        </div>

        {/* Logo Placeholder */}
        <div className="bg-gray-200 p-6 rounded-xl text-center relative z-10 shadow-lg">
          {settings.logo_url ? (
            <div className="relative h-16 w-full">
              <Image 
                src={settings.logo_url} 
                alt={settings.restaurant_name}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <p className="text-black font-extrabold text-2xl">{settings.restaurant_name}</p>
          )}
        </div>

        {/* Large Promotional Image */}
        <div className="flex flex-col items-center justify-center relative z-10 my-6">
          {featuredProduct?.image_url && (
            <div className="relative w-72 h-72 mb-4">
              <Image 
                src={featuredProduct.image_url}
                alt={featuredProduct.name}
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
          )}
          <h2 className="text-4xl font-extrabold text-white mt-4 tracking-wider italic drop-shadow-lg">
            {currentCategory.name}
          </h2>
          {featuredProduct && (
            <p className="text-8xl font-black text-black mt-3 drop-shadow-lg">
              {featuredProduct.price}
              <span className="text-5xl align-top">{settings.currency}</span>
            </p>
          )}
        </div>

        {/* Bottom Info */}
        <div className="text-center text-black text-sm relative z-10 font-semibold">
          <p>Sipariş için QR kodu okutun</p>
        </div>
      </div>

      {/* RIGHT MENU CONTENT (Dark Grey/Black Section - 70% width) */}
      <div className="w-[70%] bg-gray-900 bg-opacity-95 p-8 flex flex-col justify-between">
        
        {/* Menu Items Grid (4 column grid) */}
        <div className="grid grid-cols-4 gap-x-5 gap-y-8 flex-1">
          {categoryProducts.map((item) => (
            <MenuItem key={item.id} item={item} currency={settings.currency} />
          ))}
        </div>

        {/* Contact Footer */}
        <div className="text-right text-white text-xs mt-6 border-t border-gray-700 pt-4">
          <p>{settings.restaurant_name}</p>
          <p className="mt-1 text-gray-400">Online Sipariş: menumgo.digital/{slug}</p>
          
          {/* Category Indicators */}
          <div className="flex justify-end gap-2 mt-3">
            {categories.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentCategoryIndex
                    ? "w-8 bg-yellow-400"
                    : "w-2 bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
                }}
              >
                {/* Product Image */}
                {product.image && (
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                  </div>
                )}

                {/* Product Info */}
                <div className="p-5">
                  <h4 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{product.name}</h4>

                  {product.description && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{product.description}</p>
                  )}

                  {/* Price Badge */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {product.price} {currency}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {categoryProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-xl text-slate-500">Bu kategoride henüz ürün bulunmuyor</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Custom Scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(226, 232, 240, 0.3);
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(96, 165, 250, 0.5);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(96, 165, 250, 0.8);
        }
      `}</style>
    </div>
  )
}
