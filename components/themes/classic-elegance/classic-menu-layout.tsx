"use client"

import { CategoryHeader } from "./category-header"
import { MenuItem } from "./menu-item"
import { useLanguage } from "@/contexts/language-context"

interface Product {
  id: string
  name: string
  name_en?: string
  description: string
  description_en?: string
  price: number
  categoryId: string
  image?: string
  badge?: string | null
}

interface Category {
  id: string
  name: string
  name_en?: string
  image?: string
}

interface ClassicMenuLayoutProps {
  categories: Category[]
  products: Product[]
  headerSettings?: {
    title?: string
    subtitle?: string
    logo?: string
  }
}

export function ClassicMenuLayout({
  categories,
  products,
  headerSettings
}: ClassicMenuLayoutProps) {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-[#1a1a1a] relative overflow-x-hidden">
      {/* CSS for shine animation */}
      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Rich suede/fabric texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.5' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      {/* Additional subtle diagonal lines for fabric feel */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.1) 2px,
            rgba(255, 255, 255, 0.1) 4px
          )`,
        }}
      />

      {/* Header */}
      <header className="relative py-20 px-4 text-center border-b border-[#FFD700]/30">
        {/* Language Toggle Button */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8">
          <button
            onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
            className="group relative px-4 py-2 bg-[#1a1a1a] border-2 rounded-sm overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
              borderImage: 'linear-gradient(135deg, #FDB931, #FFD700, #FFED4E) 1',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 to-[#FDB931]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span
              className="relative text-sm font-['Playfair_Display',serif] font-semibold tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #FDB931, #FFD700, #FFED4E)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {language === "tr" ? "EN" : "TR"}
            </span>
          </button>
        </div>

        {/* Top decorative ornament */}
        <div className="flex justify-center mb-8">
          <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="headerGold" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FDB931" />
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFED4E" />
              </radialGradient>
            </defs>
            <path d="M10 20 Q 30 15, 50 20 T 90 20" stroke="url(#headerGold)" strokeWidth="1.5" fill="none" style={{ animation: 'glow 2s ease-in-out infinite' }}/>
            <circle cx="50" cy="20" r="3" fill="url(#headerGold)"/>
            <circle cx="35" cy="17" r="1.5" fill="#FDB931" opacity="0.8"/>
            <circle cx="65" cy="17" r="1.5" fill="#FDB931" opacity="0.8"/>
          </svg>
        </div>

        {headerSettings?.logo && (
          <div className="flex justify-center mb-8">
            <div className="relative p-2 bg-gradient-to-br from-[#FFD700]/20 via-transparent to-[#FDB931]/20 rounded-full">
              <img
                src={headerSettings.logo}
                alt="Logo"
                className="h-24 w-auto object-contain"
              />
            </div>
          </div>
        )}

        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-['Playfair_Display',serif] tracking-[0.3em] mb-6 font-bold drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]"
          style={{
            background: 'radial-gradient(circle, #FDB931 0%, #FFD700 40%, #FFED4E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {headerSettings?.title || "MENU"}
        </h1>

        {headerSettings?.subtitle && (
          <p className="text-[#D4C5B0] font-light text-lg sm:text-xl tracking-[0.3em] font-sans italic">
            {headerSettings.subtitle}
          </p>
        )}

        {/* Decorative line */}
        <div className="flex justify-center mt-10">
          <svg width="250" height="20" viewBox="0 0 250 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="headerLineGold" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FDB931" />
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFED4E" />
              </radialGradient>
            </defs>
            <path d="M20 10 L110 10" stroke="url(#headerLineGold)" strokeWidth="1" opacity="0.6"/>
            <path d="M140 10 L230 10" stroke="url(#headerLineGold)" strokeWidth="1" opacity="0.6"/>
            <circle cx="125" cy="10" r="4" fill="url(#headerLineGold)"/>
            <circle cx="115" cy="10" r="2" fill="#FDB931" opacity="0.7"/>
            <circle cx="135" cy="10" r="2" fill="#FDB931" opacity="0.7"/>
          </svg>
        </div>
      </header>

      {/* Menu Content */}
      <main className="max-w-7xl mx-auto py-16 relative z-10">
        {categories.map((category, categoryIndex) => {
          const categoryProducts = products.filter(p => p.categoryId === category.id)

          if (categoryProducts.length === 0) return null

          const categoryName = language === "en" && category.name_en
            ? category.name_en
            : category.name

          return (
            <section key={category.id} className="mb-20">
              <CategoryHeader title={categoryName} />

              {/* Two-column layout: Category image on left, products on right */}
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 px-4">
                {/* Left Column: Category Image - 540x960 Portrait */}
                {category.image && (
                  <div className="w-full lg:w-[270px] xl:w-[320px] flex-shrink-0 mx-auto lg:mx-0">
                    <div className="sticky top-8">
                      {/* Elegant frame with decorative thin borders */}
                      <div className="relative p-[2px] bg-gradient-to-br from-[#FFD700] via-[#FDB931] to-[#FFD700] rounded-sm shadow-2xl overflow-hidden">
                        {/* Shine effect overlay */}
                        <div
                          className="absolute inset-0 opacity-40 pointer-events-none"
                          style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                            animation: 'shine 4s infinite',
                          }}
                        />

                        {/* Inner decorative border */}
                        <div className="relative p-[1px] bg-[#1a1a1a] rounded-sm">
                          <div className="p-1 bg-gradient-to-br from-[#FFD700]/10 to-[#FDB931]/10 rounded-sm">
                            <img
                              src={category.image}
                              alt={categoryName}
                              className="w-full aspect-[9/16] object-cover rounded-sm"
                              style={{ maxHeight: '480px' }}
                            />
                          </div>
                        </div>

                        {/* Corner decorative accents */}
                        <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-[#FFD700]" />
                        <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-[#FFD700]" />
                        <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-[#FFD700]" />
                        <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-[#FFD700]" />
                      </div>

                      {/* Decorative element below image */}
                      <div className="flex justify-center mt-4">
                        <svg width="150" height="24" viewBox="0 0 150 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <radialGradient id="categoryImageGold" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#FDB931" />
                              <stop offset="50%" stopColor="#FFD700" />
                              <stop offset="100%" stopColor="#FFED4E" />
                            </radialGradient>
                          </defs>
                          <path d="M15 12 Q 45 8, 75 12 T 135 12" stroke="url(#categoryImageGold)" strokeWidth="1.2" fill="none" opacity="0.7"/>
                          <circle cx="75" cy="12" r="2.5" fill="url(#categoryImageGold)"/>
                          <circle cx="60" cy="10" r="1.5" fill="#FDB931" opacity="0.6"/>
                          <circle cx="90" cy="10" r="1.5" fill="#FDB931" opacity="0.6"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Right Column: Products (2-3 items in grid) */}
                <div className="flex-1">
                  <div className="space-y-2">
                    {categoryProducts.map((product, index) => (
                      <MenuItem
                        key={product.id}
                        product={product}
                        featured={false}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Category separator */}
              {categoryIndex < categories.length - 1 && (
                <div className="flex justify-center mt-16">
                  <div className="w-64 h-px bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent blur-sm" />
                  </div>
                </div>
              )}
            </section>
          )
        })}
      </main>

      {/* Footer */}
      <footer className="relative py-16 px-4 text-center border-t border-[#FFD700]/30 mt-20">
        <div className="flex justify-center mb-6">
          <svg width="220" height="50" viewBox="0 0 220 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ornate footer decoration */}
            <defs>
              <radialGradient id="footerGold" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FDB931" />
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFED4E" />
              </radialGradient>
            </defs>
            <path d="M30 25 Q 65 18, 95 25 Q 125 32, 155 25" stroke="url(#footerGold)" strokeWidth="1.5" fill="none" style={{ animation: 'glow 3s ease-in-out infinite' }}/>
            <path d="M5 25 L25 25 M160 25 L215 25" stroke="url(#footerGold)" strokeWidth="1.2"/>
            <circle cx="95" cy="25" r="3.5" fill="url(#footerGold)"/>
            <circle cx="110" cy="25" r="2" fill="#FDB931" opacity="0.7"/>
            <circle cx="80" cy="25" r="2" fill="#FDB931" opacity="0.7"/>
            <circle cx="95" cy="15" r="1.5" fill="url(#footerGold)" opacity="0.7"/>
            <circle cx="95" cy="35" r="1.5" fill="url(#footerGold)" opacity="0.7"/>
          </svg>
        </div>
        <p
          className="text-base sm:text-lg font-light tracking-[0.4em] font-['Playfair_Display',serif] italic mb-4 drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]"
          style={{
            background: 'radial-gradient(circle, #FDB931 0%, #FFD700 50%, #FFED4E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          BON APPÉTIT
        </p>
        <p className="text-[#B8956A] text-xs tracking-[0.3em] font-light uppercase">
          Fine Dining Experience
        </p>
      </footer>
    </div>
  )
}
