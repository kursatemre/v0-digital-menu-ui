"use client"

import { useLanguage } from "@/contexts/language-context"

interface CategoryHeaderProps {
  name: string
  nameEn?: string
}

export function CategoryHeader({ name, nameEn }: CategoryHeaderProps) {
  const { language } = useLanguage()
  const displayName = language === "en" && nameEn ? nameEn : name

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"></div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">
          {displayName}
        </h2>
        <div className="h-1 flex-1 bg-gradient-to-r from-orange-400 to-transparent rounded-full"></div>
      </div>
    </div>
  )
}
