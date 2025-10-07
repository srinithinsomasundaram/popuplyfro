import { NextRequest } from "next/server"
import { connectMongo } from "@/lib/mongoose"
import User from "@/models/user"
import { requireAuth } from "@/lib/middleware"
import { successResponse, unauthorizedResponse, errorResponse } from "@/lib/response"

export const dynamic = "force-dynamic"

/**
 * GET /api/auth/me
 * Get current authenticated user's profile
 */
export async function GET(req: NextRequest) {
  try {
    await connectMongo()

    // Authenticate user
    const authUser = await requireAuth(req)
    if (!authUser) {
      return unauthorizedResponse("Please log in to continue")
    }

    // Get full user profile
    const user = await User.findById(authUser.id)
      .select("-passwordHash -refreshTokenVersion")
      .lean()

    if (!user) {
      return unauthorizedResponse("User not found")
    }

    // Format response to match frontend expectations
    return successResponse({
      id: String(user._id),
      email: user.email,
      name: user.name || user.fullName,
      firstName: user.name?.split(" ")[0] || "",
      lastName: user.name?.split(" ").slice(1).join(" ") || "",
      fullName: user.fullName || user.name,
      company: user.company,
      avatarUrl: user.avatarUrl,
      language: user.language || "en",
      tier: user.subscriptionTier || "free",
      status: user.subscriptionStatus || "active",
      role: user.role || "user",
      preferences: {
        emailNotifications: user.notificationPreferences?.email?.updatesAboutPopups ?? true,
        leadNotifications: user.notificationPreferences?.email?.leadNotifications ?? true,
        weeklyReports: user.notificationPreferences?.email?.weeklyReports ?? false,
        marketingEmails: user.notificationPreferences?.email?.marketingEmails ?? false,
      },
      lastSeen: user.lastSeen,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  } catch (error: any) {
    console.error("[API] GET /api/auth/me error:", error)
    return errorResponse(error.message || "Failed to fetch user profile", 500)
  }
}

/**
 * PATCH /api/auth/me
 * Update current user's profile
 */
export async function PATCH(req: NextRequest) {
  try {
    await connectMongo()

    // Authenticate user
    const authUser = await requireAuth(req)
    if (!authUser) {
      return unauthorizedResponse("Please log in to continue")
    }

    const body = await req.json()
    const { name, email, company, preferences } = body

    // Find user
    const user = await User.findById(authUser.id)
    if (!user) {
      return unauthorizedResponse("User not found")
    }

    // Update fields
    if (name !== undefined) {
      user.name = name
      user.fullName = name
    }
    if (email !== undefined && email !== user.email) {
      // Check if email is already taken
      const existing = await User.findOne({ email, _id: { $ne: user._id } })
      if (existing) {
        return errorResponse("Email already in use", 409)
      }
      user.email = email
    }
    if (company !== undefined) user.company = company

    // Update notification preferences
    if (preferences) {
      user.notificationPreferences = user.notificationPreferences || { email: {} }
      user.notificationPreferences.email = {
        updatesAboutPopups: preferences.emailNotifications ?? true,
        leadNotifications: preferences.leadNotifications ?? true,
        weeklyReports: preferences.weeklyReports ?? false,
        marketingEmails: preferences.marketingEmails ?? false,
      }
    }

    // Save changes
    await user.save()

    return successResponse(
      {
        id: String(user._id),
        email: user.email,
        name: user.name,
        company: user.company,
        preferences: {
          emailNotifications: user.notificationPreferences?.email?.updatesAboutPopups ?? true,
          leadNotifications: user.notificationPreferences?.email?.leadNotifications ?? true,
          weeklyReports: user.notificationPreferences?.email?.weeklyReports ?? false,
          marketingEmails: user.notificationPreferences?.email?.marketingEmails ?? false,
        },
      },
      "Profile updated successfully"
    )
  } catch (error: any) {
    console.error("[API] PATCH /api/auth/me error:", error)
    return errorResponse(error.message || "Failed to update profile", 500)
  }
}

/**
 * DELETE /api/auth/me
 * Delete current user's account (soft delete)
 */
export async function DELETE(req: NextRequest) {
  try {
    await connectMongo()

    // Authenticate user
    const authUser = await requireAuth(req)
    if (!authUser) {
      return unauthorizedResponse("Please log in to continue")
    }

    // Soft delete: you could set a deletedAt field or actually delete
    await User.findByIdAndDelete(authUser.id)

    // Also delete user's websites and popups
    const Website = (await import("@/models/website")).default
    const Popup = (await import("@/models/popup")).default

    await Website.deleteMany({ userId: authUser.id })
    await Popup.deleteMany({ userId: authUser.id })

    return successResponse({ ok: true }, "Account deleted successfully")
  } catch (error: any) {
    console.error("[API] DELETE /api/auth/me error:", error)
    return errorResponse(error.message || "Failed to delete account", 500)
  }
}
