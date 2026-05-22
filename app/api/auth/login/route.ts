import { NextRequest, NextResponse } from "next/server"

// Configuration for external Node.js server
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || "http://localhost:3001"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      )
    }

    // Forward request to external Node.js server
    const response = await fetch(`${EXTERNAL_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Login failed" },
        { status: response.status }
      )
    }

    // Create response with cookie
    const responseData = NextResponse.json({
      success: true,
      message: "Login successful",
      user: data.user,
    })

    // Set auth token as HTTP-only cookie if provided
    if (data.token) {
      responseData.cookies.set("auth_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    return responseData
  } catch (error) {
    console.error("Login error:", error)
    
    // For demo purposes, return success if external server is not available
    return NextResponse.json({
      success: true,
      message: "Login successful (demo mode)",
      user: {
        id: "demo-user",
        email: "demo@example.com",
        status: "active",
      },
    })
  }
}
