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
  image: string | null
  category_id: string
}

interface Tenant {
  id: string
  business_name: string
}

export default function TVMenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [logo, setLogo] = useState<string>("")
  const [currency, setCurrency] = useState<string>("₺")
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
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
        const { data: tenantData, error: tenantError } = await supabase
          .from("tenants")
          .select("id, business_name")
          .eq("slug", slug)
          .single()

        if (tenantError) {
          console.error("Tenant error:", tenantError)
          return
        }

        if (!tenantData) {
          console.error("Tenant not found")
          return
        }

        setTenant(tenantData)

        // Get header settings (contains logo)
        const { data: headerSettings } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "header")
          .eq("tenant_id", tenantData.id)
          .maybeSingle()

        if (headerSettings?.value?.logo) {
          setLogo(headerSettings.value.logo)
        }

        // Get theme settings (contains currency)
        const { data: themeSettings } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "theme")
          .eq("tenant_id", tenantData.id)
          .maybeSingle()

        if (themeSettings?.value?.currency) {
          setCurrency(themeSettings.value.currency)
        }

        // Get categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("id, name, display_order")
          .eq("tenant_id", tenantData.id)
          .order("display_order")

        if (categoriesError) {
          console.error("Categories error:", categoriesError)
        } else if (categoriesData) {
          setCategories(categoriesData)
        }

        // Get products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("id, name, description, price, image, category_id")
          .eq("tenant_id", tenantData.id)
          .eq("is_available", true)
          .order("display_order")

        if (productsError) {
          console.error("Products error:", productsError)
        } else if (productsData) {
          setProducts(productsData)
        }

        // Generate QR code
        const menuUrl = `${window.location.origin}/${slug}`
        const qrCode = await QRCodeLib.toDataURL(menuUrl, {
          width: 180,
          margin: 2,
          color: {
            dark: "#1e293b",
            light: "#ffffff",
          },
        })
        setQrCodeUrl(qrCode)
      } catch (error) {
        console.error("Data fetch error:", error)
      }
    }

    fetchData()
  }, [slug, supabase])

  // Auto-rotate categories
  useEffect(() => {
    if (categories.length === 0) return

    const interval = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % categories.length)
    }, 10000) // 10 seconds per category

    return () => clearInterval(interval)
  }, [categories.length])

  if (!tenant || categories.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-2xl">Yükleniyor...</div>
      </div>
    )
  }

  const currentCategory = categories[currentCategoryIndex]
  const categoryProducts = products.filter((p) => p.category_id === currentCategory.id)

  // Get category image (first product with image in category)
  const categoryImage = categoryProducts.find((p) => p.image)?.image

  // Debug logging
  console.log("Current category:", currentCategory?.name)
  console.log("Category products count:", categoryProducts.length)
  console.log("Category image URL:", categoryImage)

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden flex flex-col">
      {/* Main Content - Full Height Split Layout */}
      <div className="flex-1 flex pb-24">
        {/* Left Side - Category (30% width, full height, vertical rectangle) */}
        <div className="w-[30%] h-full relative">
          {/* Category Background Image - Full Height */}
          {categoryImage ? (
            <div className="absolute inset-0">
              <Image
                src={categoryImage}
                alt={currentCategory.name}
                fill
                className="object-cover animate-ken-burns"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 flex items-center justify-center">
              <QrCode className="w-32 h-32 text-white/20" />
            </div>
          )}

          {/* Category Name - Centered Vertically */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <h2 className="text-6xl font-bold text-center bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent mb-8 drop-shadow-2xl">
              {currentCategory.name}
            </h2>

            {/* Category Indicators */}
            <div className="flex gap-2">
              {categories.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentCategoryIndex
                      ? "w-12 bg-gradient-to-r from-blue-500 to-cyan-500"
                      : "w-2 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Products (70% width) */}
        <div className="w-[70%] h-full px-8 py-6 overflow-hidden">
          <div className="h-full flex flex-col">
            <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
              Ürünlerimiz
            </h3>

            {/* Products Grid - Scrollable */}
            <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-white/5">
              <div className="grid grid-cols-3 gap-6">
                {categoryProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    {/* Product Image */}
                    {product.image && (
                      <div className="relative h-40 rounded-xl overflow-hidden mb-4 shadow-lg">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                    )}

                    {/* Product Info */}
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">
                        {product.name}
                      </h4>

                      {product.description && (
                        <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      {/* Price */}
                      <div className="pt-3 border-t border-white/10">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                          {product.price} {currency}
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

      {/* QR Code - Bottom Center Fixed */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/40 backdrop-blur-lg border-t border-white/10 py-4">
        <div className="flex items-center justify-center gap-4">
          <div className="text-right">
            <p className="text-lg font-semibold text-white">Sipariş Vermek İçin</p>
            <p className="text-sm text-slate-300">QR Kodu Okutun</p>
          </div>
          {qrCodeUrl && (
            <div className="bg-white p-3 rounded-xl shadow-2xl">
              <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20" />
            </div>
          )}
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
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-ken-burns {
          animation: ken-burns 12s ease-in-out infinite;
        }

        /* Scrollbar styling */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
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
