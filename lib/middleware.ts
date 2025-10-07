import { NextRequest } from "next/server"
import { verifyAccessToken, TokenPayload } from "./jwt"
import User from "@/models/user"
import { connectMongo } from "./mongoose"

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    role: string
    tier: string
  }
}

export async function authenticate(request: NextRequest): Promise<TokenPayload | null> {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  const payload = verifyAccessToken(token)

  if (!payload) {
    return null
  }

  // Verify user exists and token version matches
  await connectMongo()
  const user = await User.findById(payload.userId).select("refreshTokenVersion").lean()

  if (!user || user.refreshTokenVersion !== payload.tokenVersion) {
    return null
  }

  return payload
}

export async function requireAuth(request: NextRequest) {
  const payload = await authenticate(request)

  if (!payload) {
    return null
  }

  // Get full user details
  const user = await User.findById(payload.userId)
    .select("email role subscriptionTier")
    .lean()

  if (!user) {
    return null
  }

  return {
    id: String(user._id),
    email: user.email,
    role: user.role || "user",
    tier: user.subscriptionTier || "free",
  }
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireAuth(request)

  if (!user || user.role !== "admin") {
    return null
  }

  return user
}
