"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/contexts/language-context"
import { LanguageAwareText } from "./language-aware-text"

interface OrderFormProps {
  onClose: () => void
  onSubmit?: (data: any) => void
  total: number
  items: Array<{ id: string; name: string; price: number; quantity: number }>
  onSuccess?: (message: string) => void
  onClearCart?: () => void
  tenantId?: string
}

export function OrderForm({ onClose, total, items, onSuccess, onClearCart, tenantId }: OrderFormProps) {
  const { language } = useLanguage()
  const [tableNumber, setTableNumber] = useState("")
  const [name, setName] = useState("")
  const [notes, setNotes] = useState("")
  const [isDelivery, setIsDelivery] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const supabase = createClient()

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (isDelivery) {
      if (!phoneNumber.trim()) newErrors.phoneNumber = language === "tr" ? "Telefon numarası gerekli" : "Phone number is required"
    } else {
      if (!tableNumber.trim()) newErrors.tableNumber = language === "tr" ? "Masa numarası gerekli" : "Table number is required"
    }
    if (!name.trim()) newErrors.name = language === "tr" ? "İsim gerekli" : "Name is required"
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      const orderItems = items && items.length > 0 ? items : []
      console.log("[v0] Submitting order with items:", orderItems)

      const { error } = await supabase.from("orders").insert({
        table_number: isDelivery ? null : tableNumber,
        customer_name: name,
        phone_number: isDelivery ? phoneNumber : null,
        is_delivery: isDelivery,
        items: orderItems,
        notes: notes || null,
        total: total,
        status: "pending",
        tenant_id: tenantId,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("[v0] Error saving order:", error)
        setErrors({ submit: "Sipariş kaydedilemedi. Lütfen tekrar deneyin." })
      } else {
        console.log("[v0] Order saved successfully!")
        const successMsg = isDelivery
          ? `Ön siparişiniz başarıyla alındı! Telefon numarası: ${phoneNumber}`
          : `Siparişiniz başarıyla gönderildi! Masa: ${tableNumber}`
        setSuccessMessage(successMsg)
        if (onSuccess) onSuccess(successMsg)
        if (onClearCart) onClearCart()

        setTimeout(() => {
          setSuccessMessage("")
          onClose()
        }, 2500)
      }
    } catch (err) {
      console.error("[v0] Unexpected error:", err)
      setErrors({ submit: "Bir hata oluştu. Lütfen tekrar deneyin." })
    } finally {
      setIsLoading(false)
    }
  }

  if (successMessage) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center space-y-4 border-2 border-green-200 animate-in zoom-in duration-300">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-green-700">
            <LanguageAwareText tr="Başarılı! 🎉" en="Success! 🎉" />
          </h2>
          <p className="text-foreground text-lg leading-relaxed">{successMessage}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p><LanguageAwareText tr="Sipariş mutfağa iletildi" en="Order sent to kitchen" /></p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-primary/20">
        {/* Header */}
        <div className="border-b border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10 p-4 sm:p-5 flex items-center justify-between sticky top-0 rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">
              <LanguageAwareText tr="Sipariş Bilgileri" en="Order Details" />
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              <LanguageAwareText tr="Formu doldurun" en="Fill out the form" />
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-all active:scale-95"
            aria-label="Kapat"
          >
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Delivery/Dine-in toggle */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-4">
            <div className="flex gap-3 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!isDelivery}
                  onChange={() => setIsDelivery(false)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">
                  🏠 <LanguageAwareText tr="Restoran İçinde" en="Dine-In" />
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isDelivery}
                  onChange={() => setIsDelivery(true)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">
                  📞 <LanguageAwareText tr="Ön Sipariş" en="Pre-Order" />
                </span>
              </label>
            </div>
            <p className="text-xs text-foreground/80">
              💡 <LanguageAwareText tr="Ödeme adımı atlanmıştır. Siparişiniz doğrudan mutfağa iletilecektir." en="Payment step is skipped. Your order will be sent directly to the kitchen." />
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isDelivery ? (
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  📱 <LanguageAwareText tr="Telefon Numarası" en="Phone Number" /> <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={language === 'tr' ? '5551234567' : '555 123 4567'}
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value)
                    if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: "" })
                  }}
                  className="w-full text-lg"
                />
                {errors.phoneNumber && <p className="text-red-600 text-sm mt-1">⚠️ {errors.phoneNumber}</p>}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  🪑 <LanguageAwareText tr="Masa Numarası" en="Table Number" /> <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder={language === 'tr' ? 'A5, 12, Bahçe-3...' : 'A5, 12, Garden-3...'}
                  value={tableNumber}
                  onChange={(e) => {
                    setTableNumber(e.target.value)
                    if (errors.tableNumber) setErrors({ ...errors, tableNumber: "" })
                  }}
                  className="w-full text-lg"
                />
                {errors.tableNumber && <p className="text-red-600 text-sm mt-1">⚠️ {errors.tableNumber}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                👤 <LanguageAwareText tr="İsim Soyisim" en="Full Name" /> <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder={language === 'tr' ? 'Adınız ve soyadınız' : 'Your full name'}
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors({ ...errors, name: "" })
                }}
                className="w-full"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">⚠️ {errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                📝 <LanguageAwareText tr="Özel Not (İsteğe bağlı)" en="Special Note (Optional)" />
              </label>
              <Textarea
                placeholder={language === 'tr' ? 'Örn: Acısız hazırla, az tuz vb...' : 'e.g., No spice, less salt, etc...'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-24"
              />
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-foreground font-bold">
                  💰 <LanguageAwareText tr="Toplam Tutar:" en="Total Amount:" />
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-primary">₺{total.toFixed(2)}</span>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                ⚠️ {errors.submit}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary/80 py-5 sm:py-7 text-lg sm:text-xl font-bold shadow-2xl hover:shadow-xl transition-all active:scale-98 rounded-xl min-h-[60px] sm:min-h-[70px]"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <LanguageAwareText tr="Gönderiliyor..." en="Sending..." />
                </>
              ) : (
                <>✅ <LanguageAwareText tr="Siparişi Onayla ve Gönder" en="Confirm and Send Order" /></>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
