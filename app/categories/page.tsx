"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Milk, Cookie, Coffee, Sparkles, Home, Apple, Cake, GitCompare } from "lucide-react"
import { type Product, platforms } from "@/lib/types"
import { getLowestPrice, getLowestPricePlatform } from "@/lib/utils/price-helpers"
import { useCompare } from "@/lib/contexts/compare-context"
import Link from "next/link"

const categories = [
  { id: "grocery", name: "Grocery", icon: ShoppingBag, color: "from-green-400 to-green-600" },
  { id: "dairy", name: "Dairy", icon: Milk, color: "from-blue-400 to-blue-600" },
  { id: "snacks", name: "Snacks", icon: Cookie, color: "from-orange-400 to-orange-600" },
  { id: "beverages", name: "Beverages", icon: Coffee, color: "from-purple-400 to-purple-600" },
  { id: "personal-care", name: "Personal Care", icon: Sparkles, color: "from-pink-400 to-pink-600" },
  { id: "household", name: "Household", icon: Home, color: "from-indigo-400 to-indigo-600" },
  { id: "fruits-vegetables", name: "Fruits & Vegetables", icon: Apple, color: "from-red-400 to-red-600" },
  { id: "bakery", name: "Bakery", icon: Cake, color: "from-yellow-400 to-yellow-600" },
]

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("grocery")
  const { compareProducts, addToCompare, isInCompare } = useCompare()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const getProductId = (product: Product): string => {
    return product._id || `${product.category}-${product.id}`
  }

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/${selectedCategory}`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Browse Categories
          </h1>
          <p className="text-lg text-muted-foreground">Discover products across all your favorite platforms</p>
        </div>

        {/* Category Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card
                key={category.id}
                className={`glassmorphism hover-glow transition-all duration-300 hover:scale-105 cursor-pointer ${
                  selectedCategory === category.id ? "ring-2 ring-accent" : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-card-foreground">{category.name}</h3>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const lowestPrice = getLowestPrice(product.prices)
              const lowestPricePlatform = getLowestPricePlatform(product.prices)
              const uniqueProductId = getProductId(product)

              return (
                <Card
                  key={uniqueProductId}
                  className="glassmorphism hover-glow transition-all duration-300 hover:scale-105"
                >
                  <CardContent className="p-6">
                    {/* Product Image */}
                    <div className="relative mb-4">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                        <span>⭐</span>
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <h3 className="font-semibold text-lg mb-4 text-card-foreground">{product.name}</h3>

                    {/* Platform Prices */}
                    <div className="space-y-2 mb-4">
                      {platforms.map((platform) => {
                        const price = product.prices[platform.id as keyof typeof product.prices]
                        const isAvailable = product.availability[platform.id as keyof typeof product.availability]
                        const isLowest = platform.id === lowestPricePlatform

                        return (
                          <div key={platform.name} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: platform.color }}></div>
                              <span className="text-sm font-medium">{platform.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {isAvailable ? (
                                <>
                                  <span className={`font-semibold ${isLowest ? "text-green-600" : "text-foreground"}`}>
                                    ₹{price}
                                  </span>
                                  {isLowest && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                      Lowest
                                    </Badge>
                                  )}
                                </>
                              ) : (
                                <span className="text-red-500 text-sm">Out of Stock</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Add to Compare Button - Disabled state based on unique product ID */}
                    <Button
                      onClick={() => addToCompare(product)}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover-glow"
                      disabled={isInCompare(uniqueProductId)}
                    >
                      <GitCompare className="w-4 h-4 mr-2" />
                      {isInCompare(uniqueProductId) ? "Added to Compare" : "Add to Compare"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Compare Summary */}
        {compareProducts.length > 0 && (
          <div className="fixed bottom-4 right-4 glassmorphism p-4 rounded-lg hover-glow">
            <div className="flex items-center space-x-2">
              <GitCompare className="w-5 h-5 text-primary" />
              <span className="font-semibold">{compareProducts.length} items to compare</span>
              <Link href="/compare">
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                  Compare Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
