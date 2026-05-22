import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { findUserById, getActiveSubscription } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    
    if (!token) {
      return NextResponse.json({ subscription: null })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
    const user = await findUserById(decoded.userId)
    
    if (!user) {
      return NextResponse.json({ subscription: null })
    }

    const subscription = await getActiveSubscription(user.id)

    return NextResponse.json({
      subscription: subscription ? {
        plan_name: subscription.plan_name,
        expires_at: subscription.expires_at,
        status: subscription.status,
        is_trial: subscription.is_trial,
      } : null,
      user: {
        id: user.id,
        username: user.username,
        status: user.status,
      }
    })
  } catch {
    return NextResponse.json({ subscription: null })
  }
}
