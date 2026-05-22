import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { 
  findSerialKey, 
  useSerialKey, 
  createSubscription, 
  updateUserStatus,
  findUserById 
} from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "luxury-services-secret-key"

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
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      )
    }

    // Verify token and get user ID
    let userId: number
    try {
      const decoded = jwt.verify(authToken, JWT_SECRET) as { userId: number }
      userId = decoded.userId
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired session" },
        { status: 401 }
      )
    }

    // Find the serial key
    const keyData = await findSerialKey(serialKey)
    if (!keyData) {
      return NextResponse.json(
        { success: false, message: "Invalid serial key" },
        { status: 400 }
      )
    }

    // Check if key is available
    if (keyData.status !== "available") {
      return NextResponse.json(
        { success: false, message: "This serial key has already been used" },
        { status: 400 }
      )
    }

    // Use the serial key
    await useSerialKey(keyData.id, userId)

    // Create subscription
    await createSubscription(userId, keyData.plan_id, keyData.id, keyData.duration_days)

    // Update user status to active
    await updateUserStatus(userId, "active")

    // Get user info
    const user = await findUserById(userId)

    // Calculate expiration date
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + keyData.duration_days)

    return NextResponse.json({
      success: true,
      message: "Account activated successfully",
      activationDetails: {
        plan: keyData.plan_name,
        duration: keyData.duration_days,
        activatedAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        username: user?.username,
      },
    })
  } catch (error) {
    console.error("Activation error:", error)
    return NextResponse.json(
      { success: false, message: "Activation failed. Please try again." },
      { status: 500 }
    )
  }
}
