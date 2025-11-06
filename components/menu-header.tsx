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
          .single()

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
    <div className="relative overflow-hidden border-b border-primary/10">
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
        /* Default Background Pattern */
        <div className="absolute inset-0 z-0 bg-white dotted-bg" />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-16">
        <div className="flex items-start justify-between gap-3 sm:gap-6">
          {/* Left side: Title and subtitle */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-1 sm:mb-2">{headerConfig.title}</h1>
            <p className="text-xs sm:text-base text-muted-foreground">{headerConfig.subtitle}</p>
          </div>

          {/* Right side: Logo */}
          {headerConfig.logo && (
            <div className="flex-shrink-0">
              <img
                src={headerConfig.logo || "/placeholder.svg"}
                alt="Logo"
                className="h-16 w-16 sm:h-24 sm:w-24 object-contain bg-white rounded-lg p-2 shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
