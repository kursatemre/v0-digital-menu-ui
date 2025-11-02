"use client"

import { Analytics } from "@vercel/analytics/next"
import React from "react"
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_SETTINGS } from "@/lib/seed-data"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const dataVersion = localStorage.getItem("restaurant_data_version")
      const hasData = localStorage.getItem("restaurant_categories")

      let isValidData = false
      if (hasData) {
        try {
          const categories = JSON.parse(hasData)
          const products = JSON.parse(localStorage.getItem("restaurant_products") || "[]")
          isValidData = categories.length > 5 && products.length > 10
        } catch (e) {
          isValidData = false
        }
      }

      if (!isValidData || dataVersion !== "1.0") {
        localStorage.setItem("restaurant_categories", JSON.stringify(SEED_CATEGORIES))
        localStorage.setItem("restaurant_products", JSON.stringify(SEED_PRODUCTS))
        localStorage.setItem("restaurant_settings", JSON.stringify(SEED_SETTINGS))
        localStorage.setItem("restaurant_data_version", "1.0")
        console.log("[v0] Seed data loaded successfully!")
        console.log("[v0] Categories:", SEED_CATEGORIES.length)
        console.log("[v0] Products:", SEED_PRODUCTS.length)
      } else {
        const cats = JSON.parse(localStorage.getItem("restaurant_categories") || "[]")
        const prods = JSON.parse(localStorage.getItem("restaurant_products") || "[]")
        console.log("[v0] Existing data found - Categories:", cats.length, "Products:", prods.length)
      }
    }
  }, [])

  return (
    <React.Fragment>
      {children}
      <Analytics />
    </React.Fragment>
  )
}
