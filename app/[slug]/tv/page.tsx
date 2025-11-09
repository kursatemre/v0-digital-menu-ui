"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import QRCodeLib from "qrcode"

interface Category {
  id: string
  name: string
  image: string | null
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

        if (tenantError || !tenantData) {
          console.error("Tenant error:", tenantError)
          return
        }

        setTenant(tenantData)

        // Get logo from settings
        const { data: headerSettings } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "header")
          .eq("tenant_id", tenantData.id)
          .maybeSingle()

        if (headerSettings?.value?.logo) {
          setLogo(headerSettings.value.logo)
        }

        // Get currency from theme settings
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
        const { data: categoriesData } = await supabase
          .from("categories")
          .select("id, name, image, display_order")
          .eq("tenant_id", tenantData.id)
          .order("display_order")

        if (categoriesData) {
          setCategories(categoriesData)
        }

        // Get products
        const { data: productsData } = await supabase
          .from("products")
          .select("id, name, description, price, image, category_id")
          .eq("tenant_id", tenantData.id)
          .eq("is_available", true)
          .order("display_order")

        if (productsData) {
          setProducts(productsData)
        }

        // Generate QR code
        const menuUrl = `${window.location.origin}/${slug}`
        const qrCode = await QRCodeLib.toDataURL(menuUrl, {
          width: 200,
          margin: 1,
          color: {
            dark: "#000000",
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

  // Auto-rotate categories every 12 seconds
  useEffect(() => {
    if (categories.length === 0) return

    const interval = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % categories.length)
    }, 12000)

    return () => clearInterval(interval)
  }, [categories.length])

  if (!tenant || categories.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-3xl font-light">Yükleniyor...</div>
      </div>
    )
  }

  const currentCategory = categories[currentCategoryIndex]
  const categoryProducts = products.filter((p) => p.category_id === currentCategory.id)

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden">
      {/* Main Grid Layout */}
      <div className="h-full grid grid-cols-12 gap-0">
        {/* Left Section - Category Showcase (40%) */}
        <div className="col-span-5 relative bg-gradient-to-br from-slate-900 via-slate-800 to-black">
          {/* Restaurant Info */}
          <div className="absolute top-8 left-8 right-8 z-10 flex items-center gap-4">
            {logo && (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                <Image src={logo} alt={tenant.business_name} fill className="object-cover" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{tenant.business_name}</h1>
              <p className="text-sm text-white/60">Dijital Menü</p>
            </div>
          </div>

          {/* Category Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
            {/* Category Name */}
            <div className="mb-8 text-center">
              <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
                <span className="text-sm font-medium text-white/80">KATEGORİ</span>
              </div>
              <h2 className="text-6xl font-bold mb-2 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
                {currentCategory.name}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
            </div>

            {/* Category Image */}
            {currentCategory.image && (
              <div className="relative w-80 h-80 mb-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
                <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
                  <Image
                    src={currentCategory.image}
                    alt={currentCategory.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Category Progress Indicators */}
            <div className="flex gap-3 mt-4">
              {categories.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === currentCategoryIndex
                      ? "w-16 bg-gradient-to-r from-blue-400 to-purple-400"
                      : "w-8 bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* QR Code Section */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-6">
                {qrCodeUrl && (
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-lg font-semibold mb-1">Sipariş Vermek İçin</p>
                  <p className="text-sm text-white/60">QR kodu okutun veya menumgo.digital adresini ziyaret edin</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Products Grid (60%) */}
        <div className="col-span-7 bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8 overflow-y-auto">
          {/* Products Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-2 h-12 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
              <h3 className="text-4xl font-bold">Ürünlerimiz</h3>
            </div>
            <p className="text-white/60 ml-6">{categoryProducts.length} ürün</p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-6 pb-8">
            {categoryProducts.map((product, index) => (
              <div
                key={product.id}
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:border-blue-400/50 transition-all duration-300"
                style={{
                  animation: `fadeInScale 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Product Image */}
                {product.image && (
                  <div className="relative h-56 overflow-hidden bg-slate-800">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  </div>
                )}

                {/* Product Info */}
                <div className="p-5">
                  <h4 className="text-xl font-bold mb-2 line-clamp-1">{product.name}</h4>

                  {product.description && (
                    <p className="text-sm text-white/60 mb-4 line-clamp-2">{product.description}</p>
                  )}

                  {/* Price Badge */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-full px-4 py-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
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
              <p className="text-xl text-white/60">Bu kategoride henüz ürün bulunmuyor</p>
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
          background: rgba(255, 255, 255, 0.05);
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(96, 165, 250, 0.3);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(96, 165, 250, 0.5);
        }
      `}</style>
    </div>
  )
}
