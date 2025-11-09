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
  image: string | null
  category_id: string
}

interface Settings {
  business_name: string
  logo_url: string | null
  currency: string
}

// MenuItem component for individual product cards
const MenuItem = ({ item, currency }: { item: Product; currency: string }) => (
  <div className="flex flex-col items-center justify-start text-white p-2">
    {/* Product Image */}
    <div className="w-full h-24 relative mb-2 rounded-lg overflow-hidden bg-gray-800/50">
      {item.image ? (
        <Image 
          src={item.image} 
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
          .select("id, business_name")
          .eq("slug", slug)
          .single()

        if (!tenantData) return

        // Get logo from settings
        const { data: headerSettings } = await supabase
          .from("settings")
          .select("value")
          .eq("tenant_id", tenantData.id)
          .eq("key", "header")
          .maybeSingle()

        const logoUrl = headerSettings?.value?.logo || null

        // Get currency from settings
        const { data: themeSettings } = await supabase
          .from("settings")
          .select("value")
          .eq("tenant_id", tenantData.id)
          .eq("key", "theme")
          .maybeSingle()

        const currency = themeSettings?.value?.currency || "TL"

        setSettings({
          business_name: tenantData.business_name,
          logo_url: logoUrl,
          currency: currency
        })

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
          .select("id, name, description, price, image, category_id")
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
  const featuredProduct = categoryProducts.find(p => p.image)

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
                alt={settings.business_name}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <p className="text-black font-extrabold text-2xl">{settings.business_name}</p>
          )}
        </div>

        {/* Large Promotional Image */}
        <div className="flex flex-col items-center justify-center relative z-10 my-6">
          {featuredProduct?.image && (
            <div className="relative w-72 h-72 mb-4">
              <Image 
                src={featuredProduct.image}
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
          <p>{settings.business_name}</p>
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
