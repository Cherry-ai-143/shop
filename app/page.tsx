import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Milk, Cookie, Coffee, Sparkles, Home, Apple, Cake } from "lucide-react"

const categories = [
  { name: "Grocery", icon: ShoppingBag, color: "from-green-400 to-green-600", popular: true },
  { name: "Dairy", icon: Milk, color: "from-blue-400 to-blue-600", popular: false },
  { name: "Snacks", icon: Cookie, color: "from-orange-400 to-orange-600", popular: true },
  { name: "Beverages", icon: Coffee, color: "from-purple-400 to-purple-600", popular: false },
  { name: "Personal Care", icon: Sparkles, color: "from-pink-400 to-pink-600", popular: false },
  { name: "Household", icon: Home, color: "from-indigo-400 to-indigo-600", popular: false },
  { name: "Fruits & Vegetables", icon: Apple, color: "from-red-400 to-red-600", popular: true },
  { name: "Bakery", icon: Cake, color: "from-yellow-400 to-yellow-600", popular: false },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted to-background py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 animate-float"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="animate-slide-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-glow">
              Smart Compare
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in-up animate-delay-200">
              Shop Smarter, Save Bigger
            </p>
            <p className="text-lg text-foreground mb-8 max-w-3xl mx-auto animate-fade-in-up animate-delay-300">
              Compare prices and availability across Blinkit, Zepto, BigBasket, and JioMart in one place.
            </p>
            <div className="animate-scale-in animate-delay-500">
              <Link href="/compare">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover-glow hover-lift text-lg px-8 py-4 rounded-xl animate-pulse-gentle"
                >
                  Start Comparing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Browse Categories</h2>
            <p className="text-lg text-muted-foreground">Discover products across all your favorite platforms</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Link key={category.name} href="/categories">
                  <Card
                    className={`group glassmorphism hover-glow hover-lift transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden animate-fade-in-up animate-delay-${index * 100}`}
                  >
                    {category.popular && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-secondary to-accent text-white text-xs px-2 py-1 rounded-full font-semibold animate-bounce-gentle">
                        Popular
                      </div>
                    )}
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:animate-float group-hover:rotate-3 transition-transform duration-300`}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-muted/50 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Why Choose Smart Compare?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShoppingBag,
                title: "Multi-Platform Comparison",
                description: "Compare prices across Blinkit, Zepto, BigBasket, and JioMart instantly",
                delay: "100",
              },
              {
                icon: Sparkles,
                title: "Smart Recommendations",
                description: "Get personalized suggestions based on your shopping patterns",
                delay: "200",
              },
              {
                icon: Coffee,
                title: "Real-time Availability",
                description: "Check product availability and delivery times in your area",
                delay: "300",
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card
                  key={index}
                  className={`glassmorphism hover-glow hover-lift transition-all duration-300 hover:scale-105 animate-fade-in-up animate-delay-${feature.delay}`}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center animate-float">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-card-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
