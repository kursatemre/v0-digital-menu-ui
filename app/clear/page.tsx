"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ClearPage() {
  const [cleared, setCleared] = useState(false)
  const [items, setItems] = useState<string[]>([])

  const showLocalStorageItems = () => {
    const allItems: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        allItems.push(key)
      }
    }
    setItems(allItems)
  }

  const clearLocalStorage = () => {
    localStorage.clear()
    setCleared(true)
    setItems([])
    setTimeout(() => {
      window.location.href = "/"
    }, 2000)
  }

  const clearAdminOnly = () => {
    localStorage.removeItem("admin_logged_in")
    localStorage.removeItem("admin_user_id")
    setCleared(true)
    setTimeout(() => {
      window.location.href = "/admin"
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">🧹 Önbellek Temizleme</CardTitle>
          <CardDescription>LocalStorage verilerini yönetin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cleared ? (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center">
              ✅ Temizlendi! Yönlendiriliyorsunuz...
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Button onClick={showLocalStorageItems} variant="outline" className="w-full">
                  📋 Kayıtlı Verileri Göster
                </Button>

                {items.length > 0 && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Kayıtlı Veriler ({items.length}):</p>
                    <ul className="text-xs space-y-1">
                      {items.map((item) => (
                        <li key={item} className="font-mono">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 space-y-2">
                <Button onClick={clearAdminOnly} variant="default" className="w-full">
                  🔑 Sadece Admin Oturumunu Temizle
                </Button>

                <Button onClick={clearLocalStorage} variant="destructive" className="w-full">
                  🗑️ TÜM Verileri Temizle
                </Button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded-lg text-xs">
                <strong>⚠️ Uyarı:</strong> "TÜM Verileri Temizle" seçeneği favori ürünler, tema
                ayarları gibi tüm yerel verileri siler.
              </div>
            </>
          )}

          <div className="border-t pt-4">
            <a href="/" className="text-sm text-primary hover:underline">
              ← Ana Sayfaya Dön
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
