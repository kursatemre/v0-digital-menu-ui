"use client"

/* @jsxRuntime automatic */
/* @jsxImportSource react */

import { type FormEvent, type ReactNode, type ChangeEvent, useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Edit2,
  Settings,
  ShoppingCart,
  Layers,
  QrCode,
  Users,
  Key,
  Bell,
  Award,
  Zap,
  CreditCard,
  Shield,
  BarChart3,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { QRCodeSVG } from "qrcode.react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface HeaderSettings {
  title: string
  subtitle: string
  backgroundImage?: string
  logo?: string
}

interface BaseCategory {
  id: string
  name: string
  image: string
}

interface BaseProduct {
  id: string
  name: string
  price: number
}

interface OrderItem {
  id: string
  price: number
  quantity: number
}

interface OrderForm {
  items: OrderItem[]
  isDelivery?: boolean
}

type Order = {
  id: string
  table_number: string | null
  customer_name: string
  phone_number: string | null
  is_delivery: boolean
  items: { id: string; name: string; price: number; quantity: number }[]
  notes: string | null
  total: number
  status: "pending" | "preparing" | "ready" | "completed"
  created_at: string
}

type WaiterCall = {
  id: string
  table_number: string
  customer_name: string | null
  status: "pending" | "responded" | "completed"
  created_at: string
  updated_at: string
}

type Product = {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  image: string
  display_order?: number
  badge?: string | null
  is_available?: boolean
  name_en?: string
  description_en?: string
}

type AdminUser = {
  id: string
  username: string
  password_hash: string
  display_name: string | null
  role: "admin" | "garson" | "kasa" | "mutfak"
  created_at: string
}

type Category = {
  id: string
  name: string
  image: string
  display_order?: number
  name_en?: string
  description_en?: string
}

type Theme = {
  primaryColor: string
  primaryTextColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "preparing":
      return "bg-blue-100 text-blue-800"
    case "ready":
      return "bg-green-100 text-green-800"
    case "completed":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <AlertCircle className="w-4 h-4" />
    case "preparing":
      return <Clock className="w-4 h-4" />
    case "ready":
      return <CheckCircle2 className="w-4 h-4" />
    case "completed":
      return <CheckCircle2 className="w-4 h-4" />
    default:
      return null
  }
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "Beklemede",
    preparing: "Hazırlanıyor",
    ready: "Hazır",
    completed: "Tamamlandı",
  }
  return labels[status] || status
}

// Play notification sound (pleasant notification chime)
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    // Create three oscillators for a pleasant chord
    const createTone = (frequency: number, startTime: number, duration: number) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, startTime)
      oscillator.type = 'sine' // Smooth sine wave

      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

      oscillator.start(startTime)
      oscillator.stop(startTime + duration)
    }

    // Pleasant notification chord: C-E-G (major chord)
    const now = audioContext.currentTime
    createTone(523.25, now, 0.4)        // C5
    createTone(659.25, now + 0.05, 0.4) // E5
    createTone(783.99, now + 0.1, 0.5)  // G5

  } catch (error) {
    console.error("Error playing notification sound:", error)
  }
}

export default function AdminPanel() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [tenantId, setTenantId] = useState<string | null>(null)

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const [activeTab, setActiveTab] = useState<
    "orders" | "waiter-calls" | "products" | "categories" | "appearance" | "qr" | "users" | "license" | "reports" | "settings"
  >("orders")
  const [orders, setOrders] = useState<Order[]>([])
  const [waiterCalls, setWaiterCalls] = useState<WaiterCall[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [theme, setTheme] = useState<Theme>({
    primaryColor: "#8B5A3C",
    primaryTextColor: "#FFFFFF",
    secondaryColor: "#C9A961",
    backgroundColor: "#FFFFFF",
    textColor: "#1A1A1A",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [premiumPriceTry, setPremiumPriceTry] = useState<number>(299)

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "preparing" | "ready" | "completed">("all")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [newOrderForm, setNewOrderForm] = useState({
    tableNumber: "",
    customerName: "",
    isDelivery: false,
    phoneNumber: "",
    items: [] as { id: string; name: string; price: number; quantity: number }[],
    notes: "",
  })
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)
  const [reportPeriod, setReportPeriod] = useState<"today" | "week" | "month">("today")

  const [productForm, setProductForm] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    image: "",
    badge: null,
    is_available: true,
    name_en: "",
    description_en: "",
  })

  const [categoryForm, setCategoryForm] = useState<Omit<Category, "id">>({
    name: "",
    image: "",
    name_en: "",
    description_en: "",
  })

  const [headerSettings, setHeaderSettings] = useState({
    title: "Menümüz",
    subtitle: "Lezzetli yemeklerimizi keşfedin!",
    logo: "",
    backgroundImage: "",
    backgroundOpacity: 0.3,
  })

  const [qrSettings, setQrSettings] = useState({
    url: typeof window !== "undefined" ? `${window.location.origin}/${slug}` : "http://localhost:3000",
    size: 300,
    bgColor: "#FFFFFF",
    fgColor: "#000000",
    logoUrl: "",
    logoSize: 60,
  })

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [showUserForm, setShowUserForm] = useState(false)
  const [userForm, setUserForm] = useState({
    username: "",
    password: "",
    display_name: "",
    role: "garson" as "admin" | "garson" | "kasa" | "mutfak",
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const supabase = createClient()

  const [isSaving, setIsSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const previousOrderCountRef = useRef<number>(0)
  const previousWaiterCallCountRef = useRef<number>(0)
  const ordersInitializedRef = useRef(false)
  const waiterCallsInitializedRef = useRef(false)
  const [trialExpired, setTrialExpired] = useState(false)
  const [tenantData, setTenantData] = useState<any>(null)

  // Load tenant on mount
  useEffect(() => {
    const loadTenant = async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select("id, slug, business_name, subscription_status, trial_end_date, subscription_end_date, subscription_plan, is_active")
        .eq("slug", slug)
        .single()

      if (error || !data) {
        console.error("Tenant not found:", slug)
        router.push("/")
        return
      }

      setTenantId(data.id)
      setTenantData(data)

      // Check trial status
      const isTrialActive =
        (data.subscription_status === "trial" && new Date(data.trial_end_date) > new Date()) ||
        data.subscription_status === "active"

      if (!isTrialActive || !data.is_active) {
        setTrialExpired(true)
      }
    }

    loadTenant()
  }, [slug, router, supabase])

  // Load dynamic pricing
  useEffect(() => {
    const loadPricing = async () => {
      try {
        const { data } = await supabase
          .from("pricing_view")
          .select("premium_price_try")
          .single()

        if (data?.premium_price_try) {
          setPremiumPriceTry(Math.round(data.premium_price_try))
        }
      } catch (error) {
        console.error("Pricing load error:", error)
      }
    }

    loadPricing()
  }, [supabase])

  // Check if user is already logged in with Supabase Auth
  useEffect(() => {
    const checkSession = async () => {
      if (!tenantId) return

      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Verify user belongs to this tenant
        const { data: tenant } = await supabase
          .from("tenants")
          .select("*")
          .eq("auth_user_id", session.user.id)
          .eq("id", tenantId)
          .single()

        if (tenant) {
          setIsAuthenticated(true)
          // Load user from admin_users table for role info
          const { data: adminUser, error: adminUserError } = await supabase
            .from("admin_users")
            .select("*")
            .eq("tenant_id", tenantId)
            .eq("auth_user_id", session.user.id)
            .maybeSingle()

          if (adminUserError) {
            console.error("Error loading admin user:", adminUserError)
          }

          if (adminUser) {
            setCurrentUser(adminUser)
          } else {
            // Create admin_users record if it doesn't exist
            const { data: newAdminUser } = await supabase
              .from("admin_users")
              .insert([{
                tenant_id: tenantId,
                auth_user_id: session.user.id,
                username: session.user.email?.split('@')[0] || 'admin',
                display_name: session.user.user_metadata?.owner_name || session.user.email,
                role: 'admin',
                password_hash: ''
              }])
              .select()
              .single()
            
            if (newAdminUser) {
              setCurrentUser(newAdminUser)
            }
          }
        }
      }
    }

    if (tenantId) {
      checkSession()
    }
  }, [slug, tenantId, supabase])

  // Login handler with Supabase Auth
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    if (!tenantId) {
      setLoginError("Tenant bilgisi yükleniyor, lütfen bekleyin...")
      return
    }

    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error("Auth error:", authError)
        setLoginError("E-posta veya şifre hatalı!")
        return
      }

      if (!authData.user) {
        setLoginError("Kullanıcı bulunamadı!")
        return
      }

      // Verify user belongs to this tenant
      const { data: tenant, error: tenantError } = await supabase
        .from("tenants")
        .select("*")
        .eq("auth_user_id", authData.user.id)
        .eq("id", tenantId)
        .single()

      if (tenantError || !tenant) {
        console.error("Tenant error:", tenantError)
        setLoginError("Bu restoran için yetkiniz yok!")
        await supabase.auth.signOut()
        return
      }

      // Load or create admin_users record for role info
      let { data: adminUser, error: adminUserError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("auth_user_id", authData.user.id)
        .maybeSingle()

      if (adminUserError) {
        console.warn("Error loading admin user:", adminUserError)
      }

      // If no admin_users record, create one (owner role)
      if (!adminUser) {
        const { data: newAdminUser, error: createError } = await supabase
          .from("admin_users")
          .insert([{
            tenant_id: tenantId,
            auth_user_id: authData.user.id,
            username: authData.user.email?.split('@')[0] || 'owner',
            display_name: authData.user.user_metadata?.owner_name || authData.user.email,
            role: 'admin',
            password_hash: '' // Not used anymore
          }])
          .select()
          .maybeSingle()

        if (createError) {
          console.error("Error creating admin user:", createError)
        }

        if (newAdminUser) {
          adminUser = newAdminUser
        }
      }

      console.log("Login successful:", { user: authData.user.email, tenant: tenant.slug })
      
      setIsAuthenticated(true)
      setCurrentUser(adminUser)
      setLoginError("")
    } catch (err) {
      console.error("Login error:", err)
      setLoginError("Giriş yapılırken bir hata oluştu!")
    }
  }

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setCurrentUser(null)
    setEmail("")
    setPassword("")
  }


  // Load admin users
  useEffect(() => {
    if (isAuthenticated && tenantId) {
      loadAdminUsers()
    }
  }, [isAuthenticated, tenantId])

  const loadAdminUsers = async () => {
    if (!tenantId) return

    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: true })

      if (error) throw error
      if (data) {
        setAdminUsers(data)
      }
    } catch (error) {
      console.error("Error loading admin users:", error)
    }
  }

  // Add new admin user
  const handleAddUser = async () => {
    if (!userForm.username || !userForm.password) {
      alert("Kullanıcı adı ve şifre gereklidir!")
      return
    }

    if (!tenantId) return

    try {
      const { error } = await supabase.from("admin_users").insert([
        {
          username: userForm.username,
          password_hash: userForm.password,
          display_name: userForm.display_name || userForm.username,
          role: userForm.role,
          tenant_id: tenantId,
        },
      ])

      if (error) throw error

      alert("Kullanıcı başarıyla eklendi!")
      setUserForm({ username: "", password: "", display_name: "", role: "garson" })
      setShowUserForm(false)
      loadAdminUsers()
    } catch (error: any) {
      console.error("Error adding user:", error)
      alert("Kullanıcı eklenirken hata: " + error.message)
    }
  }

  // Delete admin user
  const handleDeleteUser = async (id: string) => {
    if (currentUser?.id === id) {
      alert("Kendi hesabınızı silemezsiniz!")
      return
    }

    if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      return
    }

    try {
      const { error } = await supabase.from("admin_users").delete().eq("id", id)

      if (error) throw error

      alert("Kullanıcı silindi!")
      loadAdminUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Kullanıcı silinirken hata oluştu!")
    }
  }

  // Change password
  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert("Tüm alanları doldurun!")
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Yeni şifreler eşleşmiyor!")
      return
    }

    if (!currentUser) {
      alert("Kullanıcı bulunamadı!")
      return
    }

    try {
      // Verify current password
      const { data: userData, error: verifyError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("id", currentUser.id)
        .eq("password_hash", passwordForm.currentPassword)
        .single()

      if (verifyError || !userData) {
        alert("Mevcut şifre hatalı!")
        return
      }

      // Update password
      const { error: updateError } = await supabase
        .from("admin_users")
        .update({ password_hash: passwordForm.newPassword, updated_at: new Date().toISOString() })
        .eq("id", currentUser.id)

      if (updateError) throw updateError

      alert("Şifre başarıyla değiştirildi!")
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setShowPasswordForm(false)
    } catch (error) {
      console.error("Error changing password:", error)
      alert("Şifre değiştirilirken hata oluştu!")
    }
  }

  // Upload image to Supabase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true)
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from("menu-images").upload(filePath, file)

      if (uploadError) {
        console.error("Upload error:", uploadError)
        alert("Dosya yüklenirken hata oluştu: " + uploadError.message)
        return null
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("menu-images").getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Dosya yüklenirken hata oluştu")
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  // Manual save appearance settings
  const saveAppearanceSettings = async () => {
    if (!tenantId) return

    try {
      setIsSaving(true)

      // Önce mevcut ayarları kontrol et
      const { data: existingSettings } = await supabase
        .from("settings")
        .select("*")
        .eq("tenant_id", tenantId)
        .in("key", ["header", "theme"])

      // Header ayarlarını güncelle veya ekle
      const existingHeader = existingSettings?.find(s => s.key === "header")
      const { error: headerError } = await supabase
        .from("settings")
        .upsert({
          id: existingHeader?.id, // Eğer varsa mevcut kaydın ID'sini kullan
          key: "header",
          value: headerSettings, // State'teki güncel headerSettings değerini kullan
          tenant_id: tenantId,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "id"
        })

      if (headerError) {
        console.error("Header ayarları kaydedilirken hata:", headerError)
        throw headerError
      }

      // LocalStorage'a header ayarlarını yaz
      localStorage.setItem("restaurant_header", JSON.stringify(headerSettings))

      // Tema ayarlarını güncelle veya ekle
      const existingTheme = existingSettings?.find(s => s.key === "theme")
      const { error: themeError } = await supabase
        .from("settings")
        .upsert({
          id: existingTheme?.id, // Eğer varsa mevcut kaydın ID'sini kullan
          key: "theme",
          value: theme, // State'teki güncel theme değerini kullan
          tenant_id: tenantId,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "id"
        })

      if (themeError) {
        console.error("Tema ayarları kaydedilirken hata:", themeError)
        throw themeError
      }

      // Tema ayarlarını localStorage'a kaydet
      localStorage.setItem("restaurant_theme", JSON.stringify(theme))

      // Başarılı mesajı göster
      alert("Ayarlar başarıyla kaydedildi!")
    } catch (error) {
      console.error("Görünüm ayarları kaydedilemedi:", error)
      alert("Ayarlar kaydedilirken hata oluştu!")
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (!tenantId) return

    loadOrders()
    loadWaiterCalls()

    // Polling: Her 5 saniyede bir kontrol et (Realtime yok)
    const pollingInterval = setInterval(() => {
      loadOrders()
      loadWaiterCalls()
    }, 5000) // 5 saniye

    return () => {
      clearInterval(pollingInterval)
    }
  }, [tenantId])

  const loadOrders = async () => {
    if (!tenantId) return

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading orders:", error)
        const stored = localStorage.getItem("restaurant_orders")
        if (stored) {
          setOrders(JSON.parse(stored))
        }
      } else {
        const newOrders = data || []
        const pendingCount = newOrders.filter((o: Order) => o.status === "pending").length

        // Play sound if new orders arrived (after initial load)
        if (ordersInitializedRef.current && pendingCount > previousOrderCountRef.current) {
          playNotificationSound()
        }

        ordersInitializedRef.current = true
        previousOrderCountRef.current = pendingCount
        setOrders(newOrders)
      }
    } catch (err) {
      console.error("Supabase error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadWaiterCalls = async () => {
    if (!tenantId) return

    try {
      const { data, error } = await supabase
        .from("waiter_calls")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading waiter calls:", error)
      } else {
        const newCalls = data || []
        const pendingCount = newCalls.filter((c: { status: string }) => c.status === "pending").length

        // Play sound if new waiter calls arrived (after initial load)
        if (waiterCallsInitializedRef.current && pendingCount > previousWaiterCallCountRef.current) {
          playNotificationSound()
        }

        waiterCallsInitializedRef.current = true
        previousWaiterCallCountRef.current = pendingCount
        setWaiterCalls(newCalls)
      }
    } catch (err) {
      console.error("Error loading waiter calls:", err)
    }
  }

  const loadProducts = async () => {
    if (!tenantId) return

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("display_order", { ascending: true })

      if (error) throw error
      if (data) {
        const formattedProducts = data.map((prod: any) => ({
          id: prod.id,
          name: prod.name,
          description: prod.description || "",
          price: prod.price,
          categoryId: prod.category_id,
          image: prod.image || "",
          display_order: prod.display_order,
          badge: prod.badge || null,
          is_available: prod.is_available,
          name_en: prod.name_en || "",
          description_en: prod.description_en || "",
        }))
        setProducts(formattedProducts)
      }
    } catch (error) {
      console.error("Error loading products:", error)
    }
  }

  const loadCategories = async () => {
    if (!tenantId) return

    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("display_order", { ascending: true })

      if (error) throw error
      if (data) {
        const formattedCategories = data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          image: cat.image || "",
          display_order: cat.display_order,
          name_en: cat.name_en || "",
          description_en: cat.description_en || "",
        }))
        setCategories(formattedCategories)
      }
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [tenantId, supabase])

  useEffect(() => {
    loadCategories()
  }, [tenantId, supabase])

  useEffect(() => {
    const loadSettings = async () => {
      if (!tenantId) return

      try {
        const { data: themeData, error: themeError } = await supabase
          .from("settings")
          .select("*")
          .eq("key", "theme")
          .eq("tenant_id", tenantId)
          .maybeSingle()

        if (themeData?.value && !themeError) {
          setTheme(themeData.value)
        }

        const { data: headerData, error: headerError } = await supabase
          .from("settings")
          .select("*")
          .eq("key", "header")
          .eq("tenant_id", tenantId)
          .maybeSingle()

        if (headerData?.value && !headerError) {
          setHeaderSettings(headerData.value)
        }

        const { data: qrData, error: qrError } = await supabase
          .from("settings")
          .select("*")
          .eq("key", "qr")
          .eq("tenant_id", tenantId)
          .maybeSingle()

        if (qrData?.value && !qrError) {
          setQrSettings(qrData.value)
        }
      } catch (error) {
        console.error("Error loading settings:", error)
        const storedTheme = localStorage.getItem("restaurant_theme")
        const storedHeader = localStorage.getItem("restaurant_header")
        const storedQr = localStorage.getItem("restaurant_qr")
        if (storedTheme) setTheme(JSON.parse(storedTheme))
        if (storedHeader) setHeaderSettings(JSON.parse(storedHeader))
        if (storedQr) setQrSettings(JSON.parse(storedQr))
      }
    }

    loadSettings()
  }, [tenantId, supabase])

  useEffect(() => {
    const storedTheme = localStorage.getItem("restaurant_theme")
    if (storedTheme) {
      try {
        setTheme(JSON.parse(storedTheme))
      } catch (e) {
        console.error("Failed to load theme:", e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("restaurant_products", JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem("restaurant_categories", JSON.stringify(categories))
  }, [categories])

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId)

      if (error) {
        console.error("Error updating order:", error)
      } else {
        loadOrders()
      }
    } catch (err) {
      console.error("Supabase error:", err)
    }
  }

  const deleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase.from("orders").delete().eq("id", orderId)

      if (error) {
        console.error("Error deleting order:", error)
      } else {
        loadOrders()
        setDeleteId(null)
      }
    } catch (err) {
      console.error("Supabase error:", err)
    }
  }

  const updateWaiterCallStatus = async (callId: string, newStatus: WaiterCall["status"]) => {
    try {
      const { error } = await supabase
        .from("waiter_calls")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", callId)

      if (error) {
        console.error("Error updating waiter call:", error)
      } else {
        loadWaiterCalls()
      }
    } catch (err) {
      console.error("Supabase error:", err)
    }
  }

  const deleteWaiterCall = async (callId: string) => {
    try {
      const { error } = await supabase.from("waiter_calls").delete().eq("id", callId)

      if (error) {
        console.error("Error deleting waiter call:", error)
      } else {
        loadWaiterCalls()
        setDeleteId(null)
      }
    } catch (err) {
      console.error("Supabase error:", err)
    }
  }

  const handleAddProduct = async () => {
    if (editingProduct) {
      try {
        const { error } = await supabase
          .from("products")
          .update({
            name: productForm.name,
            description: productForm.description,
            price: productForm.price,
            category_id: productForm.categoryId,
            image: productForm.image,
            badge: productForm.badge || null,
            is_available: productForm.is_available !== false,
            name_en: productForm.name_en || null,
            description_en: productForm.description_en || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingProduct.id)

        if (error) throw error
        setEditingProduct(null)
        await loadProducts()
      } catch (error) {
        console.error("Error updating product:", error)
      }
    } else {
      if (!tenantId) return

      try {
        const { error } = await supabase.from("products").insert([
          {
            name: productForm.name,
            description: productForm.description,
            price: productForm.price,
            category_id: productForm.categoryId,
            image: productForm.image,
            badge: productForm.badge || null,
            is_available: productForm.is_available !== false,
            name_en: productForm.name_en || null,
            description_en: productForm.description_en || null,
            display_order: products.length,
            tenant_id: tenantId,
          },
        ])

        if (error) throw error
        await loadProducts()
      } catch (error) {
        console.error("Error adding product:", error)
      }
    }
    setProductForm({ name: "", description: "", price: 0, categoryId: "", image: "", badge: null, is_available: true, name_en: "", description_en: "" })
    setShowProductForm(false)
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id)
      if (error) throw error
      await loadProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const handleToggleProductAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_available: !currentStatus })
        .eq("id", productId)

      if (error) throw error

      // Update local state
      setProducts(products.map((p: Product) =>
        p.id === productId ? { ...p, is_available: !currentStatus } : p
      ))
    } catch (error) {
      console.error("Error toggling product availability:", error)
    }
  }

  const handleAddProductToOrder = () => {
    if (!selectedProduct) return

    const product = products.find((p: Product) => p.id === selectedProduct)
    if (!product) return

    // Check if product already in items
    const existingItemIndex = newOrderForm.items.findIndex((item: OrderItem) => item.id === product.id)

    if (existingItemIndex >= 0) {
      // Update quantity
      const updatedItems = [...newOrderForm.items]
      updatedItems[existingItemIndex].quantity += selectedQuantity
      setNewOrderForm({ ...newOrderForm, items: updatedItems })
    } else {
      // Add new item
      setNewOrderForm({
        ...newOrderForm,
        items: [
          ...newOrderForm.items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: selectedQuantity,
          },
        ],
      })
    }

    setSelectedProduct("")
    setSelectedQuantity(1)
  }

  const handleRemoveProductFromOrder = (productId: string) => {
    setNewOrderForm({
      ...newOrderForm,
      items: newOrderForm.items.filter((item: OrderItem) => item.id !== productId),
    })
  }

  const handleCreateManualOrder = async () => {
    if (!tenantId) return
    if (newOrderForm.items.length === 0) {
      alert("Lütfen en az bir ürün ekleyin")
      return
    }
    if (!newOrderForm.customerName.trim()) {
      alert("Lütfen müşteri adı girin")
      return
    }
    if (!newOrderForm.isDelivery && !newOrderForm.tableNumber.trim()) {
      alert("Lütfen masa numarası girin")
      return
    }
    if (newOrderForm.isDelivery && !newOrderForm.phoneNumber.trim()) {
      alert("Lütfen telefon numarası girin")
      return
    }

    const total = newOrderForm.items.reduce((sum: number, item: OrderItem) => sum + item.price * item.quantity, 0)

    try {
      const { error } = await supabase.from("orders").insert([
        {
          tenant_id: tenantId,
          table_number: newOrderForm.isDelivery ? null : newOrderForm.tableNumber,
          customer_name: newOrderForm.customerName,
          phone_number: newOrderForm.isDelivery ? newOrderForm.phoneNumber : null,
          is_delivery: newOrderForm.isDelivery,
          items: newOrderForm.items,
          notes: newOrderForm.notes,
          total: total,
          status: "pending",
        },
      ])

      if (error) throw error

      // Reset form
      setNewOrderForm({
        tableNumber: "",
        customerName: "",
        isDelivery: false,
        phoneNumber: "",
        items: [],
        notes: "",
      })
      setShowOrderForm(false)
      loadOrders()
    } catch (error) {
      console.error("Error creating manual order:", error)
      alert("Sipariş oluşturulurken bir hata oluştu")
    }
  }

  const handleAddCategory = async () => {
    if (editingCategory) {
      try {
        const { error } = await supabase
          .from("categories")
          .update({
            name: categoryForm.name,
            image: categoryForm.image,
            name_en: categoryForm.name_en || null,
            description_en: categoryForm.description_en || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingCategory.id)

        if (error) throw error
        setEditingCategory(null)
        await loadCategories()
      } catch (error) {
        console.error("Error updating category:", error)
      }
    } else {
      if (!tenantId) return

      try {
        const { error } = await supabase.from("categories").insert([
          {
            name: categoryForm.name,
            image: categoryForm.image,
            name_en: categoryForm.name_en || null,
            description_en: categoryForm.description_en || null,
            display_order: categories.length,
            tenant_id: tenantId,
          },
        ])

        if (error) throw error
        await loadCategories()
      } catch (error) {
        console.error("Error adding category:", error)
      }
    }
    setCategoryForm({ name: "", image: "", name_en: "", description_en: "" })
    setShowCategoryForm(false)
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id)
      if (error) throw error
      await loadCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  const moveCategory = async (id: string, direction: "up" | "down") => {
    const index = categories.findIndex((c: Category) => c.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === categories.length - 1)) {
      return
    }

    const newCategories = [...categories]
    const swapIndex = direction === "up" ? index - 1 : index + 1
    ;[newCategories[index], newCategories[swapIndex]] = [newCategories[swapIndex], newCategories[index]]

    newCategories.forEach(async (cat, i) => {
      cat.display_order = i
      try {
        await supabase.from("categories").update({ display_order: i }).eq("id", cat.id)
      } catch (error) {
        console.error("Error updating category order:", error)
      }
    })

    setCategories(newCategories)
  }

  const moveProduct = async (id: string, direction: "up" | "down") => {
    const index = products.findIndex((p: Product) => p.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === products.length - 1)) {
      return
    }

    const newProducts = [...products]
    const swapIndex = direction === "up" ? index - 1 : index + 1
    ;[newProducts[index], newProducts[swapIndex]] = [newProducts[swapIndex], newProducts[index]]

    newProducts.forEach(async (prod, i) => {
      prod.display_order = i
      try {
        await supabase.from("products").update({ display_order: i }).eq("id", prod.id)
      } catch (error) {
        console.error("Error updating product order:", error)
      }
    })

    setProducts(newProducts)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return renderOrdersTab()
      case "waiter-calls":
        return renderWaiterCallsTab()
      case "products":
        return renderProductsTab()
      case "categories":
        return renderCategoriesTab()
      case "appearance":
        return renderAppearanceTab()
      case "qr":
        return renderQRTab()
      case "users":
        return renderUsersTab()
      case "license":
        return renderLicenseTab()
      case "reports":
        return renderReportsTab()
      case "settings":
        return renderSettingsTab()
      default:
        return null
    }
  }

  const filteredOrders = filter === "all" ? orders : orders.filter((order: Order) => order.status === filter)

  const renderOrdersTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Sipariş Yönetimi</h2>
            <p className="text-sm text-muted-foreground">Siparişleri görüntüleyin ve yönetin</p>
          </div>
        </div>
        <Button onClick={() => setShowOrderForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Manuel Sipariş Oluştur
        </Button>
      </div>

      {showOrderForm && (
        <Card className="mb-6 bg-muted/50">
          <CardHeader>
            <CardTitle>Manuel Sipariş Oluştur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!newOrderForm.isDelivery}
                  onChange={() => setNewOrderForm({ ...newOrderForm, isDelivery: false })}
                />
                <span className="text-sm font-medium">Restoran İçinde</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newOrderForm.isDelivery}
                  onChange={() => setNewOrderForm({ ...newOrderForm, isDelivery: true })}
                />
                <span className="text-sm font-medium">Dışarıdan (Ön Sipariş)</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {!newOrderForm.isDelivery ? (
                <div>
                  <label className="text-sm font-medium">Masa Numarası</label>
                  <Input
                    type="text"
                    placeholder="Örn: 5, A12, Bahçe-3"
                    value={newOrderForm.tableNumber}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, tableNumber: e.target.value })}
                  />
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium">Telefon Numarası</label>
                  <Input
                    type="tel"
                    placeholder="Örn: 5551234567"
                    value={newOrderForm.phoneNumber}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, phoneNumber: e.target.value })}
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-medium">Müşteri Adı</label>
                <Input
                  type="text"
                  placeholder="Ad ve Soyad"
                  value={newOrderForm.customerName}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3">Ürün Seçimi</h3>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium">Ürün</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                  >
                    <option value="">Ürün seçin...</option>
                    {products
                      .filter((p) => p.is_available !== false)
                      .map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - ₺{product.price}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="w-24">
                  <label className="text-sm font-medium">Adet</label>
                  <Input
                    type="number"
                    min="1"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
                <Button onClick={handleAddProductToOrder} disabled={!selectedProduct} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Ekle
                </Button>
              </div>
            </div>

            {newOrderForm.items.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3">Seçilen Ürünler</h3>
                <div className="space-y-2">
                  {newOrderForm.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} x ₺{item.price} = ₺{item.quantity * item.price}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveProductFromOrder(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="font-bold">Toplam:</span>
                    <span className="text-xl font-bold text-primary">
                      ₺{newOrderForm.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Not (Opsiyonel)</label>
              <Textarea
                placeholder="Sipariş hakkında not ekleyin..."
                value={newOrderForm.notes}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, notes: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateManualOrder} className="flex-1 gap-2" disabled={newOrderForm.items.length === 0}>
                <CheckCircle2 className="w-4 h-4" />
                Sipariş Oluştur
              </Button>
              <Button onClick={() => {
                setShowOrderForm(false)
                setNewOrderForm({
                  tableNumber: "",
                  customerName: "",
                  isDelivery: false,
                  phoneNumber: "",
                  items: [],
                  notes: "",
                })
                setSelectedProduct("")
                setSelectedQuantity(1)
              }} variant="outline">
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className="whitespace-nowrap"
        >
          Tümü ({orders.length})
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
          className="whitespace-nowrap"
        >
          Beklemede ({orders.filter((o) => o.status === "pending").length})
        </Button>
        <Button
          variant={filter === "preparing" ? "default" : "outline"}
          onClick={() => setFilter("preparing")}
          className="whitespace-nowrap"
        >
          Hazırlanıyor ({orders.filter((o) => o.status === "preparing").length})
        </Button>
        <Button
          variant={filter === "ready" ? "default" : "outline"}
          onClick={() => setFilter("ready")}
          className="whitespace-nowrap"
        >
          Hazır ({orders.filter((o) => o.status === "ready").length})
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
          className="whitespace-nowrap"
        >
          Tamamlandı ({orders.filter((o) => o.status === "completed").length})
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-semibold text-muted-foreground">Yükleniyor...</p>
          </CardContent>
        </Card>
      ) : filter === "all" && orders.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">Henüz sipariş bulunmuyor</p>
            <p className="text-sm text-muted-foreground">Siparişler burada gösterilecek</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">
                      {order.is_delivery ? `Ön Sipariş - ${order.phone_number}` : `Masa ${order.table_number}`}
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-foreground/70">
                      {order.customer_name}
                    </CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                    {getStatusIcon(order.status)}
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(order.created_at).toLocaleTimeString("tr-TR")}
                </p>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="mb-4 max-h-40 overflow-y-auto">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Ürünler:</p>
                  <ul className="space-y-1">
                    {order.items.map((item) => (
                      <li key={item.id} className="text-sm text-foreground/80">
                        <span className="font-medium">{item.quantity}x</span> {item.name} (₺
                        {(item.price * item.quantity).toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </div>

                {order.notes && (
                  <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-xs font-semibold text-red-800 mb-1">Not:</p>
                    <p className="text-xs text-red-700">{order.notes}</p>
                  </div>
                )}

                <p className="text-lg font-bold text-foreground">₺{order.total.toFixed(2)}</p>
              </CardContent>

              <div className="border-t bg-muted/30 p-3 flex gap-2 flex-wrap">
                {(["pending", "preparing", "ready", "completed"] as const)
                  .filter((status) => status !== order.status)
                  .map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant="outline"
                      onClick={() => updateOrderStatus(order.id, status)}
                      className="text-xs"
                    >
                      {getStatusLabel(status)}
                    </Button>
                  ))}
                <Button size="sm" variant="destructive" onClick={() => setDeleteId(order.id)} className="ml-auto">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderWaiterCallsTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Garson Çağrıları</h2>
            <p className="text-sm text-muted-foreground">Müşteri garson çağrılarını görüntüleyin ve yönetin</p>
          </div>
        </div>
      </div>

      {waiterCalls.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">Henüz garson çağrısı bulunmamaktadır.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {waiterCalls.map((call) => (
            <Card key={call.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          call.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : call.status === "responded"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {call.status === "pending"
                          ? "Beklemede"
                          : call.status === "responded"
                            ? "Yanıtlandı"
                            : "Tamamlandı"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(call.created_at).toLocaleString("tr-TR")}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Masa:</span>
                        <span className="text-lg font-bold text-primary">{call.table_number}</span>
                      </div>
                      {call.customer_name && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Müşteri:</span>
                          <span>{call.customer_name}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {call.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => updateWaiterCallStatus(call.id, "responded")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Yanıtla
                        </Button>
                      )}
                      {call.status === "responded" && (
                        <Button
                          size="sm"
                          onClick={() => updateWaiterCallStatus(call.id, "completed")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Tamamla
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteId(call.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Sil
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Garson Çağrısını Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu garson çağrısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteWaiterCall(deleteId)} className="bg-red-600">
              Sil
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )

  const renderProductsTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Layers className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Ürün Yönetimi</h2>
            <p className="text-sm text-muted-foreground">Ürünlerinizi yönetin ve düzenleyin</p>
          </div>
        </div>
        <Button onClick={() => setShowProductForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Yeni Ürün Ekle
        </Button>
      </div>

      {showProductForm && (
        <Card className="mb-6 bg-muted/50">
          <CardHeader>
            <CardTitle>{editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Ürün Adı (Türkçe)</label>
                <Input
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Örn: Kuzu Şiş"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Product Name (English)</label>
                <Input
                  value={productForm.name_en}
                  onChange={(e) => setProductForm({ ...productForm, name_en: e.target.value })}
                  placeholder="e.g., Lamb Skewer"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Açıklama (Türkçe)</label>
                <Textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Ürün açıklaması"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description (English)</label>
                <Textarea
                  value={productForm.description_en}
                  onChange={(e) => setProductForm({ ...productForm, description_en: e.target.value })}
                  placeholder="Product description"
                  rows={3}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Fiyat (₺)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: Number.parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Kategori</label>
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  className="w-full border rounded px-3 py-2 bg-background"
                >
                  <option value="">Kategori Seç</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Etiket</label>
                <select
                  value={productForm.badge || ""}
                  onChange={(e) => setProductForm({ ...productForm, badge: e.target.value || null })}
                  className="w-full border rounded px-3 py-2 bg-background"
                >
                  <option value="">Etiket Yok</option>
                  <option value="gunun_urunu">Günün Ürünü</option>
                  <option value="sefin_onerisi">Şefin Önerisi</option>
                  <option value="yeni">Yeni</option>
                  <option value="populer">Popüler</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div className="space-y-0.5">
                <Label htmlFor="is-available" className="text-sm font-medium">
                  Ürün Durumu
                </Label>
                <p className="text-xs text-muted-foreground">
                  {productForm.is_available !== false ? "Ürün satışta" : "Ürün tükendi"}
                </p>
              </div>
              <Switch
                id="is-available"
                checked={productForm.is_available !== false}
                onCheckedChange={(checked) => setProductForm({ ...productForm, is_available: checked })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Resim</label>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground">Dosya Yükle</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const url = await uploadImage(file)
                        if (url) {
                          setProductForm({ ...productForm, image: url })
                        }
                      }
                    }}
                    disabled={uploadingImage}
                    className="cursor-pointer"
                  />
                  {uploadingImage && <p className="text-xs text-muted-foreground mt-1">Yükleniyor...</p>}
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">veya URL Gir</label>
                  <Input
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              {productForm.image && (
                <img
                  src={productForm.image || "/placeholder.svg"}
                  alt="preview"
                  className="mt-2 h-32 object-cover rounded"
                />
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddProduct}>{editingProduct ? "Güncelle" : "Ekle"}</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowProductForm(false)
                  setEditingProduct(null)
                  setProductForm({ name: "", description: "", price: 0, categoryId: "", image: "", badge: null, is_available: true, name_en: "", description_en: "" })
                }}
              >
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {products.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Layers className="w-12 h-12 text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">Ürün yok</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {product.image && (
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-lg font-bold text-primary">₺{product.price.toFixed(2)}</p>
                  <Badge variant={product.is_available !== false ? "default" : "secondary"}>
                    {product.is_available !== false ? "✅ Satışta" : "🚫 Tükendi"}
                  </Badge>
                </div>

                <div className="flex gap-2 flex-wrap mb-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveProduct(product.id, "up")}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveProduct(product.id, "down")}
                    disabled={index === products.length - 1}
                  >
                    ↓
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setEditingProduct(product)
                      setProductForm(product)
                      setShowProductForm(true)
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Düzenle
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderCategoriesTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Layers className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Kategori Yönetimi</h2>
            <p className="text-sm text-muted-foreground">Ürün kategorilerini organize edin</p>
          </div>
        </div>
        <Button onClick={() => setShowCategoryForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Yeni Kategori Ekle
        </Button>
      </div>

      {showCategoryForm && (
        <Card className="mb-6 bg-muted/50">
          <CardHeader>
            <CardTitle>{editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Kategori Adı (Türkçe)</label>
                <Input
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Örn: Ara Sıcaklar"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category Name (English)</label>
                <Input
                  value={categoryForm.name_en}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name_en: e.target.value })}
                  placeholder="e.g., Appetizers"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Resim</label>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground">Dosya Yükle</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const url = await uploadImage(file)
                        if (url) {
                          setCategoryForm({ ...categoryForm, image: url })
                        }
                      }
                    }}
                    disabled={uploadingImage}
                    className="cursor-pointer"
                  />
                  {uploadingImage && <p className="text-xs text-muted-foreground mt-1">Yükleniyor...</p>}
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">veya URL Gir</label>
                  <Input
                    value={categoryForm.image}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              {categoryForm.image && (
                <img
                  src={categoryForm.image || "/placeholder.svg"}
                  alt="preview"
                  className="mt-2 h-32 object-cover rounded"
                />
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCategory}>{editingCategory ? "Güncelle" : "Ekle"}</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCategoryForm(false)
                  setEditingCategory(null)
                  setCategoryForm({ name: "", image: "", name_en: "", description_en: "" })
                }}
              >
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {categories.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Layers className="w-12 h-12 text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">Kategori yok</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {category.image && (
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-40 object-cover"
                />
              )}
              <CardHeader className="pb-2">
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {products.filter((p) => p.categoryId === category.id).length} ürün
                </p>
                <div className="flex gap-2 flex-wrap mb-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveCategory(category.id, "up")}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveCategory(category.id, "down")}
                    disabled={index === categories.length - 1}
                  >
                    ↓
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setEditingCategory(category)
                      setCategoryForm(category)
                      setShowCategoryForm(true)
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Düzenle
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteCategory(category.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )



  const renderAppearanceTab = () => (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Görünüm Ayarları</h2>
          <p className="text-sm text-muted-foreground">Menü stilini ve renklerini özelleştirin</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Header Özelleştirme</CardTitle>
          <CardDescription>Üst başlık alanının içeriğini düzenleyin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Header Başlık</label>
            <Input
              value={headerSettings.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeaderSettings({ ...headerSettings, title: e.target.value })}
              placeholder="Menümüz"
              className="mb-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Header Alt Başlık</label>
            <Input
              value={headerSettings.subtitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeaderSettings({ ...headerSettings, subtitle: e.target.value })}
              placeholder="Lezzetli yemeklerimizi keşfedin!"
              className="mb-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Header Arkaplan Görseli</label>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-muted-foreground">Dosya Yükle</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const url = await uploadImage(file)
                      if (url) {
                        setHeaderSettings({ ...headerSettings, backgroundImage: url })
                      }
                    }
                  }}
                  disabled={uploadingImage}
                  className="cursor-pointer"
                />
                {uploadingImage && <p className="text-xs text-muted-foreground mt-1">Yükleniyor...</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground">veya URL Gir</label>
                <Input
                  value={headerSettings.backgroundImage || ""}
                  onChange={(e) => setHeaderSettings({ ...headerSettings, backgroundImage: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              {headerSettings.backgroundImage && (
                <>
                  <img
                    src={headerSettings.backgroundImage}
                    alt="Header arkaplan önizleme"
                    className="mt-2 h-32 object-cover rounded"
                  />
                  <div className="mt-4">
                    <label className="text-sm font-medium mb-2 block">
                      Arkaplan Opaklığı: {Math.round((headerSettings.backgroundOpacity || 0.3) * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={headerSettings.backgroundOpacity || 0.3}
                      onChange={(e) => setHeaderSettings({ ...headerSettings, backgroundOpacity: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Arkaplan görselinin şeffaflık derecesini ayarlayın (0% = tamamen şeffaf, 100% = tamamen opak)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Header Logo</label>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-muted-foreground">Dosya Yükle</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const url = await uploadImage(file)
                      if (url) {
                        setHeaderSettings({ ...headerSettings, logo: url })
                      }
                    }
                  }}
                  disabled={uploadingImage}
                  className="cursor-pointer mb-2"
                />
                {uploadingImage && <p className="text-xs text-muted-foreground mt-1">Yükleniyor...</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground">veya URL Gir</label>
                <Input
                  value={headerSettings.logo}
                  onChange={(e) => setHeaderSettings({ ...headerSettings, logo: e.target.value })}
                  placeholder="Logo URL (opsiyonel)"
                  className="mb-2"
                />
              </div>
            </div>
            {headerSettings.logo && (
              <img
                src={headerSettings.logo}
                alt="logo preview"
                className="mt-2 h-16 object-contain rounded"
              />
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Tema Renkleri</CardTitle>
          <CardDescription>Restoranınızın renklerini özelleştirin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Ana Düğme Rengi</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="w-12 h-12 rounded cursor-pointer border"
                />
                <Input
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  placeholder="#8B5A3C"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Ana Düğme Metin Rengi</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={theme.primaryTextColor}
                  onChange={(e) => setTheme({ ...theme, primaryTextColor: e.target.value })}
                  className="w-12 h-12 rounded cursor-pointer border"
                />
                <Input
                  value={theme.primaryTextColor}
                  onChange={(e) => setTheme({ ...theme, primaryTextColor: e.target.value })}
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Vurgu Rengi</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="w-12 h-12 rounded cursor-pointer border"
                />
                <Input
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  placeholder="#C9A961"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Arka Plan</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                  className="w-12 h-12 rounded cursor-pointer border"
                />
                <Input
                  value={theme.backgroundColor}
                  onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Metin Rengi</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={theme.textColor}
                  onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
                  className="w-12 h-12 rounded cursor-pointer border"
                />
                <Input
                  value={theme.textColor}
                  onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
                  placeholder="#1A1A1A"
                />
              </div>
            </div>
          </div>

          <div
            className="mt-8 p-6 rounded-lg border-2"
            style={{ borderColor: theme.primaryColor, backgroundColor: theme.backgroundColor }}
          >
            <h3 style={{ color: theme.textColor }} className="text-lg font-bold mb-4">
              Önizleme
            </h3>
            <div className="flex gap-4 flex-wrap">
              <Button style={{ backgroundColor: theme.primaryColor, color: theme.primaryTextColor }}>Ana Düğme</Button>
              <Button style={{ backgroundColor: theme.secondaryColor, color: theme.textColor }}>Vurgu Düğmesi</Button>
            </div>
            <p style={{ color: theme.textColor }} className="mt-4 text-sm">
              Bu metin örneğidir ve seçilen metin rengini gösterir.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button onClick={saveAppearanceSettings} disabled={isSaving} size="lg" className="gap-2">
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Ayarları Kaydet
            </>
          )}
        </Button>
      </div>
    </div>
  )

  const renderQRTab = () => {
    const downloadQRCode = () => {
      const svg = document.getElementById("qr-code-svg")
      if (!svg) return

      // SVG'yi string'e çevir
      const svgData = new XMLSerializer().serializeToString(svg)
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
      const svgUrl = URL.createObjectURL(svgBlob)

      const link = document.createElement("a")
      link.href = svgUrl
      link.download = "menu-qr-code.svg"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(svgUrl)
    }

    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <QrCode className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">QR Kod Ayarları</h2>
            <p className="text-sm text-muted-foreground">QR kodunuzu özelleştirin ve indirin</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* QR Code Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Özelleştirme</CardTitle>
              <CardDescription>QR kod görünümünü ayarlayın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">QR Kod URL</label>
                <Input
                  value={qrSettings.url}
                  onChange={(e) => setQrSettings({ ...qrSettings, url: e.target.value })}
                  placeholder="https://example.com"
                />
                <p className="text-xs text-muted-foreground mt-1">Müşterilerin yönlendirileceği adres</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Boyut: {qrSettings.size}px</label>
                <input
                  type="range"
                  min="200"
                  max="500"
                  step="10"
                  value={qrSettings.size}
                  onChange={(e) => setQrSettings({ ...qrSettings, size: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ön Plan Rengi</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={qrSettings.fgColor}
                      onChange={(e) => setQrSettings({ ...qrSettings, fgColor: e.target.value })}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={qrSettings.fgColor}
                      onChange={(e) => setQrSettings({ ...qrSettings, fgColor: e.target.value })}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Arka Plan Rengi</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={qrSettings.bgColor}
                      onChange={(e) => setQrSettings({ ...qrSettings, bgColor: e.target.value })}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={qrSettings.bgColor}
                      onChange={(e) => setQrSettings({ ...qrSettings, bgColor: e.target.value })}
                      placeholder="#FFFFFF"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Logo (Opsiyonel)</label>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Logo Yükle</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const url = await uploadImage(file)
                          if (url) {
                            setQrSettings({ ...qrSettings, logoUrl: url })
                          }
                        }
                      }}
                      disabled={uploadingImage}
                      className="cursor-pointer"
                    />
                    {uploadingImage && <p className="text-xs text-muted-foreground mt-1">Yükleniyor...</p>}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">veya URL Gir</label>
                    <Input
                      value={qrSettings.logoUrl}
                      onChange={(e) => setQrSettings({ ...qrSettings, logoUrl: e.target.value })}
                      placeholder="Logo URL"
                    />
                  </div>
                </div>
                {qrSettings.logoUrl && (
                  <>
                    <img src={qrSettings.logoUrl} alt="logo" className="mt-2 h-16 object-contain rounded" />
                    <div className="mt-2">
                      <label className="text-sm font-medium mb-2 block">Logo Boyutu: {qrSettings.logoSize}px</label>
                      <input
                        type="range"
                        min="40"
                        max="100"
                        step="5"
                        value={qrSettings.logoSize}
                        onChange={(e) => setQrSettings({ ...qrSettings, logoSize: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>

              <Button onClick={saveAppearanceSettings} disabled={isSaving} className="w-full gap-2">
                {isSaving ? "Kaydediliyor..." : "Ayarları Kaydet"}
              </Button>
            </CardContent>
          </Card>

          {/* QR Code Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Önizleme</CardTitle>
              <CardDescription>QR kodunuzun görünümü</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div
                  className="p-6 rounded-lg border-2 border-primary"
                  style={{ backgroundColor: qrSettings.bgColor }}
                >
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={qrSettings.url}
                    size={qrSettings.size}
                    level="H"
                    bgColor={qrSettings.bgColor}
                    fgColor={qrSettings.fgColor}
                    includeMargin={true}
                    imageSettings={
                      qrSettings.logoUrl
                        ? {
                            src: qrSettings.logoUrl,
                            height: qrSettings.logoSize,
                            width: qrSettings.logoSize,
                            excavate: true,
                          }
                        : undefined
                    }
                  />
                </div>

                <div className="text-center space-y-4 w-full">
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Hedef URL:</p>
                    <p className="text-sm font-mono break-all">{qrSettings.url}</p>
                  </div>

                  <Button onClick={downloadQRCode} className="w-full gap-2">
                    <QrCode className="w-4 h-4" />
                    QR Kodu İndir (PNG)
                  </Button>

                  <div className="text-xs text-muted-foreground">
                    <p>💡 İpucu: QR kodu A4 kağıda bastırabilir veya dijital ekranlarda gösterebilirsiniz.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderUsersTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Kullanıcı Yönetimi</h2>
            <p className="text-sm text-muted-foreground">Admin kullanıcılarını yönetin</p>
          </div>
        </div>
        <Button onClick={() => setShowUserForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Yeni Kullanıcı Ekle
        </Button>
      </div>

      {showUserForm && (
        <Card className="mb-6 bg-muted/50">
          <CardHeader>
            <CardTitle>Yeni Kullanıcı Ekle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">E-posta (Kullanıcı Adı)</label>
              <Input
                type="email"
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                placeholder="kullanici@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Şifre</label>
              <Input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                placeholder="Şifre"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Görünen Ad (Opsiyonel)</label>
              <Input
                value={userForm.display_name}
                onChange={(e) => setUserForm({ ...userForm, display_name: e.target.value })}
                placeholder="Ad Soyad"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Rol</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
              >
                <option value="admin">Admin - Tüm Yetkiler</option>
                <option value="garson">Garson - Sipariş ve Çağrılar</option>
                <option value="kasa">Kasa - Sipariş, Ürün, Raporlar</option>
                <option value="mutfak">Mutfak - Sadece Siparişler</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                {userForm.role === "admin" && "Tüm sekmelere erişim"}
                {userForm.role === "garson" && "Siparişler ve Garson Çağrıları sekmelerine erişim"}
                {userForm.role === "kasa" && "Siparişler, Ürünler, Kategoriler ve Raporlar sekmelerine erişim"}
                {userForm.role === "mutfak" && "Sadece Siparişler sekmesine erişim"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddUser}>Ekle</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowUserForm(false)
                  setUserForm({ username: "", password: "", display_name: "", role: "garson" })
                }}
              >
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {adminUsers.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{user.display_name || user.username}</CardTitle>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs">
                      {user.role === "admin" && "Admin"}
                      {user.role === "garson" && "Garson"}
                      {user.role === "kasa" && "Kasa"}
                      {user.role === "mutfak" && "Mutfak"}
                    </Badge>
                  </div>
                  <CardDescription>@{user.username}</CardDescription>
                </div>
                {currentUser?.id !== user.id && (
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Oluşturma: {new Date(user.created_at).toLocaleDateString("tr-TR")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderReportsTab = () => {
    const now = new Date()
    let startDate = new Date()

    // Calculate start date based on selected period
    if (reportPeriod === "today") {
      startDate.setHours(0, 0, 0, 0)
    } else if (reportPeriod === "week") {
      startDate.setDate(now.getDate() - 7)
      startDate.setHours(0, 0, 0, 0)
    } else if (reportPeriod === "month") {
      startDate.setDate(now.getDate() - 30)
      startDate.setHours(0, 0, 0, 0)
    }

    // Filter completed orders in the selected period
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.created_at)
      return order.status === "completed" && orderDate >= startDate
    })

    // Calculate statistics
    const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0)
    const orderCount = filteredOrders.length
    const averageOrderValue = orderCount > 0 ? totalSales / orderCount : 0

    // Calculate top products
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {}
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productSales[item.id]) {
          productSales[item.id] = { name: item.name, quantity: 0, revenue: 0 }
        }
        productSales[item.id].quantity += item.quantity
        productSales[item.id].revenue += item.price * item.quantity
      })
    })

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Calculate top customers
    const customerOrders: Record<string, { name: string; orderCount: number; totalSpent: number }> = {}
    filteredOrders.forEach((order) => {
      const key = order.customer_name || "Misafir"
      if (!customerOrders[key]) {
        customerOrders[key] = { name: key, orderCount: 0, totalSpent: 0 }
      }
      customerOrders[key].orderCount += 1
      customerOrders[key].totalSpent += order.total
    })

    const topCustomers = Object.values(customerOrders)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10)

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold">Satış Raporları</h2>
              <p className="text-sm text-muted-foreground">Satış performansınızı analiz edin</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={reportPeriod === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => setReportPeriod("today")}
            >
              Bugün
            </Button>
            <Button
              variant={reportPeriod === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setReportPeriod("week")}
            >
              Son 7 Gün
            </Button>
            <Button
              variant={reportPeriod === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setReportPeriod("month")}
            >
              Son 30 Gün
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Toplam Satış</CardDescription>
              <CardTitle className="text-3xl text-green-600">₺{totalSales.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span>{orderCount} sipariş tamamlandı</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Sipariş Sayısı</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{orderCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShoppingCart className="w-4 h-4 text-blue-600" />
                <span>Tamamlanan siparişler</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Ortalama Sipariş</CardDescription>
              <CardTitle className="text-3xl text-orange-600">₺{averageOrderValue.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span>Sipariş başına</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {orderCount === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Henüz Veri Yok</h3>
              <p className="text-sm text-muted-foreground">
                Seçilen dönemde tamamlanmış sipariş bulunmuyor.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  En Çok Satan Ürünler
                </CardTitle>
                <CardDescription>Gelire göre sıralı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.quantity} adet satıldı</p>
                        </div>
                      </div>
                      <span className="font-bold text-green-600">₺{product.revenue.toFixed(2)}</span>
                    </div>
                  ))}
                  {topProducts.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-4">Henüz ürün satışı yok</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Customers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  En Çok Sipariş Veren Müşteriler
                </CardTitle>
                <CardDescription>Toplam harcamaya göre sıralı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCustomers.map((customer, index) => (
                    <div key={customer.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.orderCount} sipariş</p>
                        </div>
                      </div>
                      <span className="font-bold text-green-600">₺{customer.totalSpent.toFixed(2)}</span>
                    </div>
                  ))}
                  {topCustomers.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-4">Henüz müşteri verisi yok</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  const renderLicenseTab = () => {
    if (!tenantData) return null

    const now = new Date()
    const isTrial = tenantData.subscription_status === "trial"
    const isPremium = tenantData.subscription_status === "active"

    // Calculate remaining days
    let daysRemaining = 0
    let endDate = null

    if (isTrial && tenantData.trial_end_date) {
      endDate = new Date(tenantData.trial_end_date)
      daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    } else if (isPremium && tenantData.subscription_end_date) {
      endDate = new Date(tenantData.subscription_end_date)
      daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    }

    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Lisans Bilgileri</h2>
            <p className="text-sm text-muted-foreground">Abonelik durumunuzu görüntüleyin</p>
          </div>
        </div>

        {isTrial && (
          <div className="space-y-6">
            <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Deneme Sürümü</CardTitle>
                  <div className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                    DENEMe
                  </div>
                </div>
                <CardDescription>Şu anda deneme sürümünü kullanıyorsunuz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/70 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Kalan Süre</p>
                    <p className="text-3xl font-bold text-primary">{daysRemaining} Gün</p>
                  </div>
                  <Clock className="w-12 h-12 text-yellow-600 opacity-50" />
                </div>
                <div className="p-4 bg-white/70 rounded-lg">
                  <p className="text-sm text-muted-foreground">Bitiş Tarihi</p>
                  <p className="text-lg font-semibold">
                    {endDate?.toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Premium'a Geçin
                </CardTitle>
                <CardDescription>Deneme süreniz dolmadan önce premium özelliklerin keyfini çıkarın</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Sınırsız ürün ve kategori</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">QR kod menü sistemi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Sipariş ve garson çağrı yönetimi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">7/24 öncelikli destek</span>
                  </div>
                </div>
                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">₺{premiumPriceTry}</span>
                    <span className="text-sm text-muted-foreground">/ay</span>
                  </div>
                  <p className="text-xs text-muted-foreground">30 günlük premium üyelik</p>
                </div>
                <Button
                  size="lg"
                  className="w-full text-lg gap-2"
                  onClick={() => router.push(`/${slug}/payment`)}
                >
                  <CreditCard className="w-5 h-5" />
                  Premium'a Yükselt
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {isPremium && (
          <div className="space-y-6">
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Premium Üyelik</CardTitle>
                  <div className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    AKTİF
                  </div>
                </div>
                <CardDescription>Tüm premium özelliklere erişiminiz var</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/70 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Kalan Süre</p>
                    <p className="text-3xl font-bold text-green-600">{daysRemaining} Gün</p>
                  </div>
                  <CheckCircle2 className="w-12 h-12 text-green-600 opacity-50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/70 rounded-lg">
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <p className="text-lg font-semibold capitalize">
                      {tenantData.subscription_plan === "monthly" ? "Aylık" : "Yıllık"}
                    </p>
                  </div>
                  <div className="p-4 bg-white/70 rounded-lg">
                    <p className="text-sm text-muted-foreground">Bitiş Tarihi</p>
                    <p className="text-lg font-semibold">
                      {endDate?.toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-white/70 rounded-lg border-l-4 border-green-500">
                  <p className="text-sm text-muted-foreground mb-1">Aktif Özellikler</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      <span>Sınırsız ürün</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      <span>QR menü</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      <span>Sipariş sistemi</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      <span>Garson çağrı</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Destek ve Yardım</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Premium üyeliğinizle ilgili herhangi bir sorunuz veya desteğe ihtiyacınız var mı?
                </p>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">7/24 Öncelikli Destek</p>
                    <a
                      href="mailto:destek@dijitalmenü.com"
                      className="text-sm text-primary hover:underline"
                    >
                      destek@dijitalmenü.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!isTrial && !isPremium && (
          <Card>
            <CardHeader>
              <CardTitle>Abonelik Durumu</CardTitle>
              <CardDescription>Abonelik bilgileriniz yükleniyor...</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    )
  }

  const renderSettingsTab = () => (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Key className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Ayarlar</h2>
          <p className="text-sm text-muted-foreground">Hesap ayarlarınızı yönetin</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Şifre Değiştir</CardTitle>
          <CardDescription>Hesap şifrenizi güncelleyin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showPasswordForm ? (
            <Button onClick={() => setShowPasswordForm(true)} className="gap-2">
              <Key className="w-4 h-4" />
              Şifre Değiştir
            </Button>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium">Mevcut Şifre</label>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Mevcut şifrenizi girin"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Yeni Şifre</label>
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Yeni şifrenizi girin"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Yeni Şifre (Tekrar)</label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Yeni şifrenizi tekrar girin"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleChangePassword}>Değiştir</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordForm(false)
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
                  }}
                >
                  İptal
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {currentUser && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Hesap Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Kullanıcı Adı</p>
              <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Görünen Ad</p>
              <p className="text-sm text-muted-foreground">{currentUser.display_name || "Belirtilmemiş"}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  // Show trial expired screen if trial is over
  if (trialExpired && tenantData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-red-200">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-3xl text-red-800">Deneme Süresi Sona Erdi</CardTitle>
            <CardDescription className="text-lg">
              <span className="font-semibold">{tenantData.business_name}</span> restoranının deneme süresi{" "}
              {new Date(tenantData.trial_end_date).toLocaleDateString("tr-TR")} tarihinde sona ermiştir.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-6">
              <h3 className="font-bold text-xl mb-4 text-center">Premium Özelliklere Devam Edin</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Sınırsız ürün ve kategori</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>QR kod menü sistemi</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Sipariş ve garson çağrı yönetimi</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Özelleştirilebilir tema ve görünüm</span>
                </li>
              </ul>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">₺{premiumPriceTry}/ay</p>
                <p className="text-sm text-muted-foreground">30 günlük premium üyelik</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full text-lg"
                onClick={() => router.push(`/${slug}/payment`)}
              >
                Ödeme Yap ve Devam Et
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/")}
              >
                Ana Sayfaya Dön
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Sorularınız için:{" "}
              <a href="mailto:destek@dijitalmenü.com" className="text-primary hover:underline">
                destek@dijitalmenü.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <QrCode className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Admin Paneli</CardTitle>
            <CardDescription className="text-center">
              Devam etmek için giriş yapın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">E-posta</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Şifre</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi girin"
                  required
                  autoComplete="current-password"
                />
              </div>
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {loginError}
                </div>
              )}
              <Button type="submit" className="w-full">
                Giriş Yap
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Role-based navigation visibility
  const userRole = currentUser?.role || "admin"
  const canView = (requiredRoles: string[]) => requiredRoles.includes(userRole)

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-20 md:w-64 bg-white border-r border-border p-4 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <h1 className="hidden md:block text-lg font-bold text-foreground">Menü Admin</h1>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {/* Orders - All roles can see */}
          <NavItem
            icon={<ShoppingCart className="w-5 h-5" />}
            label="Siparişler"
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
            badge={orders.filter((o) => o.status === "pending").length}
          />
          {/* Waiter Calls - admin, garson */}
          {canView(["admin", "garson"]) && (
            <NavItem
              icon={<Bell className="w-5 h-5" />}
              label="Garson Çağrıları"
              active={activeTab === "waiter-calls"}
              onClick={() => setActiveTab("waiter-calls")}
              badge={waiterCalls.filter((c) => c.status === "pending").length}
            />
          )}
          {/* Products - admin, kasa */}
          {canView(["admin", "kasa"]) && (
            <NavItem
              icon={<Layers className="w-5 h-5" />}
              label="Ürünler"
              active={activeTab === "products"}
              onClick={() => setActiveTab("products")}
            />
          )}
          {/* Categories - admin, kasa */}
          {canView(["admin", "kasa"]) && (
            <NavItem
              icon={<Layers className="w-5 h-5" />}
              label="Kategoriler"
              active={activeTab === "categories"}
              onClick={() => setActiveTab("categories")}
            />
          )}
          {/* Appearance - admin only */}
          {canView(["admin"]) && (
            <NavItem
              icon={<Settings className="w-5 h-5" />}
              label="Görünüm"
              active={activeTab === "appearance"}
              onClick={() => setActiveTab("appearance")}
            />
          )}
          {/* QR Code - admin only */}
          {canView(["admin"]) && (
            <NavItem
              icon={<QrCode className="w-5 h-5" />}
              label="QR Kod"
              active={activeTab === "qr"}
              onClick={() => setActiveTab("qr")}
            />
          )}
          {/* Users - admin only */}
          {canView(["admin"]) && (
            <NavItem
              icon={<Users className="w-5 h-5" />}
              label="Kullanıcılar"
              active={activeTab === "users"}
              onClick={() => setActiveTab("users")}
            />
          )}
          {/* Reports - admin, kasa */}
          {canView(["admin", "kasa"]) && (
            <NavItem
              icon={<BarChart3 className="w-5 h-5" />}
              label="Raporlar"
              active={activeTab === "reports"}
              onClick={() => setActiveTab("reports")}
            />
          )}
          {/* License - admin only */}
          {canView(["admin"]) && (
            <NavItem
              icon={<Award className="w-5 h-5" />}
              label="Lisans"
              active={activeTab === "license"}
              onClick={() => setActiveTab("license")}
            />
          )}
          {/* Settings - All roles can change password */}
          <NavItem
            icon={<Key className="w-5 h-5" />}
            label="Ayarlar"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </nav>

        <div className="pt-4 border-t space-y-2">
          <a
            href={`/${slug}`}
            className="flex items-center justify-center md:justify-start gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="hidden md:block">← Menüye Dön</span>
            <span className="md:hidden">←</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center md:justify-start gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden md:block">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          <div className="max-w-6xl">{renderContent()}</div>
        </div>
      </main>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Siparişi sil?</AlertDialogTitle>
            <AlertDialogDescription>Bu işlem geri alınamaz.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteId && deleteOrder(deleteId)}>Sil</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function NavItem({
  icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
  badge?: number
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${
        active ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      <span className="hidden md:inline text-sm font-medium">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={`absolute top-1 left-1 md:static md:ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
          active ? "bg-white text-primary" : "bg-red-500 text-white"
        }`}>
          {badge}
        </span>
      )}
    </button>
  )
}
