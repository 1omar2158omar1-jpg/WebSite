import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { findUserById, getAllUsers, updateUserStatus, updateUserRole, deleteUser } from "@/lib/db"

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
    const users = await getAllUsers()
    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ message: "Failed to get users" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { userId, action, value } = await request.json()

    if (!userId || !action) {
      return NextResponse.json({ message: "User ID and action are required" }, { status: 400 })
    }

    // Prevent modifying own account for critical actions
    if (userId === admin.id && (action === "delete" || action === "role")) {
      return NextResponse.json({ message: "Cannot modify your own account" }, { status: 400 })
    }

    switch (action) {
      case "status":
        await updateUserStatus(userId, value)
        break
      case "role":
        // Only super_admin can change roles
        if (admin.role !== "super_admin") {
          return NextResponse.json({ message: "Only super admin can change roles" }, { status: 403 })
        }
        await updateUserRole(userId, value)
        break
      case "delete":
        await deleteUser(userId)
        break
      default:
        return NextResponse.json({ message: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `User ${action} updated successfully`,
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ message: "Failed to update user" }, { status: 500 })
  }
}
