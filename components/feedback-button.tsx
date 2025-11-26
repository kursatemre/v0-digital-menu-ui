"use client"

import { MessageSquare } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageAwareText } from "./language-aware-text"

interface FeedbackButtonProps {
  onClick: () => void
}

export function FeedbackButton({ onClick }: FeedbackButtonProps) {
  const { language } = useLanguage()

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-3 px-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 active:scale-95 border border-primary/30"
      aria-label={language === "tr" ? "Geri Bildirim Gönder" : "Send Feedback"}
    >
      <MessageSquare className="w-5 h-5" />
      <span className="hidden sm:inline">
        <LanguageAwareText tr="Geri Bildirim" en="Feedback" />
      </span>
    </button>
  )
}
