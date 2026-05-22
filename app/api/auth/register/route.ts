import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { 
  createUser, 
  findUserByEmail, 
  findUserByUsername, 
  getSetting, 
  getTrialPlan, 
  createSubscription,
  updateUserStatus
} from "@/lib/db"

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

    // Check if auto-trial is enabled
    let autoTrialApplied = false
    try {
      const autoTrialEnabled = await getSetting("auto_trial_enabled")
      const autoTrialDays = await getSetting("auto_trial_days")

      if (autoTrialEnabled === "true" && autoTrialDays) {
        const trialPlan = await getTrialPlan()
        if (trialPlan) {
          await createSubscription(userId, trialPlan.id, null, parseInt(autoTrialDays), true)
          await updateUserStatus(userId, "active")
          autoTrialApplied = true
        }
      }
    } catch {
      // Settings table might not exist yet, continue without auto-trial
    }

    return NextResponse.json({
      success: true,
      message: autoTrialApplied 
        ? "Account created with trial subscription!" 
        : "Account created successfully",
      user: {
        id: userId,
        username,
        email,
        status: autoTrialApplied ? "active" : "inactive",
      },
      autoTrial: autoTrialApplied,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { success: false, message: "Registration failed. Please try again." },
      { status: 500 }
    )
  }
}
