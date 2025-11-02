"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

type Product = {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  image: string
  display_order?: number
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

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "categories" | "appearance" | "qr">("orders")
  const [orders, setOrders] = useState<Order[]>([])
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

  const supabase = createClient()

  useEffect(() => {
    loadOrders()

    const channel = supabase
      .channel("orders_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          loadOrders()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading orders:", error)
        const stored = localStorage.getItem("restaurant_orders")
        if (stored) {
          setOrders(JSON.parse(stored))
        }
      } else {
        setOrders(data || [])
      }
    } catch (err) {
      console.error("Supabase error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*").order("display_order", { ascending: true })

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
          }))
          setProducts(formattedProducts)
        }
      } catch (error) {
        console.error("Error loading products:", error)
      }
    }

    loadProducts()
  }, [supabase])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
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
  }, [supabase])

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: themeData, error: themeError } = await supabase
          .from("settings")
          .select("*")
          .eq("key", "theme")
          .single()

        if (themeData?.value) {
          setTheme(themeData.value)
        }

        const { data: headerData, error: headerError } = await supabase
          .from("settings")
          .select("*")
          .eq("key", "header")
          .single()

        if (headerData?.value) {
          setHeaderSettings(headerData.value)
        }
      } catch (error) {
        console.error("Error loading settings:", error)
        const storedTheme = localStorage.getItem("restaurant_theme")
        const storedHeader = localStorage.getItem("restaurant_header")
        if (storedTheme) setTheme(JSON.parse(storedTheme))
        if (storedHeader) setHeaderSettings(JSON.parse(storedHeader))
      }
    }

    loadSettings()
  }, [supabase])

  useEffect(() => {
    const saveSettings = async () => {
      try {
        await supabase.from("settings").upsert({ key: "theme", value: theme }, { onConflict: "key" })

        localStorage.setItem("restaurant_theme", JSON.stringify(theme))
        document.documentElement.style.setProperty("--primary", theme.primaryColor)
        document.documentElement.style.setProperty("--secondary", theme.secondaryColor)
      } catch (error) {
        console.error("Error saving theme:", error)
      }
    }

    saveSettings()
  }, [theme, supabase])

  useEffect(() => {
    const saveHeaderSettings = async () => {
      try {
        await supabase.from("settings").upsert({ key: "header", value: headerSettings }, { onConflict: "key" })

        localStorage.setItem("restaurant_header", JSON.stringify(headerSettings))
      } catch (error) {
        console.error("Error saving header:", error)
      }
    }

    saveHeaderSettings()
  }, [headerSettings, supabase])

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
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingProduct.id)

        if (error) throw error
        setEditingProduct(null)
      } catch (error) {
        console.error("Error updating product:", error)
      }
    } else {
      try {
        const { error } = await supabase.from("products").insert([
          {
            name: productForm.name,
            description: productForm.description,
            price: productForm.price,
            category_id: productForm.categoryId,
            image: productForm.image,
            display_order: products.length,
          },
        ])

        if (error) throw error
      } catch (error) {
        console.error("Error adding product:", error)
      }
    }
    setProductForm({ name: "", description: "", price: 0, categoryId: "", image: "" })
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
      try {
        const { error } = await supabase.from("categories").insert([
          {
            name: categoryForm.name,
            image: categoryForm.image,
            display_order: categories.length,
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
      case "products":
        return renderProductsTab()
      case "categories":
        return renderCategoriesTab()
      case "appearance":
        return renderAppearanceTab()
      case "qr":
        return renderQRTab()
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
            </div>
            <div>
              <label className="text-sm font-medium">Resim URL</label>
              <Input
                value={productForm.image}
                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                placeholder="https://..."
              />
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
                  setProductForm({ name: "", description: "", price: 0, categoryId: "", image: "" })
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
                <p className="text-lg font-bold text-primary mb-4">₺{product.price.toFixed(2)}</p>
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
              <label className="text-sm font-medium">Resim URL</label>
              <Input
                value={categoryForm.image}
                onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                placeholder="https://..."
              />
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
            <Input
              value={headerSettings.logo}
              onChange={(e) => setHeaderSettings({ ...headerSettings, logo: e.target.value })}
              placeholder="Logo URL (opsiyonel)"
              className="mb-2"
            />
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
    </div>
  )

  const renderQRTab = () => (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <QrCode className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">QR Kod</h2>
          <p className="text-sm text-muted-foreground">Müşteriler bu QR kodu tarayarak menüye erişebilir</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white p-6 rounded-lg border-2 border-primary">
              <QRCodeSVG
                value={typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}
                size={300}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                URL: {typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}
              </p>
              <Button
                onClick={() => {
                  const canvas = document.querySelector("canvas")
                  if (canvas) {
                    const link = document.createElement("a")
                    link.download = "menu-qr-code.png"
                    link.href = canvas.toDataURL()
                    link.click()
                  }
                }}
                className="gap-2"
              >
                <QrCode className="w-4 h-4" />
                QR Kodu İndir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

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
        </nav>

        <div className="pt-4 border-t">
          <a
            href="/"
            className="flex items-center justify-center md:justify-start gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="hidden md:block">← Menüye Dön</span>
            <span className="md:hidden">←</span>
          </a>
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
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-lg transition-colors ${
        active ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      <span className="hidden md:inline text-sm font-medium">{label}</span>
    </button>
  )
}
