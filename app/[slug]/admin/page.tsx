"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { QRCodeSVG } from "qrcode.react"
import { createClient } from "@/lib/supabase/client"

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
}

type AdminUser = {
  id: string
  username: string
  password_hash: string
  display_name: string | null
  created_at: string
}

type Category = {
  id: string
  name: string
  image: string
  display_order?: number
}

type Theme = {
  primaryColor: string
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
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const [activeTab, setActiveTab] = useState<
    "orders" | "waiter-calls" | "products" | "categories" | "appearance" | "qr" | "users" | "settings"
  >("orders")
  const [orders, setOrders] = useState<Order[]>([])
  const [waiterCalls, setWaiterCalls] = useState<WaiterCall[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [theme, setTheme] = useState<Theme>({
    primaryColor: "#8B5A3C",
    secondaryColor: "#C9A961",
    backgroundColor: "#FFFFFF",
    textColor: "#1A1A1A",
  })
  const [isLoading, setIsLoading] = useState(true)

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
  })

  const [productForm, setProductForm] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    image: "",
    badge: null,
  })

  const [categoryForm, setCategoryForm] = useState<Omit<Category, "id">>({
    name: "",
    image: "",
  })

  const [headerSettings, setHeaderSettings] = useState({
    title: "Menümüz",
    subtitle: "Lezzetli yemeklerimizi keşfedin!",
    logo: "",
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
        .select("id, slug, business_name, subscription_status, trial_end_date, is_active")
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

  // Check if user is already logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem(`admin_logged_in_${slug}`)
    if (loggedIn === "true") {
      setIsAuthenticated(true)
    }
  }, [slug])

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    if (!tenantId) {
      setLoginError("Tenant bilgisi yükleniyor, lütfen bekleyin...")
      return
    }

    try {
      // Check Supabase for user with tenant_id filter
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("username", username)
        .eq("password_hash", password)
        .eq("tenant_id", tenantId)
        .single()

      if (error || !data) {
        setLoginError("Kullanıcı adı veya şifre hatalı!")
        return
      }

      setIsAuthenticated(true)
      setCurrentUser(data)
      localStorage.setItem(`admin_logged_in_${slug}`, "true")
      localStorage.setItem(`admin_user_id_${slug}`, data.id)
      setLoginError("")
    } catch (err) {
      console.error("Login error:", err)
      setLoginError("Giriş yapılırken bir hata oluştu!")
    }
  }

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    localStorage.removeItem(`admin_logged_in_${slug}`)
    localStorage.removeItem(`admin_user_id_${slug}`)
    setUsername("")
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
          tenant_id: tenantId,
        },
      ])

      if (error) throw error

      alert("Kullanıcı başarıyla eklendi!")
      setUserForm({ username: "", password: "", display_name: "" })
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

      // Save theme
      await supabase.from("settings").upsert({ key: "theme", value: theme, tenant_id: tenantId }, { onConflict: "key" })

      // Save header settings
      await supabase.from("settings").upsert({ key: "header", value: headerSettings, tenant_id: tenantId }, { onConflict: "key" })

      // Save QR settings
      await supabase.from("settings").upsert({ key: "qr", value: qrSettings, tenant_id: tenantId }, { onConflict: "key" })

      // Update localStorage
      localStorage.setItem("restaurant_theme", JSON.stringify(theme))
      localStorage.setItem("restaurant_header", JSON.stringify(headerSettings))
      localStorage.setItem("restaurant_qr", JSON.stringify(qrSettings))

      // Apply theme to CSS variables
      document.documentElement.style.setProperty("--primary", theme.primaryColor)
      document.documentElement.style.setProperty("--secondary", theme.secondaryColor)

      alert("Ayarlar başarıyla kaydedildi!")
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Ayarlar kaydedilirken hata oluştu")
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
        const pendingCount = newOrders.filter((o) => o.status === "pending").length

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
        const pendingCount = newCalls.filter((c) => c.status === "pending").length

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

  useEffect(() => {
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
          }))
          setProducts(formattedProducts)
        }
      } catch (error) {
        console.error("Error loading products:", error)
      }
    }

    loadProducts()
  }, [tenantId, supabase])

  useEffect(() => {
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
          }))
          setCategories(formattedCategories)
        }
      } catch (error) {
        console.error("Error loading categories:", error)
      }
    }

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
          .single()

        if (themeData?.value) {
          setTheme(themeData.value)
        }

        const { data: headerData, error: headerError } = await supabase
          .from("settings")
          .select("*")
          .eq("key", "header")
          .eq("tenant_id", tenantId)
          .single()

        if (headerData?.value) {
          setHeaderSettings(headerData.value)
        }

        const { data: qrData, error: qrError } = await supabase
          .from("settings")
          .select("*")
          .eq("key", "qr")
          .eq("tenant_id", tenantId)
          .single()

        if (qrData?.value) {
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

  // Removed auto-save useEffects - now using manual save button

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
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingProduct.id)

        if (error) throw error
        setEditingProduct(null)
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
            display_order: products.length,
            tenant_id: tenantId,
          },
        ])

        if (error) throw error
      } catch (error) {
        console.error("Error adding product:", error)
      }
    }
    setProductForm({ name: "", description: "", price: 0, categoryId: "", image: "", badge: null })
    setShowProductForm(false)
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id)
      if (error) throw error
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
      setProducts(products.map(p =>
        p.id === productId ? { ...p, is_available: !currentStatus } : p
      ))
    } catch (error) {
      console.error("Error toggling product availability:", error)
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
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingCategory.id)

        if (error) throw error
        setEditingCategory(null)
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
            display_order: categories.length,
            tenant_id: tenantId,
          },
        ])

        if (error) throw error
      } catch (error) {
        console.error("Error adding category:", error)
      }
    }
    setCategoryForm({ name: "", image: "" })
    setShowCategoryForm(false)
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id)
      if (error) throw error
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  const moveCategory = async (id: string, direction: "up" | "down") => {
    const index = categories.findIndex((c) => c.id === id)
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
    const index = products.findIndex((p) => p.id === id)
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
      case "settings":
        return renderSettingsTab()
      default:
        return null
    }
  }

  const filteredOrders = filter === "all" ? orders : orders.filter((order) => order.status === filter)

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
                    type="number"
                    placeholder="Örn: 5"
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

            <div className="flex gap-2">
              <Button onClick={() => setShowOrderForm(false)} variant="outline">
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
            <div>
              <label className="text-sm font-medium">Ürün Adı</label>
              <Input
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="Örn: Kuzu Şiş"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Açıklama</label>
              <Textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                placeholder="Ürün açıklaması"
                rows={3}
              />
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
                  setProductForm({ name: "", description: "", price: 0, categoryId: "", image: "", badge: null })
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
                <p className="text-lg font-bold text-primary mb-2">₺{product.price.toFixed(2)}</p>

                {/* Availability Toggle */}
                <Button
                  size="sm"
                  variant={product.is_available !== false ? "default" : "secondary"}
                  className="w-full mb-3"
                  onClick={() => handleToggleProductAvailability(product.id, product.is_available !== false)}
                >
                  {product.is_available !== false ? "✅ Satışta" : "🚫 Tükendi"}
                </Button>

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
            <div>
              <label className="text-sm font-medium">Kategori Adı</label>
              <Input
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="Örn: Ara Sıcaklar"
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
                  setCategoryForm({ name: "", image: "" })
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
              onChange={(e) => setHeaderSettings({ ...headerSettings, title: e.target.value })}
              placeholder="Menümüz"
              className="mb-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Header Alt Başlık</label>
            <Input
              value={headerSettings.subtitle}
              onChange={(e) => setHeaderSettings({ ...headerSettings, subtitle: e.target.value })}
              placeholder="Lezzetli yemeklerimizi keşfedin!"
              className="mb-2"
            />
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
              <label className="text-sm font-medium mb-2 block">Ana Renk</label>
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
              <Button style={{ backgroundColor: theme.primaryColor, color: "#fff" }}>Ana Düğme</Button>
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

      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const svgData = new XMLSerializer().serializeToString(svg)
      const img = new Image()
      img.onload = () => {
        canvas.width = qrSettings.size
        canvas.height = qrSettings.size
        ctx.drawImage(img, 0, 0)
        const link = document.createElement("a")
        link.download = "menu-qr-code.png"
        link.href = canvas.toDataURL("image/png")
        link.click()
      }
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
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
              <label className="text-sm font-medium">Kullanıcı Adı</label>
              <Input
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                placeholder="kullanici_adi"
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
            <div className="flex gap-2">
              <Button onClick={handleAddUser}>Ekle</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowUserForm(false)
                  setUserForm({ username: "", password: "", display_name: "" })
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
                <div>
                  <CardTitle className="text-lg">{user.display_name || user.username}</CardTitle>
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
                <p className="text-3xl font-bold text-primary mb-2">₺299/ay</p>
                <p className="text-sm text-muted-foreground">İlk ay %50 indirimli - Sadece ₺149</p>
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
                <label className="text-sm font-medium mb-2 block">Kullanıcı Adı</label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınızı girin"
                  required
                  autoComplete="username"
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
          <NavItem
            icon={<ShoppingCart className="w-5 h-5" />}
            label="Siparişler"
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
            badge={orders.filter((o) => o.status === "pending").length}
          />
          <NavItem
            icon={<Bell className="w-5 h-5" />}
            label="Garson Çağrıları"
            active={activeTab === "waiter-calls"}
            onClick={() => setActiveTab("waiter-calls")}
            badge={waiterCalls.filter((c) => c.status === "pending").length}
          />
          <NavItem
            icon={<Layers className="w-5 h-5" />}
            label="Ürünler"
            active={activeTab === "products"}
            onClick={() => setActiveTab("products")}
          />
          <NavItem
            icon={<Layers className="w-5 h-5" />}
            label="Kategoriler"
            active={activeTab === "categories"}
            onClick={() => setActiveTab("categories")}
          />
          <NavItem
            icon={<Settings className="w-5 h-5" />}
            label="Görünüm"
            active={activeTab === "appearance"}
            onClick={() => setActiveTab("appearance")}
          />
          <NavItem
            icon={<QrCode className="w-5 h-5" />}
            label="QR Kod"
            active={activeTab === "qr"}
            onClick={() => setActiveTab("qr")}
          />
          <NavItem
            icon={<Users className="w-5 h-5" />}
            label="Kullanıcılar"
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
          />
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
