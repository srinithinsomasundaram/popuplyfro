"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, ArrowRight, Globe } from "lucide-react"
import { Protected } from "@/components/auth-guard"
import { apiPost, type ApiError } from "@/lib/api"

export default function AddWebsitePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [websiteName, setWebsiteName] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [error, setError] = useState<string | null>(null)

  function toDomain(input: string) {
    try {
      const u = new URL(input)
      return u.hostname
    } catch {
      return input.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const domain = toDomain(websiteUrl)
      const resp = await apiPost<{
        website: { id: string; domain: string }
        embed: { embedUrl: string; websiteKey: string; embedSnippet: string }
      }>("/websites", { domain })

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "popuply_last_embed",
          JSON.stringify({ id: resp.website.id, ...resp.embed, domain: resp.website.domain, name: websiteName }),
        )
      }
      router.push("/onboarding/embed-code")
    } catch (err) {
      const apiErr = err as ApiError
      setError(apiErr?.message || "Could not add website")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Protected>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#3A8DFF] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-heading">Popuply</span>
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold text-[#3A8DFF]">Step 1</span>
              <span>of 3</span>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className="bg-[#3A8DFF] h-1 transition-all duration-300" style={{ width: "33%" }} />
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-xl bg-white rounded-2xl shadow-lg border-gray-200 p-8">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-[#3A8DFF]/10 rounded-2xl flex items-center justify-center">
                    <Globe className="w-8 h-8 text-[#3A8DFF]" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold">Add Your Website</h1>
                <p className="text-gray-600">Tell us which website you want to add popups to</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="websiteName">Website Name (Optional)</Label>
                  <Input
                    id="websiteName"
                    type="text"
                    placeholder="My Awesome Store"
                    value={websiteName}
                    onChange={(e) => setWebsiteName(e.target.value)}
                    className="rounded-xl"
                  />
                  <p className="text-xs text-gray-500">A friendly name to identify your website</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">
                    Website URL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    placeholder="https://example.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="rounded-xl"
                    required
                  />
                  <p className="text-xs text-gray-500">The full URL of your website including https://</p>
                </div>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/onboarding/welcome")}
                    className="flex-1 rounded-xl py-6"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !websiteUrl}
                    className="flex-1 bg-[#3A8DFF] hover:bg-[#2d7ce6] text-white rounded-xl py-6 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save & Continue"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </Protected>
  )
}
