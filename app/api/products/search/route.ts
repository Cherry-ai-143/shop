import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("smart-compare")

    // Search products by name or category (case-insensitive)
    const products = await db
      .collection("products")
      .find({
        $or: [{ name: { $regex: query, $options: "i" } }, { category: { $regex: query, $options: "i" } }],
      })
      .toArray()

    console.log("[v0] Search results for query:", query, "Found:", products.length)

    return NextResponse.json(products)
  } catch (error) {
    console.error("[v0] Error searching products:", error)
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 })
  }
}
