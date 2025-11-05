"use client"

import { useState } from "react"
import { ProductCard } from "./product-card"
import { SearchBar } from "./search-bar"
import { useLanguage } from "@/contexts/language-context"

interface Product {
  id: string
  name: string
  name_en: string
  description: string
  description_en: string
  price: number
  badge: string | null
}

const PRODUCTS: Record<string, Product[]> = {
  appetizers: [
    { 
      id: "1", 
      name: "Humus", 
      name_en: "Hummus",
      description: "Nohut püresi, zeytinyağı, limon", 
      description_en: "Chickpea puree, olive oil, lemon",
      price: 45, 
      badge: "Popüler" 
    },
    { 
      id: "2", 
      name: "Falafel Tabağı", 
      name_en: "Falafel Plate",
      description: "Kızarmış nohut köfte, soslar", 
      description_en: "Fried chickpea balls with sauces",
      price: 55, 
      badge: "Vegan" 
    },
    { 
      id: "3", 
      name: "Çoban Salatası", 
      name_en: "Shepherd's Salad",
      description: "Taze sebzeler, zeytinyağı, limon", 
      description_en: "Fresh vegetables, olive oil, lemon",
      price: 50, 
      badge: null 
    },
  ],
  mains: [
    {
      id: "4",
      name: "Somon Izgara",
      name_en: "Grilled Salmon",
      description: "Izgara somon, sebzeler, limon soslu",
      description_en: "Grilled salmon, vegetables, lemon sauce",
      price: 120,
      badge: "Popüler",
    },
    { 
      id: "5", 
      name: "Tavuk Şiş", 
      name_en: "Chicken Skewer",
      description: "Baharat tavuk, pide ekmek, salata", 
      description_en: "Spiced chicken, pita bread, salad",
      price: 85, 
      badge: "Yeni" 
    },
    { 
      id: "6", 
      name: "Köfte Tabağı", 
      name_en: "Meatball Plate",
      description: "İçli köfte, mevsim sebzeleri, yoğurt", 
      description_en: "Stuffed meatballs, seasonal vegetables, yogurt",
      price: 75, 
      badge: null 
    },
  ],
  seafood: [
    {
      id: "7",
      name: "Kalamar Tava",
      name_en: "Calamari Frito",
      description: "Kızarmış mürekkep balığı, tarator soslu",
      description_en: "Fried squid with tahini sauce",
      price: 95,
      badge: "Popüler",
    },
    { 
      id: "8", 
      name: "Levrek Buğulama", 
      name_en: "Steamed Sea Bass",
      description: "Buharlanmış levrek, sebzeler, soslar", 
      description_en: "Steamed sea bass, vegetables, sauces",
      price: 130, 
      badge: null 
    },
    {
      id: "9",
      name: "Karides Salatası",
      name_en: "Shrimp Salad",
      description: "Taze karides, yeşil salatalar, limon suyu",
      description_en: "Fresh shrimp, green salads, lemon juice",
      price: 110,
      badge: "Yeni",
    },
  ],
  desserts: [
    { 
      id: "10", 
      name: "Baklava", 
      name_en: "Baklava",
      description: "Fıstıklı baklava, bal şerbeti", 
      description_en: "Pistachio baklava, honey syrup",
      price: 35, 
      badge: "Popüler" 
    },
    { 
      id: "11", 
      name: "Cheesecake", 
      name_en: "Cheesecake",
      description: "Klasik cheesecake, çilek sosu", 
      description_en: "Classic cheesecake, strawberry sauce",
      price: 40, 
      badge: null 
    },
    { 
      id: "12", 
      name: "Çikolatalı Mus", 
      name_en: "Chocolate Mousse",
      description: "Çikolata mousse, çilek dekorasyonu", 
      description_en: "Chocolate mousse, strawberry decoration",
      price: 38, 
      badge: null 
    },
  ],
}

  interface MenuContentProps {
  selectedCategory: string
  onAddToCart: (product: { id: string; name: string; price: number }, quantity: number) => void
}

export function MenuContent({ selectedCategory, onAddToCart }: MenuContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { language } = useLanguage()

  const products = PRODUCTS[selectedCategory as keyof typeof PRODUCTS] || []
  const filteredProducts = products.filter(
    (p) => {
      const searchIn = language === "tr" ? 
        `${p.name} ${p.description}` : 
        `${p.name_en} ${p.description_en}`
      return searchIn.toLowerCase().includes(searchQuery.toLowerCase())
    }
  )  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Arama sonucunda ürün bulunamadı.</p>
        </div>
      )}
    </div>
  )
}
