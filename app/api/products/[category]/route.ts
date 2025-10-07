import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: Request, { params }: { params: { category: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("smart-compare")

    const products = await db.collection("products").find({ category: params.category }).toArray()

    return NextResponse.json(products)
  } catch (error) {
    console.error("[v0] Error fetching products by category:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
