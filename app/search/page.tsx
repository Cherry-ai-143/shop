"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GitCompare, Search } from "lucide-react"
import { type Product, platforms } from "@/lib/types"
import { getLowestPrice, getLowestPricePlatform } from "@/lib/utils/price-helpers"
import { useCompare } from "@/lib/contexts/compare-context"
import Link from "next/link"

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const { compareProducts, addToCompare, isInCompare } = useCompare()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const getProductId = (product: Product): string => {
    return product._id || `${product.category}-${product.id}`
  }

  useEffect(() => {
    if (query) {
      fetchSearchResults()
    }
  }, [query])

  const fetchSearchResults = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching search results:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Search Results
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {loading ? (
              "Searching..."
            ) : (
              <>
                Found <span className="font-semibold text-foreground">{products.length}</span> results for "
                <span className="font-semibold text-foreground">{query}</span>"
              </>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Searching products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="glassmorphism p-8 rounded-lg max-w-md mx-auto">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No products found</h2>
              <p className="text-muted-foreground mb-4">
                We couldn't find any products matching "{query}". Try searching with different keywords.
              </p>
              <Link href="/categories">
                <Button className="bg-gradient-to-r from-primary to-secondary">Browse Categories</Button>
              </Link>
            </div>
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
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary/90 text-white">{product.category}</Badge>
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

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  )
}
