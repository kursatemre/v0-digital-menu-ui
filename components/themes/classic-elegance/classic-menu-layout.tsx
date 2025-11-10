"use client"

import { useState } from "react"
import { CategoryHeader } from "./category-header"
import { MenuItem } from "./menu-item"
import { useLanguage } from "@/contexts/language-context"
import { ShoppingBag, Bell, X, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

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
  tenantId?: string
}

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

export function ClassicMenuLayout({
  categories,
  products,
  headerSettings,
  tenantId
}: ClassicMenuLayoutProps) {
  const { language, setLanguage } = useLanguage()
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [waiterCallOpen, setWaiterCallOpen] = useState(false)
  const [waiterTableNumber, setWaiterTableNumber] = useState("")
  const [waiterName, setWaiterName] = useState("")
  const [waiterCallLoading, setWaiterCallLoading] = useState(false)

  // Order form states
  const [orderTableNumber, setOrderTableNumber] = useState("")
  const [orderCustomerName, setOrderCustomerName] = useState("")
  const [orderNotes, setOrderNotes] = useState("")
  const [orderLoading, setOrderLoading] = useState(false)

  const supabase = createClient()

  // Cart functions
  const addToCart = (product: { id: string; name: string; price: number }) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
    } else {
      setCart(prevCart =>
        prevCart.map(item => (item.id === productId ? { ...item, quantity: newQuantity } : item))
      )
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Waiter call function
  const handleWaiterCall = async () => {
    if (!waiterTableNumber.trim()) {
      alert(language === "tr" ? "Lütfen masa numaranızı girin!" : "Please enter your table number!")
      return
    }

    if (!tenantId) {
      alert(language === "tr" ? "Restoran bilgisi bulunamadı!" : "Restaurant information not found!")
      return
    }

    try {
      setWaiterCallLoading(true)
      const { error } = await supabase.from("waiter_calls").insert({
        tenant_id: tenantId,
        table_number: waiterTableNumber,
        customer_name: waiterName || null,
        status: "pending",
      })

      if (error) throw error

      alert(language === "tr" ? "Garson çağrınız iletildi!" : "Waiter call sent successfully!")
      setWaiterCallOpen(false)
      setWaiterTableNumber("")
      setWaiterName("")
    } catch (error) {
      console.error("Error calling waiter:", error)
      alert(language === "tr" ? "Garson çağrısı gönderilemedi!" : "Failed to send waiter call!")
    } finally {
      setWaiterCallLoading(false)
    }
  }

  // Place order function
  const handlePlaceOrder = async () => {
    if (!orderTableNumber.trim()) {
      alert(language === "tr" ? "Lütfen masa numaranızı girin!" : "Please enter your table number!")
      return
    }

    if (!tenantId) {
      alert(language === "tr" ? "Restoran bilgisi bulunamadı!" : "Restaurant information not found!")
      return
    }

    try {
      setOrderLoading(true)
      const orderItems = cart.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error } = await supabase.from("orders").insert({
        tenant_id: tenantId,
        table_number: orderTableNumber,
        customer_name: orderCustomerName || null,
        notes: orderNotes || null,
        items: orderItems,
        total: totalPrice,
        status: "pending",
      })

      if (error) throw error

      alert(language === "tr" ? "Siparişiniz alındı!" : "Order placed successfully!")

      // Clear form and cart
      setShowCart(false)
      clearCart()
      setOrderTableNumber("")
      setOrderCustomerName("")
      setOrderNotes("")
    } catch (error) {
      console.error("Error placing order:", error)
      alert(language === "tr" ? "Sipariş oluşturulamadı!" : "Failed to place order!")
    } finally {
      setOrderLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] relative overflow-x-hidden">
      {/* CSS for shine animation */}
      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Rich suede/fabric texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.5' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      {/* Additional subtle diagonal lines for fabric feel */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.1) 2px,
            rgba(255, 255, 255, 0.1) 4px
          )`,
        }}
      />

      {/* Header */}
      <header className="relative py-20 px-4 text-center border-b border-[#D4AF37]/30">
        {/* Top Button: Language Toggle */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8">
          <button
            onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
            className="group relative px-4 py-2 bg-[#1a1a1a] border border-[#D4AF37]/40 rounded-sm transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#2a2210]/30"
          >
            <span className="relative text-sm font-['Playfair_Display',serif] font-medium tracking-wider text-[#D4AF37]">
              {language === "tr" ? "EN" : "TR"}
            </span>
          </button>
        </div>

        {/* Top decorative ornament */}
        <div className="flex justify-center mb-8">
          <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20 Q 30 15, 50 20 T 90 20" stroke="#D4AF37" strokeWidth="1.5" fill="none"/>
            <circle cx="50" cy="20" r="2.5" fill="#D4AF37" opacity="0.8"/>
            <circle cx="35" cy="17" r="1.5" fill="#D4AF37" opacity="0.5"/>
            <circle cx="65" cy="17" r="1.5" fill="#D4AF37" opacity="0.5"/>
          </svg>
        </div>

        {headerSettings?.logo && (
          <div className="flex justify-center mb-8">
            <div className="relative p-2 bg-gradient-to-br from-[#FFD700]/20 via-transparent to-[#FDB931]/20 rounded-full">
              <img
                src={headerSettings.logo}
                alt="Logo"
                className="h-24 w-auto object-contain"
              />
            </div>
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-['Playfair_Display',serif] tracking-[0.25em] mb-6 font-semibold text-[#D4AF37]">
          {headerSettings?.title || "MENU"}
        </h1>

        {headerSettings?.subtitle && (
          <p className="text-[#D4C5B0] font-light text-lg sm:text-xl tracking-[0.3em] font-sans italic">
            {headerSettings.subtitle}
          </p>
        )}

        {/* Decorative line */}
        <div className="flex justify-center mt-10">
          <svg width="200" height="16" viewBox="0 0 200 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 8 L90 8" stroke="#D4AF37" strokeWidth="1" opacity="0.5"/>
            <path d="M110 8 L180 8" stroke="#D4AF37" strokeWidth="1" opacity="0.5"/>
            <circle cx="100" cy="8" r="3" fill="#D4AF37" opacity="0.8"/>
            <circle cx="92" cy="8" r="1.5" fill="#D4AF37" opacity="0.5"/>
            <circle cx="108" cy="8" r="1.5" fill="#D4AF37" opacity="0.5"/>
          </svg>
        </div>
      </header>

      {/* Menu Content */}
      <main className="max-w-7xl mx-auto py-16 relative z-10">
        {categories.map((category, categoryIndex) => {
          const categoryProducts = products.filter(p => p.categoryId === category.id)

          if (categoryProducts.length === 0) return null

          const categoryName = language === "en" && category.name_en
            ? category.name_en
            : category.name

          return (
            <section key={category.id} className="mb-20">
              <CategoryHeader title={categoryName} />

              {/* Two-column layout: Category image on left, products on right */}
              <div className="flex flex-row gap-4 sm:gap-6 lg:gap-10 px-4 items-center">
                {/* Left Column: Category Image - Portrait */}
                {category.image && (
                  <div className="w-[120px] sm:w-[180px] md:w-[220px] lg:w-[270px] xl:w-[320px] flex-shrink-0">
                    <div className="lg:sticky lg:top-8">
                      {/* Elegant frame with decorative thin borders */}
                      <div className="relative p-[2px] bg-gradient-to-br from-[#D4AF37] via-[#C9A961] to-[#D4AF37] rounded-sm shadow-xl overflow-hidden">
                        {/* Shine effect overlay */}
                        <div
                          className="absolute inset-0 opacity-40 pointer-events-none"
                          style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                            animation: 'shine 4s infinite',
                          }}
                        />

                        {/* Inner decorative border */}
                        <div className="relative p-[1px] bg-[#1a1a1a] rounded-sm">
                          <div className="p-1 bg-gradient-to-br from-[#D4AF37]/10 to-[#C9A961]/10 rounded-sm">
                            <img
                              src={category.image}
                              alt={categoryName}
                              className="w-full aspect-[9/16] object-cover rounded-sm"
                            />
                          </div>
                        </div>

                        {/* Corner decorative accents */}
                        <div className="absolute top-1 left-1 w-3 h-3 sm:w-4 sm:h-4 border-t border-l border-[#D4AF37]" />
                        <div className="absolute top-1 right-1 w-3 h-3 sm:w-4 sm:h-4 border-t border-r border-[#D4AF37]" />
                        <div className="absolute bottom-1 left-1 w-3 h-3 sm:w-4 sm:h-4 border-b border-l border-[#D4AF37]" />
                        <div className="absolute bottom-1 right-1 w-3 h-3 sm:w-4 sm:h-4 border-b border-r border-[#D4AF37]" />
                      </div>

                      {/* Decorative element below image */}
                      <div className="flex justify-center mt-4">
                        <svg width="120" height="20" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 10 Q 40 7, 60 10 T 105 10" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6"/>
                          <circle cx="60" cy="10" r="2" fill="#D4AF37" opacity="0.8"/>
                          <circle cx="48" cy="9" r="1.5" fill="#D4AF37" opacity="0.5"/>
                          <circle cx="72" cy="9" r="1.5" fill="#D4AF37" opacity="0.5"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Right Column: Products (2-3 items in grid) */}
                <div className="flex-1">
                  <div className="space-y-2">
                    {categoryProducts.map((product, index) => (
                      <MenuItem
                        key={product.id}
                        product={product}
                        featured={false}
                        onAddToCart={addToCart}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Category separator */}
              {categoryIndex < categories.length - 1 && (
                <div className="flex justify-center mt-16">
                  <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
                </div>
              )}
            </section>
          )
        })}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Waiter Call Button */}
        <button
          onClick={() => setWaiterCallOpen(true)}
          className="bg-[#1a1a1a] border-2 border-[#D4AF37] rounded-sm p-4 hover:bg-[#2a2210]/50 transition-all duration-300 shadow-2xl group"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-[#D4AF37] group-hover:animate-pulse" />
            <span className="text-[#D4AF37] font-['Playfair_Display',serif] font-semibold text-sm">
              {language === "tr" ? "Garson Çağır" : "Call Waiter"}
            </span>
          </div>
        </button>

        {/* Cart Button */}
        {totalItems > 0 && (
          <button
            onClick={() => setShowCart(true)}
            className="bg-[#1a1a1a] border-2 border-[#D4AF37] rounded-sm p-4 hover:bg-[#2a2210]/50 transition-all duration-300 shadow-2xl group"
          >
            <div className="relative flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
              <div className="flex flex-col items-start">
                <span className="text-[#D4AF37] font-['Playfair_Display',serif] font-semibold text-sm">
                  {totalItems} {language === "tr" ? "Ürün" : "Items"}
                </span>
                <span className="text-[#D4AF37] font-bold text-lg">
                  ₺{totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#1a1a1a] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {totalItems}
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Cart & Checkout Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1a1a1a] border-2 border-[#D4AF37] rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setShowCart(false)}
              className="sticky top-4 float-right mr-4 text-[#D4AF37] hover:text-[#FFD700] transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6">
              {/* Header */}
              <h2 className="text-3xl font-['Playfair_Display',serif] font-bold text-[#D4AF37] mb-6 text-center">
                {language === "tr" ? "Sepetiniz" : "Your Cart"}
              </h2>

              {/* Cart Items */}
              {cart.length === 0 ? (
                <p className="text-center text-[#D4C5B0] py-8">
                  {language === "tr" ? "Sepetiniz boş" : "Your cart is empty"}
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-[#252525]/50 border border-[#D4AF37]/20 rounded-sm"
                      >
                        <div className="flex-1">
                          <h3 className="text-[#D4AF37] font-['Playfair_Display',serif] font-semibold mb-1">
                            {item.name}
                          </h3>
                          <p className="text-[#D4C5B0] text-sm">
                            ₺{item.price.toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#D4AF37]/40 rounded-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-[#2a2210]/30 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-[#D4AF37]" />
                          </button>
                          <span className="text-[#D4AF37] font-semibold min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-[#2a2210]/30 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-[#D4AF37]" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right min-w-[5rem]">
                          <p className="text-[#D4AF37] font-bold">
                            ₺{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 hover:bg-red-900/30 transition-colors rounded-sm"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t border-[#D4AF37]/30 pt-4 mb-6">
                    <div className="flex justify-between items-center text-xl">
                      <span className="text-[#D4C5B0] font-['Playfair_Display',serif] font-semibold">
                        {language === "tr" ? "Toplam" : "Total"}:
                      </span>
                      <span className="text-[#D4AF37] font-bold text-2xl">
                        ₺{totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Order Form */}
                  <div className="space-y-4 border-t border-[#D4AF37]/30 pt-6">
                    <h3 className="text-xl font-['Playfair_Display',serif] font-bold text-[#D4AF37] mb-4">
                      {language === "tr" ? "Sipariş Bilgileri" : "Order Information"}
                    </h3>

                    <div>
                      <label className="block text-[#D4C5B0] text-sm mb-2 font-['Playfair_Display',serif]">
                        {language === "tr" ? "Masa Numarası" : "Table Number"} <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        placeholder={language === "tr" ? "Örn: A5, 12..." : "e.g. A5, 12..."}
                        value={orderTableNumber}
                        onChange={(e) => setOrderTableNumber(e.target.value)}
                        className="bg-[#1a1a1a] border-[#D4AF37]/40 text-[#D4C5B0] focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#D4C5B0] text-sm mb-2 font-['Playfair_Display',serif]">
                        {language === "tr" ? "İsim (İsteğe bağlı)" : "Name (Optional)"}
                      </label>
                      <Input
                        type="text"
                        placeholder={language === "tr" ? "Adınız" : "Your name"}
                        value={orderCustomerName}
                        onChange={(e) => setOrderCustomerName(e.target.value)}
                        className="bg-[#1a1a1a] border-[#D4AF37]/40 text-[#D4C5B0] focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#D4C5B0] text-sm mb-2 font-['Playfair_Display',serif]">
                        {language === "tr" ? "Not (İsteğe bağlı)" : "Notes (Optional)"}
                      </label>
                      <textarea
                        placeholder={language === "tr" ? "Sipariş notunuz..." : "Order notes..."}
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        rows={3}
                        className="w-full bg-[#1a1a1a] border border-[#D4AF37]/40 text-[#D4C5B0] focus:border-[#D4AF37] rounded-sm p-2 resize-none"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handlePlaceOrder}
                        disabled={orderLoading}
                        className="flex-1 bg-[#D4AF37] hover:bg-[#FFD700] text-[#1a1a1a] font-['Playfair_Display',serif] font-bold py-6 text-lg"
                      >
                        {orderLoading ? (
                          <span>{language === "tr" ? "Gönderiliyor..." : "Sending..."}</span>
                        ) : (
                          <span>{language === "tr" ? "Sipariş Ver" : "Place Order"}</span>
                        )}
                      </Button>
                      <Button
                        onClick={clearCart}
                        variant="outline"
                        className="border-red-500/40 text-red-400 hover:bg-red-900/20 hover:border-red-500 py-6"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Waiter Call Modal */}
      {waiterCallOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border-2 border-[#D4AF37] rounded-sm max-w-md w-full p-6 relative">
            <button
              onClick={() => setWaiterCallOpen(false)}
              className="absolute top-4 right-4 text-[#D4AF37] hover:text-[#FFD700] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-['Playfair_Display',serif] font-bold text-[#D4AF37] mb-6 text-center">
              {language === "tr" ? "Garson Çağır" : "Call Waiter"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[#D4C5B0] text-sm mb-2 font-['Playfair_Display',serif]">
                  {language === "tr" ? "Masa Numarası" : "Table Number"} <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder={language === "tr" ? "Örn: A5, 12..." : "e.g. A5, 12..."}
                  value={waiterTableNumber}
                  onChange={(e) => setWaiterTableNumber(e.target.value)}
                  className="bg-[#1a1a1a] border-[#D4AF37]/40 text-[#D4C5B0] focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#D4C5B0] text-sm mb-2 font-['Playfair_Display',serif]">
                  {language === "tr" ? "İsim (İsteğe bağlı)" : "Name (Optional)"}
                </label>
                <Input
                  type="text"
                  placeholder={language === "tr" ? "Adınız" : "Your name"}
                  value={waiterName}
                  onChange={(e) => setWaiterName(e.target.value)}
                  className="bg-[#1a1a1a] border-[#D4AF37]/40 text-[#D4C5B0] focus:border-[#D4AF37]"
                />
              </div>

              <Button
                onClick={handleWaiterCall}
                disabled={waiterCallLoading}
                className="w-full bg-[#D4AF37] hover:bg-[#FFD700] text-[#1a1a1a] font-['Playfair_Display',serif] font-bold py-6 text-lg"
              >
                {waiterCallLoading ? (
                  <span>{language === "tr" ? "Gönderiliyor..." : "Sending..."}</span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Bell className="w-5 h-5" />
                    {language === "tr" ? "Garson Çağır" : "Call Waiter"}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative py-16 px-4 text-center border-t border-[#D4AF37]/30 mt-20">
        <div className="flex justify-center mb-6">
          <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ornate footer decoration */}
            <path d="M25 20 Q 55 15, 90 20 Q 125 25, 155 20" stroke="#D4AF37" strokeWidth="1.5" fill="none"/>
            <path d="M5 20 L20 20 M160 20 L175 20" stroke="#D4AF37" strokeWidth="1"/>
            <circle cx="90" cy="20" r="2.5" fill="#D4AF37" opacity="0.8"/>
            <circle cx="102" cy="20" r="1.5" fill="#D4AF37" opacity="0.5"/>
            <circle cx="78" cy="20" r="1.5" fill="#D4AF37" opacity="0.5"/>
            <circle cx="90" cy="13" r="1.5" fill="#D4AF37" opacity="0.5"/>
            <circle cx="90" cy="27" r="1.5" fill="#D4AF37" opacity="0.5"/>
          </svg>
        </div>
        <p className="text-base sm:text-lg font-light tracking-[0.3em] font-['Playfair_Display',serif] italic mb-4 text-[#D4AF37]">
          BON APPÉTIT
        </p>
        <p className="text-[#B8956A] text-xs tracking-[0.3em] font-light uppercase">
          Fine Dining Experience
        </p>
      </footer>
    </div>
  )
}
