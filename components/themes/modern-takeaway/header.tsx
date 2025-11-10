"use client"

import { useLanguage } from "@/contexts/language-context"
import { ShoppingCart, Globe, Menu } from "lucide-react"
import { useState } from "react"

interface HeaderProps {
  restaurantName: string
  cartItemCount: number
  onCartClick: () => void
  onMenuClick?: () => void
}

export function ModernTakeawayHeader({ 
  restaurantName, 
  cartItemCount, 
  onCartClick,
  onMenuClick 
}: HeaderProps) {
  const { language, setLanguage } = useLanguage()
  const [showLangMenu, setShowLangMenu] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left: Menu Icon (optional) */}
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          {/* Center: Restaurant Name */}
          <div className="flex-1 text-center lg:text-left lg:flex-initial">
            <h1 className="font-bold text-lg text-gray-900 truncate px-2">
              {restaurantName}
            </h1>
          </div>

          {/* Right: Language Selector & Cart */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Change language"
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700 uppercase">
                  {language}
                </span>
              </button>

              {/* Language Dropdown */}
              {showLangMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLangMenu(false)}
                  />
                  <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => {
                        setLanguage("tr")
                        setShowLangMenu(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                        language === "tr" ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-700"
                      }`}
                    >
                      🇹🇷 Türkçe
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("en")
                        setShowLangMenu(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                        language === "en" ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-700"
                      }`}
                    >
                      🇬🇧 English
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
