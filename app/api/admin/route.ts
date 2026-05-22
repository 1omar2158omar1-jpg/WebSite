import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { findUserById, getDashboardStats, getAllSettings, updateSetting } from "@/lib/db"

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
    const stats = await getDashboardStats()
    const settings = await getAllSettings()

    return NextResponse.json({
      success: true,
      stats,
      settings,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error("Admin dashboard error:", error)
    return NextResponse.json(
      { message: "Failed to load dashboard" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { key, value } = await request.json()

    if (!key) {
      return NextResponse.json({ message: "Setting key is required" }, { status: 400 })
    }

    await updateSetting(key, value)

    return NextResponse.json({
      success: true,
      message: "Setting updated successfully",
    })
  } catch (error) {
    console.error("Update setting error:", error)
    return NextResponse.json(
      { message: "Failed to update setting" },
      { status: 500 }
    )
  }
}
