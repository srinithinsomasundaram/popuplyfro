"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"
import { apiPost, type ApiError } from "@/lib/api"
import { setTokens } from "@/lib/auth"
import { Guest } from "@/components/auth-guard"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const resp = await apiPost<{
        user: { id: string; email: string; tier?: string }
        accessToken: string
        refreshToken: string
      }>("/api/auth/register", { email, password })
      setTokens({ accessToken: resp.accessToken, refreshToken: resp.refreshToken })
      router.push("/onboarding/welcome")
    } catch (err) {
      const apiErr = err as ApiError
      setError(apiErr?.message || "Could not create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Guest redirectTo="/onboarding/welcome">
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="w-8 h-8 bg-[#3A8DFF] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-heading">Popuply</span>
            </Link>
          </div>
        </header>

        {/* Signup Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md bg-white rounded-2xl shadow-lg border-gray-200">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-3xl font-bold text-center">Create Account</CardTitle>
              <CardDescription className="text-center text-gray-500">
                Start creating stunning popups today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" placeholder="John Doe" className="rounded-xl border-gray-300" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="rounded-xl border-gray-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    className="rounded-xl border-gray-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    className="rounded-xl border-gray-300"
                    required
                  />
                </div>
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#3A8DFF] hover:bg-[#2d7ce6] text-white rounded-xl py-6 text-base shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                By signing up, you agree to our{" "}
                <Link href="/docs/terms" className="text-[#3A8DFF] hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/docs/privacy" className="text-[#3A8DFF] hover:underline">
                  Privacy Policy
                </Link>
              </div>

              <div className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-[#3A8DFF] hover:underline font-semibold">
                  Log in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Guest>
  )
}
