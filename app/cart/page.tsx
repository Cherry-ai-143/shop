"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { type Product, platforms } from "@/lib/types"
import { getLowestPrice } from "@/lib/utils/price-helpers"
import { Minus, Plus, Trash2, ShoppingCart, TrendingDown, ExternalLink, Crown, Sparkles } from "lucide-react"
import { useCart } from "@/lib/contexts/cart-context"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart()
  const router = useRouter()
  const [optimizedBasket, setOptimizedBasket] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (products.length > 0) {
      calculateOptimizedBasket()
    }
  }, [cartItems, products])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateOptimizedBasket = () => {
    if (cartItems.length === 0) {
      setOptimizedBasket(null)
      return
    }

    const resolveByKey = (key: string) => {
      const numeric = Number.isFinite(Number(key)) ? Number(key) : null
      return products.find(
        (p) => (p as any)._id === key || `${p.category}-${p.id}` === key || (numeric !== null && p.id === numeric),
      )
    }

    const cartProducts = cartItems
      .map((item) => {
        const p = resolveByKey(item.productKey)
        return p ? { ...p, quantity: item.quantity } : undefined
      })
      .filter((p): p is Product & { quantity: number } => Boolean(p))

    if (cartProducts.length === 0) return

    const platformTotals = platforms.map((platform) => {
      let total = 0
      let availableItems = 0
      const unavailableItems: any[] = []

      cartProducts.forEach((product) => {
        const isAvailable = product.availability[platform.id as keyof typeof product.availability]
        if (isAvailable) {
          total += product.prices[platform.id as keyof typeof product.prices] * product.quantity
          availableItems += product.quantity
        } else {
          unavailableItems.push(product)
        }
      })

      return {
        platform: platform.id,
        platformName: platform.name,
        platformColor: platform.color,
        total,
        availableItems,
        totalItems: cartProducts.reduce((sum, p) => sum + p.quantity, 0),
        unavailableItems,
        isFullyAvailable: unavailableItems.length === 0,
      }
    })

    const fullyAvailablePlatforms = platformTotals.filter((p) => p.isFullyAvailable)
    const candidatePlatforms = fullyAvailablePlatforms.length > 0 ? fullyAvailablePlatforms : platformTotals
    const cheapestPlatform = candidatePlatforms.reduce((cheapest, current) =>
      current.total < cheapest.total ? current : cheapest,
    )

    const platformsWithSavings = platformTotals.map((platform) => ({
      ...platform,
      savings: platform.isFullyAvailable ? platform.total - cheapestPlatform.total : 0,
    }))

    setOptimizedBasket({
      cartProducts,
      platformTotals: platformsWithSavings,
      cheapestPlatform: cheapestPlatform.platform,
      totalSavings: Math.max(...platformsWithSavings.map((p) => p.savings)),
    })
  }

  const openPlatformCheckout = (platformId: string) => {
    const urls = {
      blinkit: "https://blinkit.com/checkout",
      zepto: "https://zepto.com/checkout",
      bigbasket: "https://www.bigbasket.com/checkout",
      jiomart: "https://www.jiomart.com/checkout",
    }
    window.open(urls[platformId as keyof typeof urls], "_blank")
  }

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glassmorphism p-12 rounded-2xl">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading cart...</p>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glassmorphism p-12 rounded-2xl">
            <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4 text-foreground">Your Cart is Empty</h1>
            <p className="text-lg text-muted-foreground mb-8">Add some products to start comparing prices!</p>
            <Button
              className="bg-gradient-to-r from-primary to-secondary hover-glow"
              size="lg"
              onClick={() => router.push("/categories")}
            >
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Shopping Cart
          </h1>
          <p className="text-lg text-muted-foreground">{getTotalItems()} items • Optimized across all platforms</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Your Items</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => {
                  const product = products.find(
                    (p) =>
                      (p as any)._id === item.productKey ||
                      `${p.category}-${p.id}` === item.productKey ||
                      p.id === Number(item.productKey),
                  )
                  if (!product) return null
                  const lowestPrice = getLowestPrice(product.prices)

                  return (
                    <div
                      key={item.productKey}
                      className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-muted-foreground">Best price: ₹{lowestPrice}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-sm text-muted-foreground">Rating:</span>
                          <span className="text-sm font-medium">{product.rating}★</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productKey, item.quantity - 1)}
                          className="w-8 h-8 p-0 hover-glow bg-transparent"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>

                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productKey, Number.parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                          min="1"
                        />

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productKey, item.quantity + 1)}
                          className="w-8 h-8 p-0 hover-glow bg-transparent"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(item.productKey)}
                          className="w-8 h-8 p-0 text-red-500 hover:text-red-700 hover-glow bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {optimizedBasket && (
              <>
                <Card className="glassmorphism ring-2 ring-green-500 animate-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-600">
                      <Crown className="w-5 h-5" />
                      <span>Best Deal</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const bestPlatform = optimizedBasket.platformTotals.find(
                        (p: any) => p.platform === optimizedBasket.cheapestPlatform,
                      )
                      return (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: bestPlatform.platformColor }}
                            ></div>
                            <span className="font-semibold text-lg">{bestPlatform.platformName}</span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Total:</span>
                              <span className="font-bold text-xl">₹{bestPlatform.total}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Items:</span>
                              <span>{bestPlatform.availableItems}</span>
                            </div>
                            {optimizedBasket.totalSavings > 0 && (
                              <div className="flex justify-between text-green-600">
                                <span>You save:</span>
                                <span className="font-semibold">₹{optimizedBasket.totalSavings}</span>
                              </div>
                            )}
                          </div>

                          <Button
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover-glow"
                            onClick={() => openPlatformCheckout(bestPlatform.platform)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Checkout on {bestPlatform.platformName}
                          </Button>
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>

                <Card className="glassmorphism">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingDown className="w-5 h-5" />
                      <span>Platform Comparison</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {optimizedBasket.platformTotals
                      .sort((a: any, b: any) => {
                        if (a.isFullyAvailable && !b.isFullyAvailable) return -1
                        if (!a.isFullyAvailable && b.isFullyAvailable) return 1
                        return a.total - b.total
                      })
                      .map((platform: any) => (
                        <div
                          key={platform.platform}
                          className={`p-4 rounded-lg border transition-all ${
                            platform.platform === optimizedBasket.cheapestPlatform
                              ? "border-green-500 bg-green-50/50"
                              : "border-border hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: platform.platformColor }}
                              ></div>
                              <span className="font-semibold">{platform.platformName}</span>
                              {platform.platform === optimizedBasket.cheapestPlatform && (
                                <Badge className="bg-green-500 text-white">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Best
                                </Badge>
                              )}
                            </div>
                            <span className="font-bold">₹{platform.total}</span>
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                            <span>
                              Available: {platform.availableItems}/{platform.totalItems}
                            </span>
                            {platform.savings > 0 && <span className="text-red-500">+₹{platform.savings} vs best</span>}
                          </div>

                          {platform.unavailableItems.length > 0 && (
                            <div className="text-xs text-red-500 mb-2">
                              Unavailable: {platform.unavailableItems.map((item: any) => item.name).join(", ")}
                            </div>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full hover-glow bg-transparent"
                            onClick={() => openPlatformCheckout(platform.platform)}
                            disabled={!platform.isFullyAvailable}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {platform.isFullyAvailable ? `Go to ${platform.platformName}` : "Items Unavailable"}
                          </Button>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                <Card className="glassmorphism">
                  <CardContent className="p-4 space-y-3">
                    <Button variant="outline" className="w-full hover-glow bg-transparent">
                      Save for Later
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-500 hover:text-red-700 hover-glow bg-transparent"
                      onClick={() => clearCart()}
                    >
                      Clear Cart
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {optimizedBasket && (
          <div className="fixed bottom-4 left-4 right-4 lg:hidden glassmorphism p-4 rounded-lg hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">
                  Best:{" "}
                  {
                    optimizedBasket.platformTotals.find((p: any) => p.platform === optimizedBasket.cheapestPlatform)
                      ?.platformName
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  ₹
                  {
                    optimizedBasket.platformTotals.find((p: any) => p.platform === optimizedBasket.cheapestPlatform)
                      ?.total
                  }{" "}
                  • {getTotalItems()} items
                </div>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-secondary hover-glow"
                onClick={() =>
                  openPlatformCheckout(
                    optimizedBasket.platformTotals.find((p: any) => p.platform === optimizedBasket.cheapestPlatform)
                      ?.platform,
                  )
                }
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
