"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Plus, Settings, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Variant {
  id: string
  name: string
  name_en?: string
  price_modifier: number
  is_default: boolean
}

interface CustomizationOption {
  id: string
  name: string
  name_en?: string
  price_modifier: number
  is_default: boolean
}

interface CustomizationGroup {
  id: string
  name: string
  name_en?: string
  is_required: boolean
  options: CustomizationOption[]
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
  tenantId: string
  onAddToCart?: (item: { 
    id: string
    name: string
    price: number
    variant?: string
    customizations?: { name: string; price: number }[]
  }) => void
}

export function MenuItem({ product, tenantId, onAddToCart }: MenuItemProps) {
  const { language } = useLanguage()
  const [variants, setVariants] = useState<Variant[]>([])
  const [customizationGroups, setCustomizationGroups] = useState<CustomizationGroup[]>([])
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [showCustomization, setShowCustomization] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  const supabase = createClient()

  // Load variants and customizations from database
  useEffect(() => {
    const loadProductData = async () => {
      try {
        // Load variants
        const { data: variantsData } = await supabase
          .from("product_variants")
          .select("*")
          .eq("product_id", product.id)
          .eq("tenant_id", tenantId)
          .order("display_order")

        if (variantsData && variantsData.length > 0) {
          setVariants(variantsData)
          const defaultVariant = variantsData.find(v => v.is_default) || variantsData[0]
          setSelectedVariant(defaultVariant)
        }

        // Load customization groups with options
        const { data: groupsData } = await supabase
          .from("product_customization_groups")
          .select(`
            group_id,
            customization_groups (
              id,
              name,
              name_en,
              is_required,
              customization_options (
                id,
                name,
                name_en,
                price_modifier,
                is_default,
                display_order
              )
            )
          `)
          .eq("product_id", product.id)
          .eq("tenant_id", tenantId)

        if (groupsData && groupsData.length > 0) {
          const groups = groupsData
            .map((item: any) => ({
              ...item.customization_groups,
              options: (item.customization_groups.customization_options || [])
                .sort((a: any, b: any) => a.display_order - b.display_order)
            }))
            .filter((group: any) => group.options && group.options.length > 0)

          setCustomizationGroups(groups)

          // Set default options
          const defaults: Record<string, string> = {}
          groups.forEach((group: CustomizationGroup) => {
            const defaultOption = group.options.find(opt => opt.is_default)
            if (defaultOption) {
              defaults[group.id] = defaultOption.id
            } else if (group.options.length > 0) {
              defaults[group.id] = group.options[0].id
            }
          })
          setSelectedOptions(defaults)
        }
      } catch (error) {
        console.error("Error loading product data:", error)
      }
    }

    loadProductData()
  }, [product.id, tenantId, supabase])

  const name = language === "en" && product.name_en ? product.name_en : product.name
  const description = language === "en" && product.description_en ? product.description_en : product.description

  const getCurrentPrice = () => {
    let basePrice = product.price
    
    // Add variant price modifier
    if (selectedVariant) {
      basePrice += selectedVariant.price_modifier
    }
    
    // Add customization prices
    customizationGroups.forEach(group => {
      const optionId = selectedOptions[group.id]
      if (optionId) {
        const option = group.options.find(opt => opt.id === optionId)
        if (option) {
          basePrice += option.price_modifier
        }
      }
    })
    
    return basePrice
  }

  const handleQuickAdd = () => {
    if (onAddToCart) {
      onAddToCart({
        id: product.id,
        name: product.name,
        price: getCurrentPrice(),
        variant: selectedVariant ? (language === "en" && selectedVariant.name_en ? selectedVariant.name_en : selectedVariant.name) : undefined,
      })
    }
  }

  const handleCustomizedAdd = () => {
    if (onAddToCart) {
      const customizations: { name: string; price: number }[] = []
      
      customizationGroups.forEach(group => {
        const optionId = selectedOptions[group.id]
        if (optionId) {
          const option = group.options.find(opt => opt.id === optionId)
          if (option && option.price_modifier > 0) {
            customizations.push({ 
              name: language === "en" && option.name_en ? option.name_en : option.name, 
              price: option.price_modifier 
            })
          }
        }
      })

      onAddToCart({
        id: product.id,
        name: product.name,
        price: getCurrentPrice(),
        variant: selectedVariant ? (language === "en" && selectedVariant.name_en ? selectedVariant.name_en : selectedVariant.name) : undefined,
        customizations: customizations.length > 0 ? customizations : undefined,
      })
    }
    setShowCustomization(false)
  }

  // Show modal only if there are customization options or variants
  const hasCustomizations = customizationGroups.length > 0 || variants.length > 0

  // Handle add button click - open modal if has customizations, otherwise add directly
  const handleAddClick = () => {
    if (hasCustomizations) {
      setShowCustomization(true)
    } else {
      handleQuickAdd()
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow w-full">
        <div className="flex items-center gap-4">
          {/* Product Image - Smaller with badge overlay */}
          {product.image && (
            <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={name}
                className="w-full h-full object-cover"
              />
              {/* Badge on image */}
              {product.badge && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-orange-500 to-orange-600 px-1.5 py-0.5">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wide block text-center leading-tight">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Product Info - More space for name */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base truncate mb-0.5">{name}</h3>
            
            {description && (
              <p className="text-xs text-gray-500 line-clamp-1 mb-1">{description}</p>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500">
              {variants.length > 0 && (
                <span>
                  {variants.length} {language === "en" ? "sizes" : "boyut"}
                </span>
              )}
              {customizationGroups.length > 0 && (
                <span>
                  • {customizationGroups.length} {language === "en" ? "options" : "seçenek"}
                </span>
              )}
            </div>
          </div>

          {/* Price & Add Button */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Price */}
            <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
              {getCurrentPrice().toFixed(2)}₺
            </span>

            {/* Add Button - Opens modal if has customizations */}
            <button
              onClick={handleAddClick}
              className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center"
              aria-label={language === "en" ? "Add to Cart" : "Sepete Ekle"}
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
            </button>
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
              {/* Variant Selection */}
              {variants.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {language === "en" ? "Select Size" : "Boyut Seçin"}
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          selectedVariant?.id === variant.id
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-semibold text-gray-900">
                          {language === "en" && variant.name_en ? variant.name_en : variant.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {(product.price + variant.price_modifier).toFixed(2)}₺
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Customization Groups */}
              {customizationGroups.map((group) => (
                <div key={group.id}>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {language === "en" && group.name_en ? group.name_en : group.name}
                    {group.is_required && <span className="text-orange-600 ml-1">*</span>}
                  </h4>
                  <div className="space-y-2">
                    {group.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedOptions({ ...selectedOptions, [group.id]: option.id })}
                        className={`w-full p-3 rounded-lg border-2 flex items-center justify-between transition-all ${
                          selectedOptions[group.id] === option.id
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="font-medium text-gray-900">
                          {language === "en" && option.name_en ? option.name_en : option.name}
                        </span>
                        <span className="text-sm font-semibold text-gray-600">
                          {option.price_modifier > 0 
                            ? `+${option.price_modifier.toFixed(2)}₺` 
                            : option.price_modifier < 0
                            ? `${option.price_modifier.toFixed(2)}₺`
                            : (language === "en" ? "Free" : "Ücretsiz")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={handleCustomizedAdd}
                className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-6 h-6" strokeWidth={2.5} />
                <span>
                  {language === "en" ? "Add to Cart" : "Sepete Ekle"} ({getCurrentPrice().toFixed(2)}₺)
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
