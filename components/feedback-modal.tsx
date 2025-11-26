"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { LanguageAwareText } from "./language-aware-text"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  tenantId: string
  onSuccess?: (message: string) => void
}

export function FeedbackModal({ isOpen, onClose, tenantId, onSuccess }: FeedbackModalProps) {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone: "",
    feedback_type: "comment" as "comment" | "suggestion" | "complaint",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.message.trim()) {
      setError(language === "tr" ? "Lütfen mesajınızı yazın" : "Please write your message")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenant_id: tenantId,
          ...formData
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback")
      }

      // Success
      const successMessage = language === "tr"
        ? "Geri bildiriminiz başarıyla gönderildi. Teşekkür ederiz!"
        : "Your feedback has been submitted successfully. Thank you!"

      if (onSuccess) {
        onSuccess(successMessage)
      }

      // Reset form
      setFormData({
        customer_name: "",
        email: "",
        phone: "",
        feedback_type: "comment",
        message: ""
      })

      onClose()
    } catch (err) {
      console.error("Error submitting feedback:", err)
      setError(
        language === "tr"
          ? "Geri bildirim gönderilirken bir hata oluştu. Lütfen tekrar deneyin."
          : "An error occurred while submitting feedback. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b-2 border-secondary/20 bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent p-5 sm:p-6 flex items-center justify-between rounded-t-2xl sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-1">
              <LanguageAwareText tr="Geri Bildirim" en="Feedback" />
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              <LanguageAwareText
                tr="Yorumlarınızı, önerilerinizi veya şikayetlerinizi bizimle paylaşın"
                en="Share your comments, suggestions, or complaints with us"
              />
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary/10 rounded-full transition-all duration-200 active:scale-95"
            aria-label={language === "tr" ? "Kapat" : "Close"}
          >
            <X size={24} className="text-primary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              📝 <LanguageAwareText tr="Geri Bildirim Türü" en="Feedback Type" /> <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, feedback_type: "comment" })}
                className={`py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  formData.feedback_type === "comment"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <LanguageAwareText tr="Yorum" en="Comment" />
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, feedback_type: "suggestion" })}
                className={`py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  formData.feedback_type === "suggestion"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <LanguageAwareText tr="Öneri" en="Suggestion" />
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, feedback_type: "complaint" })}
                className={`py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  formData.feedback_type === "complaint"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <LanguageAwareText tr="Şikayet" en="Complaint" />
              </button>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              💬 <LanguageAwareText tr="Mesajınız" en="Your Message" /> <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={language === "tr" ? "Mesajınızı buraya yazın..." : "Write your message here..."}
              className="w-full min-h-[120px] p-3 border-2 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              required
            />
          </div>

          {/* Optional Fields */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              👤 <LanguageAwareText tr="İsim (İsteğe bağlı)" en="Name (Optional)" />
            </label>
            <Input
              type="text"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              placeholder={language === "tr" ? "Adınız" : "Your name"}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              📧 <LanguageAwareText tr="E-posta (İsteğe bağlı)" en="Email (Optional)" />
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={language === "tr" ? "ornek@email.com" : "example@email.com"}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              📱 <LanguageAwareText tr="Telefon (İsteğe bağlı)" en="Phone (Optional)" />
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={language === "tr" ? "0555 123 45 67" : "+1 234 567 8900"}
              className="w-full"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary py-4 sm:py-5 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 rounded-xl"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                <LanguageAwareText tr="Gönderiliyor..." en="Sending..." />
              </>
            ) : (
              <LanguageAwareText tr="Gönder" en="Submit" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
