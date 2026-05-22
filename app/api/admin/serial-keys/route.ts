import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { 
  findUserById, 
  getAllSerialKeys, 
  createSerialKey, 
  revokeSerialKey,
  generateSerialKey,
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
    const serialKeys = await getAllSerialKeys()
    const plans = await getAllPlans()
    return NextResponse.json({ success: true, serialKeys, plans })
  } catch (error) {
    console.error("Get serial keys error:", error)
    return NextResponse.json({ message: "Failed to get serial keys" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { planId, count = 1 } = await request.json()

    if (!planId) {
      return NextResponse.json({ message: "Plan ID is required" }, { status: 400 })
    }

    const generatedKeys: string[] = []
    for (let i = 0; i < Math.min(count, 100); i++) {
      const serialKey = generateSerialKey()
      await createSerialKey(serialKey, planId, admin.id)
      generatedKeys.push(serialKey)
    }

    return NextResponse.json({
      success: true,
      message: `${generatedKeys.length} serial key(s) generated`,
      keys: generatedKeys,
    })
  } catch (error) {
    console.error("Create serial key error:", error)
    return NextResponse.json({ message: "Failed to create serial key" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { serialKeyId, action } = await request.json()

    if (!serialKeyId || !action) {
      return NextResponse.json({ message: "Serial key ID and action are required" }, { status: 400 })
    }

    switch (action) {
      case "revoke":
        await revokeSerialKey(serialKeyId)
        break
      default:
        return NextResponse.json({ message: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Serial key revoked",
    })
  } catch (error) {
    console.error("Update serial key error:", error)
    return NextResponse.json({ message: "Failed to update serial key" }, { status: 500 })
  }
}
