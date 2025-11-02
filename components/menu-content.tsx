"use client"

import { useState } from "react"
import { ProductCard } from "./product-card"
import { SearchBar } from "./search-bar"

const PRODUCTS = {
  appetizers: [
    { id: "1", name: "Hummus", description: "Nohut püresi, zeytinyağı, limon", price: 45, badge: "Popüler" },
    { id: "2", name: "Falafel Tabağı", description: "Kızarmış nohut köfte, soslar", price: 55, badge: "Vegan" },
    { id: "3", name: "Çoban Salatası", description: "Taze sebzeler, zeytinyağı, limon", price: 50, badge: null },
  ],
  mains: [
    {
      id: "4",
      name: "Grilled Salmon",
      description: "Izgara somon, sebzeler, limoni soslu",
      price: 120,
      badge: "Popüler",
    },
    { id: "5", name: "Tavuk Şiş", description: "Baharat tavuk, pide ekmek, salata", price: 85, badge: "Yeni" },
    { id: "6", name: "Köfte Tabağı", description: "İçli köfte, mevsim sebzeleri, yoğurt", price: 75, badge: null },
  ],
  seafood: [
    {
      id: "7",
      name: "Calamari Frito",
      description: "Kızarmış mürekkep balığı, tarator soslu",
      price: 95,
      badge: "Popüler",
    },
    { id: "8", name: "Levrek Buğulama", description: "Buharlanmış levrek, sebzeler, soslar", price: 130, badge: null },
    {
      id: "9",
      name: "Karides Salatası",
      description: "Taze karides, yeşil salatalar, limon saftı",
      price: 110,
      badge: "Yeni",
    },
  ],
  desserts: [
    { id: "10", name: "Baklava", description: "Fistikli baklava, bal şerbeti", price: 35, badge: "Popüler" },
    { id: "11", name: "Cheesecake", description: "Klasik cheesecake, çilek sosu", price: 40, badge: null },
    { id: "12", name: "Chocolate Mousse", description: "Çikolata mousse, çilek dekorasyonu", price: 38, badge: null },
  ],
}

interface MenuContentProps {
  selectedCategory: string
  onAddToCart: (product: { id: string; name: string; price: number }, quantity: number) => void
}

export function MenuContent({ selectedCategory, onAddToCart }: MenuContentProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const products = PRODUCTS[selectedCategory as keyof typeof PRODUCTS] || []
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
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
