"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartDetailViewProps {
  items: CartItem[]
  onClose: () => void
  onRemoveItem: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onPlaceOrder: () => void
}

export function CartDetailView({ items, onClose, onRemoveItem, onUpdateQuantity, onPlaceOrder }: CartDetailViewProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const subtotal = total

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-end md:items-center md:justify-center">
      <div className="bg-gradient-to-br from-white to-primary/5 w-full md:w-full md:max-w-lg rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col border border-primary/20">
        {/* Header */}
        <div className="border-b border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10 p-4 sm:p-5 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">Sepetim</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{items.length} ürün</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-all active:scale-95"
            aria-label="Kapat"
          >
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-muted-foreground text-lg">Sepetiniz boş</p>
              <p className="text-sm text-muted-foreground mt-2">Menüden ürün ekleyerek başlayın</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-primary/10 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground text-sm sm:text-base truncate">{item.name}</h3>
                      <p className="text-primary font-bold text-lg mt-1">₺{item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-muted-foreground hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded-full ml-2"
                      aria-label="Ürünü sil"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg hover:from-primary/20 hover:to-primary/10 transition-all font-bold text-primary active:scale-95"
                      aria-label="Azalt"
                    >
                      −
                    </button>
                    <span className="px-4 py-1.5 font-bold text-foreground text-center min-w-12 bg-muted/50 rounded-lg">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg hover:from-primary/20 hover:to-primary/10 transition-all font-bold text-primary active:scale-95"
                      aria-label="Arttır"
                    >
                      +
                    </button>
                    <span className="ml-auto font-bold text-foreground text-lg">
                      ₺{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="border-t border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 p-4 sm:p-5 space-y-3 rounded-b-2xl">
            <div className="flex justify-between text-muted-foreground text-sm sm:text-base">
              <span>Ara Toplam:</span>
              <span className="font-semibold">₺{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl sm:text-2xl font-bold text-primary">
              <span>Toplam:</span>
              <span>₺{total.toFixed(2)}</span>
            </div>
            <Button
              onClick={onPlaceOrder}
              className="w-full bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary/80 py-3 sm:py-4 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all active:scale-98 rounded-xl"
            >
              Sipariş Ver 🎉
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
