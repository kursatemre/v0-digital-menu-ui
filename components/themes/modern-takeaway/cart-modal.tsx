"use client"

import { useLanguage } from "@/contexts/language-context"
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import { useEffect } from "react"

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

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (itemId: string, newQuantity: number) => void
  onRemoveItem: (itemId: string) => void
  onCheckout: () => void
}

export function CartModal({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartModalProps) {
  const { language } = useLanguage()

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900">
              {language === "en" ? "Your Order" : "Siparişiniz"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {language === "en" ? "Your cart is empty" : "Sepetiniz boş"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-3 flex gap-3"
                >
                  {/* Image */}
                  {item.image && (
                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={language === "en" && item.name_en ? item.name_en : item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {language === "en" && item.name_en ? item.name_en : item.name}
                    </h3>

                    {/* Variant */}
                    {item.variant && (
                      <p className="text-xs text-gray-600 mb-1">
                        {language === "en" && item.variant.name_en
                          ? item.variant.name_en
                          : item.variant.name}
                      </p>
                    )}

                    {/* Customizations */}
                    {item.customizations && item.customizations.length > 0 && (
                      <div className="text-xs text-gray-500 space-y-0.5 mb-2">
                        {item.customizations.map((custom, idx) => (
                          <div key={idx}>
                            + {language === "en" && custom.optionName_en
                              ? custom.optionName_en
                              : custom.optionName}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-gray-900">
                        {(item.price * item.quantity).toFixed(2)}₺
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200">
                          <button
                            onClick={() => {
                              if (item.quantity === 1) {
                                onRemoveItem(item.id)
                              } else {
                                onUpdateQuantity(item.id, item.quantity - 1)
                              }
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
                          >
                            {item.quantity === 1 ? (
                              <Trash2 className="w-4 h-4 text-red-500" />
                            ) : (
                              <Minus className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                          
                          <span className="px-3 text-sm font-semibold text-gray-900 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Total & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                {language === "en" ? "Total" : "Toplam"}
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {total.toFixed(2)}₺
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>
                {language === "en" ? "Place Order" : "Siparişi Tamamla"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
