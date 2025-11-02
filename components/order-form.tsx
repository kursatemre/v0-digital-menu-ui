"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface OrderFormProps {
  onClose: () => void
  onSubmit: (data: {
    tableNumber: string
    name: string
    notes: string
    phoneNumber: string
    isDelivery: boolean
  }) => void
  total: number
}

export function OrderForm({ onClose, onSubmit, total }: OrderFormProps) {
  const [tableNumber, setTableNumber] = useState("")
  const [name, setName] = useState("")
  const [notes, setNotes] = useState("")
  const [isDelivery, setIsDelivery] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit({ tableNumber, name, notes, phoneNumber, isDelivery })
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

            {/* Name */}
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

            {/* Notes */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Özel Not (İsteğe bağlı)</label>
              <Textarea
                placeholder="Örn: Acısız hazırla, az tuz vb..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-24"
              />
            </div>

            {/* Total Display */}
            <div className="bg-muted rounded-lg p-4 border border-border">
              <div className="flex justify-between items-center">
                <span className="text-foreground font-bold">Toplam Tutar:</span>
                <span className="text-2xl font-bold text-primary">₺{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-base font-bold"
            >
              Siparişi Onayla ve Gönder
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
