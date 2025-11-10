"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Plus, Settings, X } from "lucide-react"

interface Variant {
  size: string
  price: number
}

interface CustomizationOption {
  id: string
  name: string
  price: number
}

interface MenuItemProps {
  product: {
    id: string
    name: string
    name_en?: string
    description: string
    description_en?: string
    price: number
    image?: string
    badge?: string | null
    variants?: Variant[]
  }
  onAddToCart?: (item: { 
    id: string
    name: string
    price: number
    variant?: string
    customizations?: { name: string; price: number }[]
  }) => void
}

export function MenuItem({ product, onAddToCart }: MenuItemProps) {
  const { language } = useLanguage()
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants?.[1]?.size || product.variants?.[0]?.size || "M"
  )
  const [showCustomization, setShowCustomization] = useState(false)
  
  // Customization states
  const [milkType, setMilkType] = useState<string>("full")
  const [syrup, setSyrup] = useState<string>("none")
  const [extraShot, setExtraShot] = useState(false)

  const name = language === "en" && product.name_en ? product.name_en : product.name
  const description = language === "en" && product.description_en ? product.description_en : product.description

  // Milk options
  const milkOptions = [
    { id: "full", name: "Tam Yağlı", nameEn: "Whole Milk", price: 0 },
    { id: "almond", name: "Badem Sütü", nameEn: "Almond Milk", price: 8 },
    { id: "oat", name: "Yulaf Sütü", nameEn: "Oat Milk", price: 10 },
  ]

  // Syrup options
  const syrupOptions = [
    { id: "none", name: "Yok", nameEn: "None", price: 0 },
    { id: "vanilla", name: "Vanilya", nameEn: "Vanilla", price: 5 },
    { id: "caramel", name: "Karamel", nameEn: "Caramel", price: 5 },
  ]

  const getVariantPrice = () => {
    if (!product.variants) return product.price
    const variant = product.variants.find(v => v.size === selectedSize)
    return variant?.price || product.price
  }

  const getCustomizationTotal = () => {
    let total = getVariantPrice()
    const milk = milkOptions.find(m => m.id === milkType)
    const syrupItem = syrupOptions.find(s => s.id === syrup)
    
    if (milk) total += milk.price
    if (syrupItem) total += syrupItem.price
    if (extraShot) total += 10
    
    return total
  }

  const handleQuickAdd = () => {
    if (onAddToCart) {
      onAddToCart({
        id: product.id,
        name: product.name,
        price: getVariantPrice(),
        variant: selectedSize,
      })
    }
  }

  const handleCustomizedAdd = () => {
    if (onAddToCart) {
      const customizations: { name: string; price: number }[] = []
      
      const milk = milkOptions.find(m => m.id === milkType)
      if (milk && milk.price > 0) {
        customizations.push({ name: milk.name, price: milk.price })
      }
      
      const syrupItem = syrupOptions.find(s => s.id === syrup)
      if (syrupItem && syrupItem.price > 0) {
        customizations.push({ name: syrupItem.name, price: syrupItem.price })
      }
      
      if (extraShot) {
        customizations.push({ name: "Ekstra Shot", price: 10 })
      }

      onAddToCart({
        id: product.id,
        name: product.name,
        price: getCustomizationTotal(),
        variant: selectedSize,
        customizations,
      })
    }
    setShowCustomization(false)
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          {/* Product Image */}
          {product.image && (
            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-base leading-tight">{name}</h3>
              {product.badge && (
                <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-semibold whitespace-nowrap">
                  {product.badge}
                </span>
              )}
            </div>
            
            {description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
            )}

            {/* Size Selection & Actions */}
            <div className="flex items-center justify-between gap-3">
              {/* Size Pills */}
              {product.variants && product.variants.length > 0 ? (
                <div className="flex items-center gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.size}
                      onClick={() => setSelectedSize(variant.size)}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                        selectedSize === variant.size
                          ? "bg-orange-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span className="text-xs">{variant.size}</span>
                      <span className="ml-1">{variant.price}₺</span>
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900">{product.price}₺</span>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Quick Add to Cart */}
                <button
                  onClick={handleQuickAdd}
                  className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                  aria-label="Sepete Ekle"
                >
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                </button>

                {/* Customize Button */}
                <button
                  onClick={() => setShowCustomization(true)}
                  className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition-all"
                  aria-label="Özelleştir"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCustomization(false)
          }}
        >
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{name}</h3>
              <button
                onClick={() => setShowCustomization(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-6">
              {/* Size Selection */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Boyut Seçin</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.size}
                        onClick={() => setSelectedSize(variant.size)}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          selectedSize === variant.size
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{variant.size}</div>
                        <div className="text-sm text-gray-600">{variant.price}₺</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Milk Type */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Süt Tipi</h4>
                <div className="space-y-2">
                  {milkOptions.map((milk) => (
                    <button
                      key={milk.id}
                      onClick={() => setMilkType(milk.id)}
                      className={`w-full p-3 rounded-lg border-2 flex items-center justify-between transition-all ${
                        milkType === milk.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="font-medium text-gray-900">
                        {language === "en" ? milk.nameEn : milk.name}
                      </span>
                      <span className="text-sm font-semibold text-gray-600">
                        {milk.price > 0 ? `+${milk.price}₺` : "Ücretsiz"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Syrup */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Şurup</h4>
                <div className="space-y-2">
                  {syrupOptions.map((syrupItem) => (
                    <button
                      key={syrupItem.id}
                      onClick={() => setSyrup(syrupItem.id)}
                      className={`w-full p-3 rounded-lg border-2 flex items-center justify-between transition-all ${
                        syrup === syrupItem.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="font-medium text-gray-900">
                        {language === "en" ? syrupItem.nameEn : syrupItem.name}
                      </span>
                      <span className="text-sm font-semibold text-gray-600">
                        {syrupItem.price > 0 ? `+${syrupItem.price}₺` : "-"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra Shot */}
              <div>
                <button
                  onClick={() => setExtraShot(!extraShot)}
                  className={`w-full p-4 rounded-lg border-2 flex items-center justify-between transition-all ${
                    extraShot
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      extraShot ? "bg-orange-500 border-orange-500" : "border-gray-300"
                    }`}>
                      {extraShot && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">Ekstra Shot</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">+10₺</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={handleCustomizedAdd}
                className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-6 h-6" strokeWidth={2.5} />
                <span>Sepete Ekle ({getCustomizationTotal()}₺)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
