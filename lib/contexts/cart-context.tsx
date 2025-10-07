"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartItem {
  productKey: string
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (productKey: string, quantity?: number) => void
  removeFromCart: (productKey: string) => void
  updateQuantity: (productKey: string, quantity: number) => void
  clearCart: () => void
  setCartFromCompare: (productKeys: string[]) => void
  setCartFromCompareWithQuantity: (items: { productKey: string; quantity: number }[]) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "smartcompare_cart_items"

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const migrated: CartItem[] = Array.isArray(parsed)
          ? parsed.map((it: any) =>
              typeof it?.productKey === "string"
                ? it
                : {
                    productKey: String(it?.productId), // fallback preserves old carts; still works via numeric fallback
                    quantity: typeof it?.quantity === "number" ? it.quantity : 1,
                  },
            )
          : []
        setCartItems(migrated)
        console.log("[v0] Cart loaded (migrated if needed):", migrated)
      } catch (error) {
        console.error("[v0] Error loading cart from localStorage:", error)
        setCartItems([])
      }
    }
  }, [])

  // Save to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    console.log("[v0] Cart saved to localStorage:", cartItems)
  }, [cartItems])

  const addToCart = (productKey: string, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productKey === productKey)
      if (existing) {
        return prev.map((item) =>
          item.productKey === productKey ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...prev, { productKey, quantity }]
    })
  }

  const removeFromCart = (productKey: string) => {
    setCartItems((prev) => prev.filter((item) => item.productKey !== productKey))
  }

  const updateQuantity = (productKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productKey)
      return
    }
    setCartItems((prev) => prev.map((item) => (item.productKey === productKey ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    console.log("[v0] clearCart called - clearing ONLY cart items")
    setCartItems([])
    console.log("[v0] Cart cleared successfully")
  }

  const setCartFromCompare = (productKeys: string[]) => {
    const uniqueIncoming = Array.from(new Set(productKeys))
    setCartItems(uniqueIncoming.map((key) => ({ productKey: key, quantity: 1 })))
  }

  const setCartFromCompareWithQuantity = (items: { productKey: string; quantity: number }[]) => {
    const uniqueIncoming = Array.from(new Set(items.map((item) => item.productKey)))
    const cappedItems = uniqueIncoming.map((key) => {
      const found = items.find((item) => item.productKey === key)
      return {
        productKey: key,
        quantity: found ? Math.min(found.quantity, 10) : 1,
      }
    })
    setCartItems(cappedItems)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setCartFromCompare,
        setCartFromCompareWithQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
