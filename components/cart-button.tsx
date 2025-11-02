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
      className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors p-0 z-30"
    >
      <div className="relative p-4 flex items-center justify-center">
        <ShoppingBag size={24} />
        {itemCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {itemCount}
          </div>
        )}
      </div>
    </button>
  )
}
