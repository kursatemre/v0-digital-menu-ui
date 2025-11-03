"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"

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
      if (!phoneNumber.trim()) newErrors.phoneNumber = "Telefon numarası gerekli"
    } else {
      if (!tableNumber.trim()) newErrors.tableNumber = "Masa numarası gerekli"
    }
    if (!name.trim()) newErrors.name = "İsim gerekli"
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
          <h2 className="text-3xl font-bold text-green-700">Başarılı! 🎉</h2>
          <p className="text-foreground text-lg leading-relaxed">{successMessage}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p>Sipariş mutfağa iletildi</p>
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
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">Sipariş Bilgileri</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Formu doldurun</p>
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
                <span className="text-sm font-medium">🏠 Restoran İçinde</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isDelivery}
                  onChange={() => setIsDelivery(true)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">📞 Ön Sipariş</span>
              </label>
            </div>
            <p className="text-xs text-foreground/80">
              💡 Ödeme adımı atlanmıştır. Siparişiniz doğrudan mutfağa iletilecektir.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isDelivery ? (
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  📱 Telefon Numarası <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="5551234567"
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
                  🪑 Masa Numarası <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="5"
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
                👤 İsim Soyisim <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Adınız ve soyadınız"
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
              <label className="block text-sm font-bold text-foreground mb-2">📝 Özel Not (İsteğe bağlı)</label>
              <Textarea
                placeholder="Örn: Acısız hazırla, az tuz vb..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-24"
              />
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-foreground font-bold">💰 Toplam Tutar:</span>
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
              className="w-full bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary/80 py-3 sm:py-4 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all active:scale-98 rounded-xl"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Gönderiliyor...
                </>
              ) : (
                <>✅ Siparişi Onayla ve Gönder</>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
