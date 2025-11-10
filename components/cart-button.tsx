"use client"

import { ShoppingBag } from "lucide-react"

interface CartButtonProps {
  itemCount: number
  total: number
  onClick: () => void
}

export function CartButton({ itemCount, total, onClick }: CartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-primary [color:var(--primary-text-color)] rounded-full hover:bg-primary/90 transition-all duration-300 p-0 z-30 elegant-shadow hover:golden-glow active:scale-95 border-2 border-primary/30"
      style={{
        boxShadow: itemCount > 0
          ? '0 10px 40px rgba(139, 90, 60, 0.25), 0 0 30px rgba(201, 169, 97, 0.2)'
          : undefined
      }}
    >
      <div className="relative p-4 flex items-center justify-center">
        <ShoppingBag size={26} strokeWidth={2.5} />
        {itemCount > 0 && (
          <>
            <div className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg">
              {itemCount}
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-white/95 text-primary px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap shadow-md border border-secondary/30">
              ₺{total.toFixed(2)}
            </div>
          </>
        )}
      </div>
    </button>
  )
}
