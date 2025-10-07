import { NextRequest } from "next/server"
import { connectMongo } from "@/lib/mongoose"
import User from "@/models/user"
import { hashPassword } from "@/lib/password"
import { generateTokenPair } from "@/lib/jwt"
import { successResponse, errorResponse } from "@/lib/response"

export const dynamic = "force-dynamic"

/**
 * POST /api/auth/mock-login
 * TEMPORARY: Create a test user and return tokens for development
 * DELETE THIS IN PRODUCTION!
 */
export async function POST(req: NextRequest) {
  try {
    await connectMongo()

    const testEmail = "test@popuply.com"

    // Find or create test user
    let user = await User.findOne({ email: testEmail })

    if (!user) {
      console.log("[Mock] Creating test user...")
      const passwordHash = await hashPassword("Test123!")

      user = await User.create({
        email: testEmail,
        passwordHash,
        name: "Test User",
        fullName: "Test User Account",
        company: "Popuply Inc",
        subscriptionTier: "starter",
        subscriptionStatus: "active",
        role: "user",
        notificationPreferences: {
          email: {
            updatesAboutPopups: true,
            leadNotifications: true,
            weeklyReports: false,
            marketingEmails: false,
          },
        },
      })
      console.log("[Mock] Test user created:", user._id)
    }

    // Generate tokens
    const tokens = generateTokenPair(String(user._id), user.email, user.refreshTokenVersion || 0)

    return successResponse(
      {
        user: {
          id: String(user._id),
          email: user.email,
          name: user.name,
          tier: user.subscriptionTier,
          role: user.role,
        },
        ...tokens,
      },
      "Mock login successful. Use these tokens for testing."
    )
  } catch (error: any) {
    console.error("[API] POST /api/auth/mock-login error:", error)
    return errorResponse(error.message || "Failed to mock login", 500)
  }
}

/**
 * GET /api/auth/mock-login
 * Get mock login instructions
 */
export async function GET() {
  return successResponse({
    instructions: "POST to this endpoint to get test user tokens",
    testUser: {
      email: "test@popuply.com",
      password: "Test123!",
    },
    usage: `
      1. POST to /api/auth/mock-login
      2. Save the accessToken to localStorage.setItem('accessToken', token)
      3. Save the refreshToken to localStorage.setItem('refreshToken', token)
      4. Refresh the page
    `,
  })
}
