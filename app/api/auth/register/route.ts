import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createUser, findUserByEmail, findUserByUsername } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password } = body

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await findUserByEmail(email)
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      )
    }

    // Check if username already exists
    const existingUsername = await findUserByUsername(username)
    if (existingUsername) {
      return NextResponse.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const userId = await createUser(username, email, hashedPassword)

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: userId,
        username,
        email,
        status: "inactive",
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { success: false, message: "Registration failed. Please try again." },
      { status: 500 }
    )
  }
}
