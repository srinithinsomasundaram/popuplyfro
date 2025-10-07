import { NextRequest } from "next/server"
import { connectMongo } from "@/lib/mongoose"
import User from "@/models/user"
import { requireAuth } from "@/lib/middleware"
import { hashPassword, verifyPassword } from "@/lib/password"
import { generateTokenPair } from "@/lib/jwt"
import { successResponse, unauthorizedResponse, errorResponse } from "@/lib/response"

export const dynamic = "force-dynamic"

/**
 * POST /api/auth/change-password
 * Change user password and invalidate all sessions
 */
export async function POST(req: NextRequest) {
  try {
    await connectMongo()

    // Authenticate user
    const authUser = await requireAuth(req)
    if (!authUser) {
      return unauthorizedResponse("Please log in to continue")
    }

    const body = await req.json()
    const { currentPassword, newPassword } = body

    // Validation
    if (!currentPassword || !newPassword) {
      return errorResponse("Current password and new password are required", 400)
    }

    if (newPassword.length < 8) {
      return errorResponse("New password must be at least 8 characters long", 400)
    }

    // Get user with password hash
    const user = await User.findById(authUser.id).select("+passwordHash")
    if (!user) {
      return unauthorizedResponse("User not found")
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.passwordHash)
    if (!isValidPassword) {
      return errorResponse("Current password is incorrect", 401)
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update password and increment token version (invalidates all sessions)
    user.passwordHash = newPasswordHash
    user.refreshTokenVersion = (user.refreshTokenVersion || 0) + 1
    await user.save()

    // Generate new tokens with updated version
    const tokens = generateTokenPair(String(user._id), user.email, user.refreshTokenVersion)

    return successResponse(
      {
        message: "Password changed successfully",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      "Password updated. Please log in again with your new password."
    )
  } catch (error: any) {
    console.error("[API] POST /api/auth/change-password error:", error)
    return errorResponse(error.message || "Failed to change password", 500)
  }
}
