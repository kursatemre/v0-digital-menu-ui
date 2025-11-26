"use client"

import { useLanguage } from "@/contexts/language-context"
import { Globe, Award } from "lucide-react"
import { useState } from "react"

interface HeaderProps {
  restaurantName: string
  cartItemCount: number
  onCartClick: () => void
}

export function ModernTakeawayHeader({
  restaurantName,
  cartItemCount,
  onCartClick
}: HeaderProps) {
  const { language, setLanguage } = useLanguage()
  const [showLangMenu, setShowLangMenu] = useState(false)

  return (
    <>
      {/* Header with Background Image */}
      <header className="relative h-48 bg-cover bg-center flex flex-col justify-center items-center text-center shadow-xl"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1511920170033-de892677d292?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjU0NzJ8MHwxfHNlYXJjaHwxfHxjYWZmZWluZSUyMGJlYW5zfGVufDB8fHx8MTcwODY0MzMzNHww&ixlib=rb-4.0.3&q=80&w=1080')`
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Content */}
        <div className="relative z-10 text-white px-4">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <Award className="text-emerald-400 h-10 w-10" />
            <h1 className="text-4xl font-extrabold tracking-wider uppercase" style={{ textShadow: '0px 1px 3px rgba(0, 0, 0, 0.7)' }}>
              {restaurantName}
            </h1>
          </div>
          <p className="text-base font-light" style={{ textShadow: '0px 1px 3px rgba(0, 0, 0, 0.7)' }}>
            {language === "en" ? "Digital Take Away Menu" : "Dijital Take Away Menüsü"}
          </p>
        </div>

        {/* Language Selector - Top Right */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors"
            aria-label="Change language"
          >
            <Globe className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white uppercase">
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
                    language === "tr" ? "bg-emerald-50 text-emerald-600 font-semibold" : "text-gray-700"
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
                    language === "en" ? "bg-emerald-50 text-emerald-600 font-semibold" : "text-gray-700"
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </>
          )}
        </div>
      </header>
    </>
  )
}
