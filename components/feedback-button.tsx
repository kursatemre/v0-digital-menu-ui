"use client"

import { MessageSquare } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageAwareText } from "./language-aware-text"

interface FeedbackButtonProps {
  onClick: () => void
  className?: string
}

export function FeedbackButton({ onClick, className = "" }: FeedbackButtonProps) {
  const { language } = useLanguage()

  return (
    <button
      onClick={onClick}
      className={`w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 border border-primary/30 ${className}`}
      aria-label={language === "tr" ? "Geri Bildirim Gönder" : "Send Feedback"}
    >
      <MessageSquare className="w-5 h-5" />
      <span>
        <LanguageAwareText tr="Yorum, Öneri veya Şikayet Bildir" en="Send Feedback or Complaint" />
      </span>
    </button>
  )
}
