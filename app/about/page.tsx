import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, MapPin, TrendingDown, Users, Shield, Zap } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: ShoppingBag,
      title: "Multi-Product Comparison",
      description: "Compare prices across Blinkit, Zepto, BigBasket, and JioMart instantly with real-time data.",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: MapPin,
      title: "Location-Aware Availability",
      description: "Check product availability and delivery times specific to your area with pincode precision.",
      color: "from-green-400 to-green-600",
    },
    {
      icon: TrendingDown,
      title: "Basket Optimization",
      description: "Smart algorithms find the cheapest combination across platforms to maximize your savings.",
      color: "from-purple-400 to-purple-600",
    },
    {
      icon: Users,
      title: "User-Friendly Interface",
      description: "Intuitive design with smooth animations and responsive layout for seamless shopping experience.",
      color: "from-orange-400 to-orange-600",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with industry-standard security measures and privacy protocols.",
      color: "from-red-400 to-red-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance ensures quick comparisons and instant results for better decision making.",
      color: "from-yellow-400 to-yellow-600",
    },
  ]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-slide-in">
            About Smart Compare
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Revolutionizing the way you shop online by bringing together multiple e-commerce platforms in one
            intelligent comparison tool.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="glassmorphism mb-16 hover-glow">
          <CardContent className="p-8 md:p-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6 text-foreground">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                To empower consumers with the tools they need to make informed shopping decisions by providing
                transparent price comparisons, real-time availability, and intelligent basket optimization across
                India's leading e-commerce platforms.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Why Choose Smart Compare?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="glassmorphism hover-glow transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center animate-float`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-center text-card-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground text-center leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Platform Integration */}
        <Card className="glassmorphism mb-16 hover-glow">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Platform Integration</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { name: "Blinkit", color: "#FFD700", description: "10-minute grocery delivery" },
                { name: "Zepto", color: "#8B5CF6", description: "Ultra-fast delivery service" },
                { name: "BigBasket", color: "#10B981", description: "India's largest online supermarket" },
                { name: "JioMart", color: "#3B82F6", description: "Digital commerce platform" },
              ].map((platform) => (
                <div key={platform.name} className="text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: platform.color }}
                  >
                    {platform.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold mb-2 text-card-foreground">{platform.name}</h3>
                  <p className="text-sm text-muted-foreground">{platform.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <Card className="glassmorphism hover-glow">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Built with Modern Technology</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">Frontend</h3>
                <p className="text-muted-foreground">
                  Next.js, React, TypeScript, and Tailwind CSS for a responsive and interactive user experience.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">Design</h3>
                <p className="text-muted-foreground">
                  Glassmorphism effects, smooth animations, and modern UI components for an engaging interface.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">Performance</h3>
                <p className="text-muted-foreground">
                  Optimized algorithms and efficient data processing for lightning-fast price comparisons.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
