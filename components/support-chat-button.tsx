"use client"

import { MessageCircle, X } from "lucide-react"
import { useState } from "react"

interface SupportChatButtonProps {
  onClick: () => void
  isOpen: boolean
}

export function SupportChatButton({ onClick, isOpen }: SupportChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
      aria-label={isOpen ? "Sohbeti Kapat" : "Destek Sohbeti"}
    >
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <MessageCircle className="w-6 h-6" />
      )}
    </button>
  )
}
