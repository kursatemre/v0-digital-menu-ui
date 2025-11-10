"use client"

import { useLanguage } from "@/contexts/language-context"

interface LanguageAwareTextProps {
  tr: string
  en: string
}

export function LanguageAwareText({ tr, en }: LanguageAwareTextProps) {
  const { language } = useLanguage()
  return <>{language === "tr" ? tr : en}</>
}