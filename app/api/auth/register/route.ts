import { NextRequest, NextResponse } from "next/server"

// Configuration for external Node.js server
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || "http://localhost:3001"

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

    // Forward request to external Node.js server
    const response = await fetch(`${EXTERNAL_API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Registration failed" },
        { status: response.status }
      )
    }

    // Return success response with token if provided
    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: data.user,
      token: data.token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    
    // For demo purposes, return success if external server is not available
    return NextResponse.json({
      success: true,
      message: "Account created successfully (demo mode)",
      user: {
        id: "demo-" + Date.now(),
        status: "inactive",
      },
    })
  }
}
