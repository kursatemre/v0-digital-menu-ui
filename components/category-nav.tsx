"use client"

const CATEGORIES = [
  { id: "appetizers", label: "Başlangıçlar" },
  { id: "mains", label: "Ana Yemekler" },
  { id: "seafood", label: "Deniz Ürünleri" },
  { id: "desserts", label: "Tatlılar" },
]

interface CategoryNavProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function CategoryNav({ selectedCategory, onSelectCategory }: CategoryNavProps) {
  return (
    <div className="bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-6xl mx-auto">
        <div className="flex overflow-x-auto px-4 gap-2 py-4 no-scrollbar">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
