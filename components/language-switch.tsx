"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Globe } from "lucide-react"

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
      className="flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-primary/20 hover:border-primary/40 transition-all"
    >
      <Globe className="w-4 h-4" />
      <span className="font-semibold">{language === "tr" ? "EN" : "TR"}</span>
    </Button>
  )
}