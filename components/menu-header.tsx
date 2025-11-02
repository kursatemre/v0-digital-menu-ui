"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function MenuHeader() {
  const [headerConfig, setHeaderConfig] = useState({
    title: "Menümüz",
    subtitle: "Lezzetli yemeklerimizi keşfedin!",
    logo: "",
  })

  useEffect(() => {
    const loadSettings = async () => {
      const supabase = createClient()
      try {
        const { data: headerData, error } = await supabase.from("settings").select("*").eq("key", "header").single()

        if (headerData?.value) {
          setHeaderConfig(headerData.value)
        } else {
          // Fallback to localStorage
          const saved = localStorage.getItem("restaurant_header")
          if (saved) {
            setHeaderConfig(JSON.parse(saved))
          }
        }
      } catch (err) {
        console.error("Error loading header settings:", err)
        const saved = localStorage.getItem("restaurant_header")
        if (saved) {
          try {
            setHeaderConfig(JSON.parse(saved))
          } catch (e) {
            console.error("Failed to load header config:", e)
          }
        }
      }
    }

    loadSettings()
  }, [])

  return (
    <div className="relative overflow-hidden bg-white dotted-bg border-b border-primary/10">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="flex items-start justify-between gap-6">
          {/* Left side: Title and subtitle */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2">{headerConfig.title}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">{headerConfig.subtitle}</p>
          </div>

          {/* Right side: Logo */}
          {headerConfig.logo && (
            <div className="flex-shrink-0 hidden sm:block">
              <img
                src={headerConfig.logo || "/placeholder.svg"}
                alt="Logo"
                className="h-20 w-20 sm:h-24 sm:w-24 object-contain bg-white rounded-lg p-2 shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
