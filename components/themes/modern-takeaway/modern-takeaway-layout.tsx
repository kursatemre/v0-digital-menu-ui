"use client"

import { useState } from "react"
import { CategoryHeader } from "./category-header"
import { MenuItem } from "./menu-item"
import { ModernTakeawayHeader } from "./header"
import { CartModal } from "./cart-modal"
import { OrderForm } from "@/components/order-form"
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
}

interface Category {
  id: string
  name: string
  name_en?: string
  products: Product[]
}

interface CartItem {
  id: string
  productId: string
  name: string
  name_en?: string
  price: number
  quantity: number
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

interface ModernTakeawayLayoutProps {
  categories: Category[]
  tenantId: string
  restaurantName: string
  onAddToCart?: (item: any) => void
  dealOfTheDay?: Product[]
}

export function ModernTakeawayLayout({ 
  categories, 
  tenantId, 
  restaurantName,
  onAddToCart, 
  dealOfTheDay 
}: ModernTakeawayLayoutProps) {
  const { language } = useLanguage()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)

  const handleAddToCart = (item: any) => {
    const newItem: CartItem = {
      id: `${item.productId}-${Date.now()}`,
      productId: item.productId,
      name: item.name,
      name_en: item.name_en,
      price: item.price,
      quantity: 1,
      variant: item.variant,
      customizations: item.customizations,
      image: item.image
    }

    setCartItems((prev) => {
      // Check if same product with same variant and customizations exists
      const existingIndex = prev.findIndex((cartItem) => {
        const sameProduct = cartItem.productId === newItem.productId
        const sameVariant = JSON.stringify(cartItem.variant) === JSON.stringify(newItem.variant)
        const sameCustomizations = JSON.stringify(cartItem.customizations) === JSON.stringify(newItem.customizations)
        return sameProduct && sameVariant && sameCustomizations
      })

      if (existingIndex !== -1) {
        // Update quantity
        const updated = [...prev]
        updated[existingIndex].quantity += 1
        return updated
      } else {
        // Add new item
        return [...prev, newItem]
      }
    })

    // Call parent callback if provided
    if (onAddToCart) {
      onAddToCart(item)
    }
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const handleCheckout = () => {
    setShowCart(false)
    setShowOrderForm(true)
  }

  const handleOrderSuccess = (message: string) => {
    setCartItems([])
    setShowOrderForm(false)
  }

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <>
      {/* Header */}
      <ModernTakeawayHeader
        restaurantName={restaurantName}
        cartItemCount={cartItemCount}
        onCartClick={() => setShowCart(true)}
      />

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white pt-4">
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
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Cart Modal */}
      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Order Form Modal */}
      {showOrderForm && (
        <OrderForm
          onClose={() => setShowOrderForm(false)}
          total={cartTotal}
          items={cartItems.map(item => ({
            id: item.id,
            name: language === "en" && item.name_en ? item.name_en : item.name,
            price: item.price,
            quantity: item.quantity
          }))}
          onSuccess={handleOrderSuccess}
          onClearCart={() => setCartItems([])}
          tenantId={tenantId}
        />
      )}

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
    </>
  )
}
