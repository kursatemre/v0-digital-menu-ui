"use client"

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

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-end md:items-center md:justify-center">
      <div className="bg-white w-full md:w-full md:max-w-lg rounded-t-lg md:rounded-lg shadow-xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">Alışveriş Sepeti</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Sepetiniz boş</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-foreground">{item.name}</h3>
                      <p className="text-primary font-bold">₺{item.price}</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-white rounded hover:bg-secondary transition-colors text-foreground"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 font-bold text-foreground w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-white rounded hover:bg-secondary transition-colors text-foreground"
                    >
                      +
                    </button>
                    <span className="ml-auto font-bold text-foreground">
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
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex justify-between text-muted-foreground">
              <span>Ara Toplam:</span>
              <span>₺{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-primary">
              <span>Genel Toplam:</span>
              <span>₺{total.toFixed(2)}</span>
            </div>
            <Button
              onClick={onPlaceOrder}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-base"
            >
              Sipariş Ver
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
