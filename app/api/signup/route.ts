import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    console.log("Signup request received:", { name, email, password: "[HIDDEN]" })

    // Validate input
    if (!name || !email || !password) {
      console.log("Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 6) {
      console.log("Password too short")
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    console.log("Connecting to MongoDB...")
    const client = await clientPromise
    const db = client.db("smart-compare")
    console.log("Connected to database")

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      console.log("User already exists:", email)
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    console.log("Hashing password...")
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    }

    console.log("Inserting user into database...")
    const result = await db.collection("users").insertOne(user)
    console.log("User inserted successfully:", result.insertedId)
    console.log("Insertion result:", result)

    return NextResponse.json({
      message: "User created successfully",
      userId: result.insertedId
    }, { status: 201 })

  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
