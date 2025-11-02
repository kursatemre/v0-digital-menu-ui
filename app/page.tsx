"use client"

import { useState, useEffect } from "react"
import { MenuHeader } from "@/components/menu-header"
import { CartButton } from "@/components/cart-button"
import { CartDetailView } from "@/components/cart-detail-view"
import { OrderForm } from "@/components/order-form"
import { Heart, ChevronDown, ChevronUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

type Product = {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  image: string
}

type Category = {
  id: string
  name: string
  image: string
}

export default function MenuPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [orderFormOpen, setOrderFormOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: themeData } = await supabase.from("settings").select("*").eq("key", "theme").single()

        if (themeData?.value) {
          setTheme(themeData.value)
          // Apply theme to document
          document.documentElement.style.setProperty("--primary", themeData.value.primaryColor)
          document.documentElement.style.setProperty("--secondary", themeData.value.secondaryColor)
        } else {
          const storedTheme = localStorage.getItem("restaurant_theme")
          if (storedTheme) {
            const parsedTheme = JSON.parse(storedTheme)
            setTheme(parsedTheme)
            document.documentElement.style.setProperty("--primary", parsedTheme.primaryColor)
            document.documentElement.style.setProperty("--secondary", parsedTheme.secondaryColor)
          }
        }

        // Load categories from Supabase
        const { data: categoriesData, error: catError } = await supabase
          .from("categories")
          .select("*")
          .order("display_order", { ascending: true })

        if (catError) throw catError
        if (categoriesData) {
          const formattedCategories = categoriesData.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            image: cat.image || "",
          }))
          setCategories(formattedCategories)
          if (formattedCategories.length > 0) {
            setExpandedCategories(new Set([formattedCategories[0].id]))
          }
        }

        // Load products from Supabase
        const { data: productsData, error: prodError } = await supabase
          .from("products")
          .select("*")
          .order("display_order", { ascending: true })

        if (prodError) throw prodError
        if (productsData) {
          const formattedProducts = productsData.map((prod: any) => ({
            id: prod.id,
            name: prod.name,
            description: prod.description || "",
            price: prod.price,
            categoryId: prod.category_id,
            image: prod.image || "",
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

    const storedFavorites = localStorage.getItem("restaurant_favorites")
    if (storedFavorites) {
      try {
        setFavorites(new Set(JSON.parse(storedFavorites)))
      } catch (e) {
        console.error("Failed to load favorites:", e)
      }
    }
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

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
      } else {
        newFavorites.add(productId)
      }
      localStorage.setItem("restaurant_favorites", JSON.stringify(Array.from(newFavorites)))
      return newFavorites
    })
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

  return (
    <div className="min-h-screen bg-background">
      <MenuHeader />

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

              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl border border-primary/15 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-primary/5 transition-colors accent-left-border"
                  >
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-foreground">{category.name}</h2>
                      <span className="text-sm text-muted-foreground bg-primary/10 px-3 py-1 rounded-full font-medium">
                        {categoryProducts.length} ürün
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-primary" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-primary" />
                    )}
                  </button>

                  {/* Category Products */}
                  {isExpanded && (
                    <div className="border-t border-primary/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 p-4 sm:p-6">
                      {categoryProducts.length > 0 ? (
                        categoryProducts.map((product) => (
                          <div
                            key={product.id}
                            className="bg-white border border-primary/10 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row"
                          >
                            {/* Product Image */}
                            <div className="relative flex-shrink-0 sm:w-44">
                              {product.image ? (
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-full h-40 sm:h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-40 sm:h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-4xl">
                                  🍽️
                                </div>
                              )}
                              {/* Favorite button - positioned on image */}
                              <button
                                onClick={() => toggleFavorite(product.id)}
                                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-primary hover:bg-white transition-all shadow-md"
                              >
                                <Heart
                                  className={`w-4 h-4 transition-all ${
                                    favorites.has(product.id) ? "fill-current" : ""
                                  }`}
                                />
                              </button>
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 p-3 sm:p-4 flex flex-col">
                              {/* Product Name */}
                              <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5 line-clamp-2">
                                {product.name}
                              </h3>

                              {/* Product Description */}
                              <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
                                {product.description}
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
                                  onClick={() => addToCart(product, 1)}
                                  className="bg-primary text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg hover:bg-primary/90 active:scale-95 transition-all text-sm font-semibold shadow-md hover:shadow-lg whitespace-nowrap"
                                >
                                  Sepete Ekle
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full px-6 py-8 text-center text-muted-foreground">
                          Bu kategoride ürün bulunmamaktadır.
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
            <p className="text-muted-foreground text-lg mb-6">Henüz kategori eklenmemiştir.</p>
            <p className="text-sm text-muted-foreground">/admin sayfasından kategoriler ve ürünler ekleyebilirsiniz.</p>
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
        <OrderForm onClose={() => setOrderFormOpen(false)} onSubmit={handlePlaceOrder} total={totalPrice} />
      )}
    </div>
  )
}
