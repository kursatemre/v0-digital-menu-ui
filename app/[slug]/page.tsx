"use client"

import { useState, useEffect } from "react"
import { MenuHeader } from "@/components/menu-header"
import { CartButton } from "@/components/cart-button"
import { CartDetailView } from "@/components/cart-detail-view"
import { OrderForm } from "@/components/order-form"
import { ChevronDown, ChevronUp, Bell, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { LanguageProvider } from "@/contexts/language-context"
import { LanguageSwitch } from "@/components/language-switch"
import { LanguageAwareText } from "@/components/language-aware-text"

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

type Product = {
  id: string
  name: string
  name_en?: string
  description: string
  description_en?: string
  price: number
  categoryId: string
  image: string
  badge?: string | null
  is_available?: boolean
}

type Category = {
  id: string
  name: string
  name_en?: string
  image: string
}

type Tenant = {
  id: string
  slug: string
  business_name: string
  subscription_status: string
  trial_end_date: string
  is_active: boolean
}

export default function MenuPage() {
  useEffect(() => {
    // Save language preference to localStorage
    const savedLanguage = localStorage.getItem("preferred_language")
    if (savedLanguage === "tr" || savedLanguage === "en") {
      setLanguage(savedLanguage as "tr" | "en")
    }
  }, [])
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [language, setLanguage] = useState<"tr" | "en">("tr")

  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [trialExpired, setTrialExpired] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [orderFormOpen, setOrderFormOpen] = useState(false)
  const [waiterCallOpen, setWaiterCallOpen] = useState(false)
  const [waiterTableNumber, setWaiterTableNumber] = useState("")
  const [waiterName, setWaiterName] = useState("")
  const [waiterCallLoading, setWaiterCallLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setTheme] = useState({
    primaryColor: "#8B5A3C",
    secondaryColor: "#C9A961",
    backgroundColor: "#FFFFFF",
    textColor: "#1A1A1A",
  })

  const supabase = createClient()


  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("restaurant_cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
      } catch (e) {
        console.error("Failed to load cart from localStorage:", e)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("restaurant_cart", JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Load tenant by slug
        const { data: tenantData, error: tenantError } = await supabase
          .from("tenants")
          .select("id, slug, business_name, subscription_status, trial_end_date, is_active")
          .eq("slug", slug)
          .single()

        if (tenantError || !tenantData) {
          console.error("Tenant not found:", slug)
          router.push("/")
          return
        }

        setTenant(tenantData)

        // 2. Check trial status
        const isTrialActive =
          (tenantData.subscription_status === "trial" && new Date(tenantData.trial_end_date) > new Date()) ||
          tenantData.subscription_status === "active"

        if (!isTrialActive) {
          setTrialExpired(true)
          setIsLoading(false)
          return
        }

        // 3. Load settings (with tenant_id filter)
        const { data: themeData, error: themeError } = await supabase
          .from("settings")
          .select("*")
          .eq("key", "theme")
          .eq("tenant_id", tenantData.id)
          .maybeSingle()

        if (themeData?.value && !themeError) {
          setTheme(themeData.value)
          document.documentElement.style.setProperty("--primary", themeData.value.primaryColor)
          document.documentElement.style.setProperty("--secondary", themeData.value.secondaryColor)
        }

        // 4. Load categories (with tenant_id filter)
        const { data: categoriesData, error: catError } = await supabase
          .from("categories")
          .select("id, name, name_en, image")
          .eq("tenant_id", tenantData.id)
          .order("display_order", { ascending: true })

        if (catError) throw catError
        if (categoriesData) {
          const formattedCategories = categoriesData.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            name_en: cat.name_en,
            image: cat.image || "",
          }))
          setCategories(formattedCategories)
          if (formattedCategories.length > 0) {
            setExpandedCategories(new Set([formattedCategories[0].id]))
          }
        }

        // 5. Load products (with tenant_id filter)
        const { data: productsData, error: prodError } = await supabase
          .from("products")
          .select("id, name, name_en, description, description_en, price, category_id, image, badge, is_available")
          .eq("tenant_id", tenantData.id)
          .order("display_order", { ascending: true })

        if (prodError) throw prodError
        if (productsData) {
          const formattedProducts = productsData.map((prod: any) => ({
            id: prod.id,
            name: prod.name,
            name_en: prod.name_en,
            description: prod.description || "",
            description_en: prod.description_en,
            price: prod.price,
            categoryId: prod.category_id,
            image: prod.image || "",
            badge: prod.badge || null,
            is_available: prod.is_available,
          }))
          setProducts(formattedProducts)
        }
      } catch (error) {
        console.error("Error loading data from Supabase:", error)
        // Fallback to localStorage
        const storedCategories = localStorage.getItem("restaurant_categories")
        if (storedCategories) {
          try {
            const cats = JSON.parse(storedCategories)
            setCategories(cats)
            if (cats.length > 0) {
              setExpandedCategories(new Set([cats[0].id]))
            }
          } catch (e) {
            console.error("Failed to load categories:", e)
          }
        }

        const storedProducts = localStorage.getItem("restaurant_products")
        if (storedProducts) {
          try {
            setProducts(JSON.parse(storedProducts))
          } catch (e) {
            console.error("Failed to load products:", e)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [supabase])

  const addToCart = (product: { id: string; name: string; price: number }, quantity: number) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id)
      if (existing) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
      }
      return [...prevCart, { ...product, quantity }]
    })

    // Show success toast
    setToastMessage(`${product.name} sepete eklendi!`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const handleOrderSuccess = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleWaiterCall = async () => {
    if (!waiterTableNumber.trim()) {
      setToastMessage("Lütfen masa numaranızı girin")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }

    if (!tenant) return

    setWaiterCallLoading(true)
    try {
      const { error } = await supabase.from("waiter_calls").insert({
        tenant_id: tenant.id,
        table_number: waiterTableNumber,
        customer_name: waiterName || null,
        status: "pending",
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error calling waiter:", error)
        setToastMessage("Garson çağırma başarısız oldu. Lütfen tekrar deneyin.")
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      } else {
        setToastMessage(`Garson çağrıldı! Masa: ${waiterTableNumber}`)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
        setWaiterCallOpen(false)
        setWaiterTableNumber("")
        setWaiterName("")
      }
    } catch (err) {
      console.error("Error calling waiter:", err)
      setToastMessage("Bir hata oluştu. Lütfen tekrar deneyin.")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } finally {
      setWaiterCallLoading(false)
    }
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handlePlaceOrder = (formData: { tableNumber: string; name: string; notes: string }) => {
    const newOrder = {
      id: Date.now().toString(),
      tableNumber: formData.tableNumber,
      customerName: formData.name,
      notes: formData.notes,
      items: cart,
      total: totalPrice,
      status: "pending" as const,
      timestamp: new Date().toISOString(),
    }

    const existingOrders = JSON.parse(localStorage.getItem("restaurant_orders") || "[]")
    existingOrders.push(newOrder)
    localStorage.setItem("restaurant_orders", JSON.stringify(existingOrders))

    alert(`Sipariş başarıyla gönderildi! Masa: ${formData.tableNumber}`)
    setCart([])
    setOrderFormOpen(false)
    setCartOpen(false)
  }

  const getCategoryProducts = (categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId)
  }

  // Trial Expired Page
  if (trialExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center border-2 border-red-200">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-foreground">Deneme Süresi Bitti</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {tenant?.business_name} restoranının deneme süresi sona ermiştir. Menüyü görüntülemek için
            abonelik gereklidir.
          </p>
          <div className="space-y-3">
            <Link href={`/${slug}/admin`}>
              <Button size="lg" className="w-full">Ödeme Yap ve Devam Et</Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="w-full">Ana Sayfaya Dön</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <LanguageAwareText tr="Yükleniyor..." en="Loading..." />
            </div>
          </div>
        ) : tenant ? (
          <>
            <div className="relative">
              <MenuHeader title={tenant.business_name} theme={theme} />
              <div className="absolute top-4 right-4">
                <LanguageSwitch />
              </div>
            </div>

      {/* Waiter Call Button */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-primary/10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => setWaiterCallOpen(true)}
            className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary/80 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-98"
          >
            <Bell className="w-5 h-5" />
            <span>Garson Çağır</span>
          </button>
        </div>
      </div>

      {showToast && (
        <div className="fixed top-4 right-4 z-40 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {categories.length > 0 ? (
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryProducts = getCategoryProducts(category.id)
              const isExpanded = expandedCategories.has(category.id)
              const displayName = language === "tr" ? category.name : (category.name_en || category.name)

              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl border border-primary/15 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-primary/5 transition-colors accent-left-border"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Category Image */}
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={displayName}
                          className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          📋
                        </div>
                      )}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <h2 className="text-lg sm:text-xl font-bold text-foreground">{displayName}</h2>
                        <span className="text-xs sm:text-sm text-muted-foreground bg-primary/10 px-2 sm:px-3 py-1 rounded-full font-medium">
                          {categoryProducts.length}
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                    )}
                  </button>

                  {/* Category Products */}
                  {isExpanded && (
                    <div className="border-t border-primary/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 p-4 sm:p-6">
                      {categoryProducts.length > 0 ? (
                        categoryProducts.map((product) => {
                          const isAvailable = product.is_available !== false
                          return (
                          <div
                            key={product.id}
                            className={`bg-white border border-primary/10 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row ${!isAvailable ? 'opacity-60' : ''}`}
                          >
                            {/* Product Image */}
                            <div className="relative flex-shrink-0 sm:w-44">
                              {product.image ? (
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  className={`w-full h-40 sm:h-full object-cover ${!isAvailable ? 'grayscale' : ''}`}
                                />
                              ) : (
                                <div className={`w-full h-40 sm:h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-4xl ${!isAvailable ? 'grayscale' : ''}`}>
                                  🍽️
                                </div>
                              )}

                              {/* Sold Out Badge */}
                              {!isAvailable && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-md">
                                  TÜKENDİ
                                </div>
                              )}

                              {/* Product Badge */}
                              {product.badge && isAvailable && (
                                <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-md text-xs font-semibold shadow-md">
                                  {product.badge === "gunun_urunu" && "Günün Ürünü"}
                                  {product.badge === "sefin_onerisi" && "Şefin Önerisi"}
                                  {product.badge === "yeni" && "Yeni"}
                                  {product.badge === "populer" && "Popüler"}
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 p-3 sm:p-4 flex flex-col">
                              {/* Product Name */}
                              <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5 line-clamp-2">
                                {language === "tr" ? product.name : (product.name_en || product.name)}
                              </h3>

                              {/* Product Description */}
                              <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
                                {language === "tr" ? product.description : (product.description_en || product.description)}
                              </p>

                              {/* Price and Add to Cart Button */}
                              <div className="flex items-center gap-2 sm:gap-3 mt-auto">
                                <div className="flex-1">
                                  <p className="text-xs text-muted-foreground mb-0.5">Fiyat</p>
                                  <p className="text-xl sm:text-2xl font-bold text-primary">
                                    ₺{product.price.toFixed(2)}
                                  </p>
                                </div>
                                <button
                                  onClick={() => isAvailable && addToCart(product, 1)}
                                  disabled={!isAvailable}
                                  className={`px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg transition-all text-sm font-semibold shadow-md whitespace-nowrap ${
                                    isAvailable
                                      ? 'bg-primary text-white hover:bg-primary/90 active:scale-95 hover:shadow-lg'
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  }`}
                                >
                                  {isAvailable ? (
                                    <LanguageAwareText 
                                      tr="Sepete Ekle" 
                                      en="Add to Cart" 
                                    />
                                  ) : (
                                    <LanguageAwareText 
                                      tr="Tükendi" 
                                      en="Sold Out" 
                                    />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )})
                      ) : (
                        <div className="col-span-full px-6 py-8 text-center text-muted-foreground">
                          <LanguageAwareText 
                            tr="Bu kategoride ürün bulunmamaktadır." 
                            en="No products found in this category." 
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <LanguageAwareText 
              tr="Henüz kategori eklenmemiştir." 
              en="No categories have been added yet." 
            />
            <p className="text-sm text-muted-foreground">
              <LanguageAwareText 
                tr="/admin sayfasından kategoriler ve ürünler ekleyebilirsiniz." 
                en="You can add categories and products from the /admin page." 
              />
            </p>
          </div>
        )}
      </main>

      <CartButton itemCount={totalItems} total={totalPrice} onClick={() => setCartOpen(true)} />

      {cartOpen && (
        <CartDetailView
          items={cart}
          onClose={() => setCartOpen(false)}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onPlaceOrder={() => {
            setCartOpen(false)
            setOrderFormOpen(true)
          }}
        />
      )}

      {orderFormOpen && (
        <OrderForm
          onClose={() => setOrderFormOpen(false)}
          total={totalPrice}
          items={cart}
          onSuccess={handleOrderSuccess}
          onClearCart={clearCart}
          tenantId={tenant?.id}
        />
      )}

      {/* Waiter Call Modal */}
      {waiterCallOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-primary/20">
            {/* Header */}
            <div className="border-b border-primary/20 bg-gradient-to-r from-secondary/10 to-primary/10 p-4 sm:p-5 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary">Garson Çağır</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Masa numaranızı girin</p>
              </div>
              <button
                onClick={() => setWaiterCallOpen(false)}
                className="p-2 hover:bg-white/50 rounded-full transition-all active:scale-95"
                aria-label="Kapat"
              >
                <X size={24} className="text-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  🪑 Masa Numarası <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="A5, 12, Bahçe-3..."
                  value={waiterTableNumber}
                  onChange={(e) => setWaiterTableNumber(e.target.value)}
                  className="w-full text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  👤 İsim (İsteğe bağlı)
                </label>
                <Input
                  type="text"
                  placeholder="Adınız"
                  value={waiterName}
                  onChange={(e) => setWaiterName(e.target.value)}
                  className="w-full"
                />
              </div>

              <Button
                onClick={handleWaiterCall}
                disabled={waiterCallLoading}
                className="w-full bg-gradient-to-r from-secondary to-secondary/90 text-white hover:from-secondary/90 hover:to-secondary/80 py-3 sm:py-4 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all active:scale-98 rounded-xl"
              >
                {waiterCallLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Bell className="w-5 h-5 mr-2" />
                    Garson Çağır
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )


}
