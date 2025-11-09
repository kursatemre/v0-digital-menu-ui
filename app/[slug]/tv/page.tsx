"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { QrCode } from "lucide-react"
import Image from "next/image"
import QRCodeLib from "qrcode"

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

export default function TVMenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [tenantId, setTenantId] = useState<string | null>(null)
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
      // Get tenant
      const { data: tenant } = await supabase
        .from("tenants")
        .select("id")
        .eq("slug", slug)
        .single()

      if (!tenant) return
      setTenantId(tenant.id)

      // Get settings
      const { data: settingsData } = await supabase
        .from("settings")
        .select("restaurant_name, logo_url, currency")
        .eq("tenant_id", tenant.id)
        .maybeSingle()

      if (settingsData) setSettings(settingsData)

      // Get categories
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("id, name, display_order")
        .eq("tenant_id", tenant.id)
        .order("display_order")

      if (categoriesData) setCategories(categoriesData)

      // Get products
      const { data: productsData } = await supabase
        .from("products")
        .select("id, name, description, price, image_url, category_id")
        .eq("tenant_id", tenant.id)
        .eq("is_available", true)
        .order("display_order")

      if (productsData) setProducts(productsData)

      // Generate QR code
      const menuUrl = `${window.location.origin}/${slug}`
      const qrCode = await QRCodeLib.toDataURL(menuUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: "#1e293b",
          light: "#ffffff",
        },
      })
      setQrCodeUrl(qrCode)
    }

    fetchData()
  }, [slug, supabase])

  // Auto-rotate categories
  useEffect(() => {
    if (categories.length === 0) return

    const interval = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % categories.length)
    }, 8000) // 8 seconds per category

    return () => clearInterval(interval)
  }, [categories.length])

  if (!settings || categories.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-2xl">Yükleniyor...</div>
      </div>
    )
  }

  const currentCategory = categories[currentCategoryIndex]
  const categoryProducts = products.filter((p) => p.category_id === currentCategory.id)

  // Get category image (first product with image in category)
  const categoryImage = categoryProducts.find((p) => p.image_url)?.image_url

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {settings.logo_url && (
              <Image
                src={settings.logo_url}
                alt={settings.restaurant_name}
                width={60}
                height={60}
                className="rounded-lg"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {settings.restaurant_name}
              </h1>
              <p className="text-slate-400 text-sm">Dijital Menü</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <div className="text-right">
              <p className="text-sm text-slate-300 font-medium">Sipariş Vermek İçin</p>
              <p className="text-xs text-slate-400">QR kodu okutun</p>
            </div>
            {qrCodeUrl && (
              <div className="bg-white p-2 rounded-xl">
                <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-32 pb-12 px-8 h-screen flex items-center">
        <div className="container mx-auto grid grid-cols-5 gap-8 h-full">
          {/* Left Side - Category */}
          <div className="col-span-2 flex flex-col justify-center">
            <div className="relative group">
              {/* Category Image */}
              {categoryImage ? (
                <div className="relative h-[500px] rounded-3xl overflow-hidden mb-8 shadow-2xl shadow-blue-500/20 border-4 border-white/10">
                  <Image
                    src={categoryImage}
                    alt={currentCategory.name}
                    fill
                    className="object-cover animate-ken-burns"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
              ) : (
                <div className="relative h-[500px] rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-4 border-white/10 flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-white/20" />
                </div>
              )}

              {/* Category Name */}
              <div className="text-center space-y-4">
                <h2 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient-x">
                  {currentCategory.name}
                </h2>
                
                {/* Category Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {categories.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === currentCategoryIndex
                          ? "w-12 bg-gradient-to-r from-blue-500 to-cyan-500"
                          : "w-2 bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Products */}
          <div className="col-span-3 overflow-hidden">
            <div className="h-full flex flex-col">
              <h3 className="text-2xl font-semibold text-slate-300 mb-6 flex items-center gap-3">
                <span className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                Ürünlerimiz
              </h3>

              <div className="grid grid-cols-2 gap-6 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-white/5">
                {categoryProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 group hover:scale-[1.02]"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    {/* Product Image */}
                    {product.image_url && (
                      <div className="relative h-48 rounded-xl overflow-hidden mb-4 shadow-lg">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {/* Product Info */}
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h4>
                      
                      {product.description && (
                        <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      {/* Price */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                          {product.price} {settings.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ken-burns {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-ken-burns {
          animation: ken-burns 8s ease-in-out infinite;
        }

        /* Scrollbar styling */
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  )
}
