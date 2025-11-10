"use client"

import { ArrowUp } from "lucide-react"
import { useState, useEffect } from "react"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-50 bg-white/90 backdrop-blur-xl hover:bg-white text-blue-600 rounded-full p-3 shadow-2xl shadow-blue-500/20 hover:shadow-blue-600/30 border-2 border-blue-200/50 hover:border-blue-400/70 transition-all duration-300 hover:scale-110 active:scale-95 group"
          aria-label="Yukarı Çık"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </>
  )
}
