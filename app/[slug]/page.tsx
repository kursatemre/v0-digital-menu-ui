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
import { LanguageProvider, useLanguage } from "@/contexts/language-context"
import { LanguageSwitch } from "@/components/language-switch"
import { LanguageAwareText } from "@/components/language-aware-text"
import { ClassicMenuLayout } from "@/components/themes/classic-elegance/classic-menu-layout"
import { ModernTakeawayLayout } from "@/components/themes/modern-takeaway/modern-takeaway-layout"
import { FeedbackButton } from "@/components/feedback-button"
import { FeedbackModal } from "@/components/feedback-modal"

type CartItem = {
  id: string
  name: string
  name_en?: string
  price: number
  quantity: number
  productId?: string
  variant?: {
    id: string
    name: string
    name_en?: string
  }
  customizations?: Array<{
    groupName: string
    groupName_en?: string
    optionName: string
    optionName_en?: string
  }>
  image?: string
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

function MenuPageContent() {
  const { language } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [trialExpired, setTrialExpired] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [orderFormOpen, setOrderFormOpen] = useState(false)
  const [waiterCallOpen, setWaiterCallOpen] = useState(false)
  const [waiterTableNumber, setWaiterTableNumber] = useState("")
  const [waiterName, setWaiterName] = useState("")
  const [waiterCallLoading, setWaiterCallLoading] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setTheme] = useState({
    type: "modern" as "modern" | "classic_elegance" | "modern_takeaway",
    primaryColor: "#8B5A3C",
    secondaryColor: "#C9A961",
    backgroundColor: "#FFFFFF",
    textColor: "#1A1A1A",
  })
  const [headerSettings, setHeaderSettings] = useState({
    title: "",
    subtitle: "",
    logo: "",
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

        // Load header settings
        const { data: headerData } = await supabase
          .from("settings")
          .select("*")
          .eq("key", "header")
          .eq("tenant_id", tenantData.id)
          .maybeSingle()

        if (headerData?.value) {
          setHeaderSettings(headerData.value)
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

  // If Classic Elegance theme is selected, render that layout
  if (!isLoading && tenant && theme.type === "classic_elegance") {
    return (
      <ClassicMenuLayout
        categories={categories}
        products={products}
        headerSettings={headerSettings}
        tenantId={tenant.id}
      />
    )
  }

  // If Modern Takeaway theme is selected, render that layout
  if (!isLoading && tenant && theme.type === "modern_takeaway") {
    // Prepare categories with products
    const categoriesWithProducts = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      name_en: cat.name_en,
      products: products.filter(p => p.categoryId === cat.id && p.is_available !== false)
    }))

    return (
      <ModernTakeawayLayout
        categories={categoriesWithProducts}
        tenantId={tenant.id}
        restaurantName={tenant.business_name}
        onAddToCart={(item) => {
          // Add to cart with customizations
          const existingIndex = cart.findIndex(c => c.id === item.productId && 
            JSON.stringify(c.variant) === JSON.stringify(item.variant) &&
            JSON.stringify(c.customizations) === JSON.stringify(item.customizations))
          if (existingIndex >= 0) {
            const newCart = [...cart]
            newCart[existingIndex].quantity += 1
            setCart(newCart)
          } else {
            setCart([...cart, { ...item, quantity: 1 }])
          }
          setToastMessage(`${item.name} ${language === "en" ? "added to cart!" : "sepete eklendi!"}`)
          setShowToast(true)
          setTimeout(() => setShowToast(false), 2000)
        }}
      />
    )
  }

  // Default Modern theme
  return (
      <div className="min-h-screen bg-background">
        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <LanguageAwareText tr="Yükleniyor..." en="Loading..." />
            </div>
          </div>
        ) : tenant ? (
          <>
            <MenuHeader title={tenant.business_name} theme={theme} />

            {/* Waiter Call Button & Language Switcher */}
            <div className="sticky top-0 z-30 bg-white/98 backdrop-blur-sm border-b-2 border-secondary/15 elegant-shadow">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setWaiterCallOpen(true)}
                    className="flex-1 bg-gradient-to-r from-secondary to-secondary/95 hover:from-secondary/95 hover:to-secondary text-secondary-foreground font-semibold py-3 px-6 rounded-lg elegant-shadow hover:golden-glow transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 border border-secondary/30"
                  >
                    <Bell className="w-5 h-5" />
                    <span>
                      <LanguageAwareText tr="Garson Çağır" en="Call Waiter" />
                    </span>
                  </button>
                  <LanguageSwitch />
                </div>
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
                  className="elegant-card rounded-xl overflow-hidden elegant-shadow hover:golden-glow transition-all duration-300 animate-fade-in-up"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-4 sm:px-6 py-5 flex items-center justify-between hover:bg-secondary/5 transition-all duration-200 gold-accent-border"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Category Image */}
                      {category.image ? (
                        <div className="elegant-border rounded-lg p-1 bg-white">
                          <img
                            src={category.image}
                            alt={displayName}
                            className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md flex-shrink-0"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 elegant-border">
                          📋
                        </div>
                      )}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <h2 className="text-lg sm:text-xl font-serif font-bold text-foreground tracking-wide">{displayName}</h2>
                        <span className="text-xs sm:text-sm text-white bg-primary px-3 py-1 rounded-full font-bold shadow-md">
                          {categoryProducts.length}
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-secondary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-secondary flex-shrink-0" />
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
                            className={`elegant-card rounded-xl overflow-hidden elegant-shadow hover:golden-glow transition-all duration-300 flex flex-col sm:flex-row ${!isAvailable ? 'opacity-60' : ''}`}
                          >
                            {/* Product Image */}
                            <div className="relative flex-shrink-0 sm:w-48">
                              {product.image ? (
                                <div className="relative w-full h-44 sm:h-full">
                                  <img
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.name}
                                    className={`w-full h-full object-cover ${!isAvailable ? 'grayscale' : ''}`}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                                </div>
                              ) : (
                                <div className={`w-full h-44 sm:h-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center text-4xl ${!isAvailable ? 'grayscale' : ''}`}>
                                  🍽️
                                </div>
                              )}

                              {/* Sold Out Badge */}
                              {!isAvailable && (
                                <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-lg">
                                  <LanguageAwareText tr="TÜKENDİ" en="SOLD OUT" />
                                </div>
                              )}

                              {/* Product Badge */}
                              {product.badge && isAvailable && (
                                <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md text-xs font-bold shadow-lg border border-secondary/40">
                                  {product.badge === "gunun_urunu" && (
                                    <LanguageAwareText tr="Günün Ürünü" en="Today's Special" />
                                  )}
                                  {product.badge === "sefin_onerisi" && (
                                    <LanguageAwareText tr="Şefin Önerisi" en="Chef's Choice" />
                                  )}
                                  {product.badge === "yeni" && (
                                    <LanguageAwareText tr="Yeni" en="New" />
                                  )}
                                  {product.badge === "populer" && (
                                    <LanguageAwareText tr="Popüler" en="Popular" />
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 p-4 sm:p-5 flex flex-col bg-gradient-to-br from-white to-secondary/5">
                              {/* Product Name */}
                              <h3 className="text-base sm:text-lg font-serif font-bold text-foreground mb-2 line-clamp-2 tracking-wide">
                                {language === "tr" ? product.name : (product.name_en || product.name)}
                              </h3>

                              {/* Product Description */}
                              <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2 flex-1 leading-relaxed">
                                {language === "tr" ? product.description : (product.description_en || product.description)}
                              </p>

                              {/* Price and Add to Cart Button */}
                              <div className="flex items-center gap-3 sm:gap-4 mt-auto pt-3 border-t border-secondary/20">
                                <div className="flex-1">
                                  <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
                                    <LanguageAwareText tr="Fiyat" en="Price" />
                                  </p>
                                  <p className="text-xl sm:text-2xl font-bold text-primary font-serif">
                                    ₺{product.price.toFixed(2)}
                                  </p>
                                </div>
                                <button
                                  onClick={() => isAvailable && addToCart(product, 1)}
                                  disabled={!isAvailable}
                                  className={`px-5 py-3 rounded-lg transition-all duration-300 text-sm font-semibold whitespace-nowrap border ${
                                    isAvailable
                                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 elegant-shadow hover:golden-glow border-primary/30'
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
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

      {/* Feedback Button */}
      <FeedbackButton onClick={() => setFeedbackOpen(true)} />

      {/* Feedback Modal */}
      {feedbackOpen && tenant && (
        <FeedbackModal
          isOpen={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
          tenantId={tenant.id}
          onSuccess={(message) => {
            setToastMessage(message)
            setShowToast(true)
            setTimeout(() => setShowToast(false), 3000)
          }}
        />
      )}

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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="elegant-card rounded-2xl golden-glow max-w-md w-full">
            {/* Header */}
            <div className="border-b-2 border-secondary/20 bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent p-5 sm:p-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-1">
                  <LanguageAwareText tr="Garson Çağır" en="Call Waiter" />
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <LanguageAwareText tr="Masa numaranızı girin" en="Enter your table number" />
                </p>
              </div>
              <button
                onClick={() => setWaiterCallOpen(false)}
                className="p-2 hover:bg-secondary/10 rounded-full transition-all duration-200 active:scale-95 elegant-border"
                aria-label="Kapat"
              >
                <X size={24} className="text-primary" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 space-y-5 bg-gradient-to-br from-white to-secondary/5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2 tracking-wide">
                  🪑 <LanguageAwareText tr="Masa Numarası" en="Table Number" /> <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder={language === 'tr' ? 'A5, 12, Bahçe-3...' : 'A5, 12, Garden-3...'}
                  value={waiterTableNumber}
                  onChange={(e) => setWaiterTableNumber(e.target.value)}
                  className="w-full text-lg elegant-border focus:border-secondary focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2 tracking-wide">
                  👤 <LanguageAwareText tr="İsim (İsteğe bağlı)" en="Name (Optional)" />
                </label>
                <Input
                  type="text"
                  placeholder={language === 'tr' ? 'Adınız' : 'Your name'}
                  value={waiterName}
                  onChange={(e) => setWaiterName(e.target.value)}
                  className="w-full elegant-border focus:border-secondary focus:ring-secondary"
                />
              </div>

              <Button
                onClick={handleWaiterCall}
                disabled={waiterCallLoading}
                className="w-full bg-gradient-to-r from-secondary to-secondary/95 text-secondary-foreground hover:from-secondary/95 hover:to-secondary py-4 sm:py-5 text-base sm:text-lg font-bold elegant-shadow hover:golden-glow transition-all duration-300 active:scale-95 rounded-xl border border-secondary/30"
              >
                {waiterCallLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                    <LanguageAwareText tr="Gönderiliyor..." en="Sending..." />
                  </>
                ) : (
                  <>
                    <Bell className="w-5 h-5 mr-2" />
                    <LanguageAwareText tr="Garson Çağır" en="Call Waiter" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  ) : null}
      </div>
  )
}

export default function MenuPage() {
  return (
    <LanguageProvider>
      <MenuPageContent />
    </LanguageProvider>
  );
}
