import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Navigation } from "@/components/navigation"
import { Suspense } from "react"
import { CompareProvider } from "@/lib/contexts/compare-context"
import { CartProvider } from "@/lib/contexts/cart-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Smart Compare - Multi-Platform Shopping Assistant",
  description: "Compare prices and availability across Blinkit, Zepto, BigBasket, and JioMart in one place.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <CompareProvider>
          <CartProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Navigation />
              <main className="min-h-screen">{children}</main>
              <Analytics />
            </Suspense>
          </CartProvider>
        </CompareProvider>
      </body>
    </html>
  )
}
