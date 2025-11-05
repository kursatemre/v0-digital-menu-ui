"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Globe } from "lucide-react"

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
      className="fixed top-4 right-20 z-50"
    >
      <Globe className="w-4 h-4 mr-2" />
      {language.toUpperCase()}
    </Button>
  )
}