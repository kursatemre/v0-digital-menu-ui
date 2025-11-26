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
      <h2 className="text-2xl font-bold text-gray-900 tracking-wide uppercase border-b pb-2 border-gray-200">
        {displayName}
      </h2>
    </div>
  )
}
