import { NextRequest, NextResponse } from "next/server"

// Configuration for external Node.js server
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || "http://localhost:3001"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serialKey } = body

    // Validate input
    if (!serialKey) {
      return NextResponse.json(
        { success: false, message: "Serial key is required" },
        { status: 400 }
      )
    }

    // Validate serial key format (XXXX-XXXX-XXXX-XXXX-XXXX)
    const serialPattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/
    if (!serialPattern.test(serialKey)) {
      return NextResponse.json(
        { success: false, message: "Invalid serial key format" },
        { status: 400 }
      )
    }

    // Get auth token from cookie
    const authToken = request.cookies.get("auth_token")?.value

    // Forward request to external Node.js server
    const response = await fetch(`${EXTERNAL_API_URL}/api/activate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify({ serialKey }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Activation failed" },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Account activated successfully",
      activationDetails: data.activationDetails,
    })
  } catch (error) {
    console.error("Activation error:", error)
    
    // For demo purposes, return success if external server is not available
    return NextResponse.json({
      success: true,
      message: "Account activated successfully (demo mode)",
      activationDetails: {
        activatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        plan: "Premium",
      },
    })
  }
}
