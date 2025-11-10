"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface MenuHeaderProps {
  title?: string;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
}

export function MenuHeader({ title = "Menümüz", theme }: MenuHeaderProps) {
  const [headerConfig, setHeaderConfig] = useState({
    title: "Menümüz",
    subtitle: "Lezzetli yemeklerimizi keşfedin!",
    logo: "",
    backgroundImage: "",
    backgroundOpacity: 0.3,
  })

  useEffect(() => {
    const loadSettings = async () => {
      const supabase = createClient()
      try {
        // Önce URL'den slug'ı al
        const slug = window.location.pathname.split('/')[1]
        
        // Slug ile tenant_id'yi bul
        const { data: tenantData, error: tenantError } = await supabase
          .from("tenants")
          .select("id")
          .eq("slug", slug)
          .single()

        if (tenantError || !tenantData) {
          throw new Error("Tenant not found")
        }

        // Tenant'a özgü header ayarlarını çek
        const { data: headerData, error } = await supabase
          .from("settings")
          .select("*")
          .eq("key", "header")
          .eq("tenant_id", tenantData.id)
          .maybeSingle()

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
    <div className="relative overflow-hidden border-b-2 border-secondary/20 elegant-gradient-bg">
      {/* Background Image */}
      {headerConfig.backgroundImage ? (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${headerConfig.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: headerConfig.backgroundOpacity || 0.3
          }}
        />
      ) : (
        /* Default Elegance Pattern */
        <div className="absolute inset-0 z-0 elegance-pattern" />
      )}

      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-20">
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          {/* Left side: Title and subtitle */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-serif font-bold text-foreground mb-2 sm:mb-3 tracking-tight">
              {headerConfig.title}
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground italic font-light">
              {headerConfig.subtitle}
            </p>
          </div>

          {/* Right side: Logo */}
          {headerConfig.logo && (
            <div className="flex-shrink-0">
              <div className="elegant-border-thick rounded-xl p-2 sm:p-3 bg-white/90 backdrop-blur-sm elegant-shadow">
                <img
                  src={headerConfig.logo || "/placeholder.svg"}
                  alt="Logo"
                  className="h-16 w-16 sm:h-28 sm:w-28 object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-60"></div>
    </div>
  )
}
