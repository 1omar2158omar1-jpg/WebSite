import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { 
  findUserById, 
  getAllSubscriptions, 
  cancelSubscription, 
  extendSubscription,
  createSubscription,
  updateUserStatus,
  getAllPlans
} from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
    const user = await findUserById(decoded.userId)
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      return null
    }
    return user
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const subscriptions = await getAllSubscriptions()
    const plans = await getAllPlans()
    return NextResponse.json({ success: true, subscriptions, plans })
  } catch (error) {
    console.error("Get subscriptions error:", error)
    return NextResponse.json({ message: "Failed to get subscriptions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { userId, planId, days } = await request.json()

    if (!userId || !planId || !days) {
      return NextResponse.json({ message: "User ID, Plan ID and days are required" }, { status: 400 })
    }

    await createSubscription(userId, planId, null, days, false)
    await updateUserStatus(userId, "active")

    return NextResponse.json({
      success: true,
      message: "Subscription created successfully",
    })
  } catch (error) {
    console.error("Create subscription error:", error)
    return NextResponse.json({ message: "Failed to create subscription" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { subscriptionId, action, days } = await request.json()

    if (!subscriptionId || !action) {
      return NextResponse.json({ message: "Subscription ID and action are required" }, { status: 400 })
    }

    switch (action) {
      case "cancel":
        await cancelSubscription(subscriptionId)
        break
      case "extend":
        if (!days) {
          return NextResponse.json({ message: "Days required for extend" }, { status: 400 })
        }
        await extendSubscription(subscriptionId, days)
        break
      default:
        return NextResponse.json({ message: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Subscription ${action} successful`,
    })
  } catch (error) {
    console.error("Update subscription error:", error)
    return NextResponse.json({ message: "Failed to update subscription" }, { status: 500 })
  }
}
