"use client"

import React, { ChangeEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface PlatformTabProps {
  platformSettings: {
    logo: string
    favicon: string
    site_title: string
    site_description: string
    meta_keywords: string[]
    google_verification: string
  }
  uploadingImage: boolean
  setPlatformSettings: (settings: any) => void
  uploadPlatformImage: (file: File, type: "logo" | "favicon") => Promise<string | null>
  savePlatformSettings: () => Promise<void>
}

export function PlatformTab({
  platformSettings,
  uploadingImage,
  setPlatformSettings,
  uploadPlatformImage,
  savePlatformSettings
}: PlatformTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Ayarları</CardTitle>
          <CardDescription>SEO, logo ve favicon ayarlarını yönetin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Site Başlığı</label>
                <Input
                  value={platformSettings.site_title}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, site_title: e.target.value })}
                  placeholder="MenuMGO - Dijital Menü Çözümü"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Site Açıklaması</label>
                <Textarea
                  value={platformSettings.site_description}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, site_description: e.target.value })}
                  placeholder="MenuMGO ile dijital menünüzü oluşturun..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Meta Anahtar Kelimeler</label>
                <Input
                  value={platformSettings.meta_keywords.join(", ")}
                  onChange={(e) => setPlatformSettings({ 
                    ...platformSettings, 
                    meta_keywords: e.target.value.split(",").map(k => k.trim()) 
                  })}
                  placeholder="dijital menü, qr menü, restoran menüsü"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Google Site Doğrulama Kodu</label>
                <Input
                  value={platformSettings.google_verification}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, google_verification: e.target.value })}
                  placeholder="Google Search Console doğrulama kodu"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Platform Logo</label>
                <div className="flex items-center gap-4">
                  {platformSettings.logo && (
                    <div className="relative w-20 h-20">
                      <img 
                        src={platformSettings.logo} 
                        alt="Platform Logo"
                        className="w-full h-full object-contain"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2"
                        onClick={() => setPlatformSettings({ ...platformSettings, logo: "" })}
                      >
                        <span className="sr-only">Sil</span>
                        <span>×</span>
                      </Button>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const imageUrl = await uploadPlatformImage(file, "logo")
                          if (imageUrl) {
                            setPlatformSettings({ ...platformSettings, logo: imageUrl })
                          }
                        }
                      }}
                      className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Favicon</label>
                <div className="flex items-center gap-4">
                  {platformSettings.favicon && (
                    <div className="relative w-12 h-12">
                      <img 
                        src={platformSettings.favicon} 
                        alt="Favicon"
                        className="w-full h-full object-contain"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2"
                        onClick={() => setPlatformSettings({ ...platformSettings, favicon: "" })}
                      >
                        <span className="sr-only">Sil</span>
                        <span>×</span>
                      </Button>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/x-icon,image/png"
                      onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const imageUrl = await uploadPlatformImage(file, "favicon")
                          if (imageUrl) {
                            setPlatformSettings({ ...platformSettings, favicon: imageUrl })
                          }
                        }
                      }}
                      className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG formatında, 32x32 veya 16x16 piksel boyutunda önerilir
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={savePlatformSettings} disabled={uploadingImage}>
          {uploadingImage ? "Yükleniyor..." : "Ayarları Kaydet"}
        </Button>
      </div>
    </div>
  )
}