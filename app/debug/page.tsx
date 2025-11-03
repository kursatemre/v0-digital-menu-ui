"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export default function DebugPage() {
  const [supabaseStatus, setSupabaseStatus] = useState("checking")
  const [tableExists, setTableExists] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [error, setError] = useState("")
  const [envVars, setEnvVars] = useState({
    hasUrl: false,
    hasKey: false,
  })

  useEffect(() => {
    checkEverything()
  }, [])

  const checkEverything = async () => {
    const supabase = createClient()

    // Check environment variables
    setEnvVars({
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })

    try {
      // Test Supabase connection by checking settings table
      const { data: settingsData, error: settingsError } = await supabase
        .from("settings")
        .select("*")
        .limit(1)

      if (settingsError) {
        setSupabaseStatus("error")
        setError(`Supabase bağlantı hatası: ${settingsError.message}`)
        return
      }

      setSupabaseStatus("connected")

      // Check if admin_users table exists
      const { data: usersData, error: usersError } = await supabase.from("admin_users").select("*")

      if (usersError) {
        setTableExists(false)
        setError(`admin_users tablosu bulunamadı: ${usersError.message}`)
      } else {
        setTableExists(true)
        setUsers(usersData || [])
      }
    } catch (err: any) {
      setSupabaseStatus("error")
      setError(`Hata: ${err.message}`)
    }
  }

  const createDefaultUser = async () => {
    const supabase = createClient()
    try {
      const { data, error } = await supabase.from("admin_users").insert([
        {
          username: "admin",
          password_hash: "admin123",
          display_name: "Administrator",
        },
      ])

      if (error) {
        alert(`Kullanıcı oluşturulamadı: ${error.message}`)
      } else {
        alert("✅ Varsayılan admin kullanıcısı oluşturuldu!")
        checkEverything()
      }
    } catch (err: any) {
      alert(`Hata: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-2xl mx-auto space-y-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">🔍 Admin Panel Debug</CardTitle>
            <CardDescription>Sorunları tespit edin ve çözün</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Environment Variables */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">📋 Environment Variables</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  {envVars.hasUrl ? "✅" : "❌"}
                  <span>NEXT_PUBLIC_SUPABASE_URL</span>
                </div>
                <div className="flex items-center gap-2">
                  {envVars.hasKey ? "✅" : "❌"}
                  <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                </div>
              </div>
            </div>

            {/* Supabase Connection */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">🔌 Supabase Bağlantısı</h3>
              <div className="text-sm">
                {supabaseStatus === "checking" && <p>⏳ Kontrol ediliyor...</p>}
                {supabaseStatus === "connected" && <p className="text-green-600">✅ Bağlantı başarılı</p>}
                {supabaseStatus === "error" && <p className="text-red-600">❌ Bağlantı hatası</p>}
              </div>
            </div>

            {/* Admin Users Table */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">📊 admin_users Tablosu</h3>
              <div className="text-sm space-y-2">
                {tableExists ? (
                  <>
                    <p className="text-green-600">✅ Tablo mevcut</p>
                    <p className="font-medium">Kayıtlı Kullanıcılar: {users.length}</p>
                    {users.length > 0 ? (
                      <div className="bg-muted p-3 rounded mt-2">
                        {users.map((user) => (
                          <div key={user.id} className="mb-2">
                            <p className="font-mono text-xs">
                              👤 {user.username} ({user.display_name})
                            </p>
                            <p className="font-mono text-xs text-muted-foreground">
                              Şifre: {user.password_hash}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded mt-2">
                        <p className="font-semibold">⚠️ Tablo boş!</p>
                        <p className="text-xs mt-1">Hiç kullanıcı yok. Varsayılan kullanıcı oluşturun.</p>
                        <Button onClick={createDefaultUser} className="mt-2" size="sm">
                          👤 Varsayılan Admin Oluştur
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-red-600">
                    <p>❌ Tablo bulunamadı!</p>
                    <div className="bg-red-50 border border-red-200 p-3 rounded mt-2">
                      <p className="font-semibold text-sm">Çözüm:</p>
                      <p className="text-xs mt-1">
                        Supabase Dashboard'da SQL Editor'ü açın ve şu scripti çalıştırın:
                      </p>
                      <pre className="text-xs bg-black text-white p-2 rounded mt-2 overflow-auto">
                        {`CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
                <p className="font-semibold">❌ Hata:</p>
                <p className="text-sm mt-1 font-mono">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button onClick={checkEverything} variant="outline" className="flex-1">
                🔄 Yeniden Kontrol Et
              </Button>
              <Button onClick={() => (window.location.href = "/admin")} className="flex-1">
                🔐 Admin Panele Git
              </Button>
            </div>

            <div className="border-t pt-4">
              <a href="/" className="text-sm text-primary hover:underline">
                ← Ana Sayfaya Dön
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Quick SQL Scripts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📝 Hızlı SQL Script'leri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-semibold mb-1">1. Tablo Oluştur:</p>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                {`CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON admin_users FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON admin_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON admin_users FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON admin_users FOR DELETE USING (true);`}
              </pre>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">2. Varsayılan Admin Ekle:</p>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                {`INSERT INTO admin_users (username, password_hash, display_name)
VALUES ('admin', 'admin123', 'Administrator')
ON CONFLICT (username) DO NOTHING;`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
