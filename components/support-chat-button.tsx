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
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 text-white rounded-full p-4 shadow-2xl shadow-blue-500/50 hover:shadow-blue-600/60 transition-all duration-300 active:scale-95 group"
      aria-label={isOpen ? "Sohbeti Kapat" : "Destek Sohbeti"}
    >
      {/* 7/24 Online Badge */}
      {!isOpen && (
        <span className="absolute -top-2 -right-2 flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-100"></span>
          </span>
          7/24
        </span>
      )}
      
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
      )}
    </button>
  )
}
