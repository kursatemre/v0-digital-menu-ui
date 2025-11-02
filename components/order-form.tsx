"use client"

import type React from "react"

import { useState } from "react"
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
}

export function OrderForm({ onClose, total, items, onSuccess }: OrderFormProps) {
  const [tableNumber, setTableNumber] = useState("")
  const [name, setName] = useState("")
  const [notes, setNotes] = useState("")
  const [isDelivery, setIsDelivery] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const supabase = createClient()

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

        setTimeout(() => {
          setSuccessMessage("")
          onClose()
        }, 2000)
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
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center space-y-4">
          <div className="flex justify-center mb-4">
            <svg className="w-16 h-16 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600">Sipariş Başarılı!</h2>
          <p className="text-foreground text-lg">{successMessage}</p>
          <p className="text-sm text-muted-foreground">Form kapatılıyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-border p-4 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-primary">Sipariş Formu</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Delivery/Dine-in toggle */}
          <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-4">
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={!isDelivery} onChange={() => setIsDelivery(false)} />
                <span className="text-sm font-medium">Restoran İçinde</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={isDelivery} onChange={() => setIsDelivery(true)} />
                <span className="text-sm font-medium">Dışarıdan Ön Sipariş</span>
              </label>
            </div>
            <p className="text-sm text-foreground">
              <strong>Not:</strong> Ödeme adımı atlanmıştır. Siparişiniz doğrudan mutfağa iletilecek ve sunulacaktır.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isDelivery ? (
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Telefon Numarası *</label>
                <Input
                  type="tel"
                  placeholder="Örn: 5551234567"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value)
                    if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: "" })
                  }}
                  className="w-full"
                />
                {errors.phoneNumber && <p className="text-destructive text-sm mt-1">{errors.phoneNumber}</p>}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Masa Numarası *</label>
                <Input
                  type="number"
                  placeholder="Örn: 5"
                  value={tableNumber}
                  onChange={(e) => {
                    setTableNumber(e.target.value)
                    if (errors.tableNumber) setErrors({ ...errors, tableNumber: "" })
                  }}
                  className="w-full"
                />
                {errors.tableNumber && <p className="text-destructive text-sm mt-1">{errors.tableNumber}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">İsim Soyisim *</label>
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
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Özel Not (İsteğe bağlı)</label>
              <Textarea
                placeholder="Örn: Acısız hazırla, az tuz vb..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-24"
              />
            </div>

            <div className="bg-muted rounded-lg p-4 border border-border">
              <div className="flex justify-between items-center">
                <span className="text-foreground font-bold">Toplam Tutar:</span>
                <span className="text-2xl font-bold text-primary">₺{total.toFixed(2)}</span>
              </div>
            </div>

            {errors.submit && <p className="text-destructive text-sm">{errors.submit}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-base font-bold"
            >
              {isLoading ? "Gönderiliyor..." : "Siparişi Onayla ve Gönder"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
