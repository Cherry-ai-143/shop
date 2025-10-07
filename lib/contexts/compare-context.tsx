"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "@/lib/types"

interface CompareContextType {
  compareProducts: Product[]
  addToCompare: (product: Product) => void
  removeFromCompare: (productId: string) => void
  clearCompare: () => void
  isInCompare: (productId: string) => boolean
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

const COMPARE_STORAGE_KEY = "smartcompare_compare_products"

const getProductId = (product: Product | string): string => {
  if (typeof product === "string") return product
  // Use MongoDB _id if available, otherwise fallback to category + id combination
  return product._id || `${product.category}-${product.id}`
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareProducts, setCompareProducts] = useState<Product[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(COMPARE_STORAGE_KEY)
    if (stored) {
      try {
        setCompareProducts(JSON.parse(stored))
        console.log("[v0] Compare list loaded from localStorage:", JSON.parse(stored))
      } catch (error) {
        console.error("[v0] Error loading compare list from localStorage:", error)
        setCompareProducts([])
      }
    }
  }, [])

  // Save to localStorage whenever compareProducts changes
  useEffect(() => {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareProducts))
    console.log("[v0] Compare list saved to localStorage:", compareProducts)
  }, [compareProducts])

  const addToCompare = (product: Product) => {
    setCompareProducts((prev) => {
      const productId = getProductId(product)
      if (prev.some((p) => getProductId(p) === productId)) {
        return prev
      }
      return [...prev, product]
    })
  }

  const removeFromCompare = (productId: string) => {
    setCompareProducts((prev) => prev.filter((p) => getProductId(p) !== productId))
  }

  const clearCompare = () => {
    console.log("[v0] clearCompare called - clearing ONLY compare products")
    setCompareProducts([])
    console.log("[v0] Compare list cleared successfully")
  }

  const isInCompare = (productId: string) => {
    return compareProducts.some((p) => getProductId(p) === productId)
  }

  return (
    <CompareContext.Provider
      value={{
        compareProducts,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider")
  }
  return context
}
