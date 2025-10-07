"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Copy, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { apiPost, type ApiError } from "@/lib/api"

export default function NewWebsitePage() {
  const [websiteName, setWebsiteName] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [created, setCreated] = useState<{ id: string; domain: string; name: string; apiKey?: string } | null>(null)
  const [embedCode, setEmbedCode] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        domain: websiteUrl.replace(/^https?:\/\//, "").replace(/\/+$/, ""),
        name: websiteName || websiteUrl,
      }
      const createdResp = await apiPost<{ website: any; embedCode?: string }>("/websites", payload)

      // Normalize shape whether backend returns website or plain object
      const website = (createdResp as any)?.website ?? (createdResp as any)
      setCreated({ id: website?.id, domain: website?.domain, name: website?.name, apiKey: website?.apiKey } as any)

      const base =
        (typeof window !== "undefined" && window.location.origin) ||
        (process.env.NEXT_PUBLIC_API_BASE_URL as string) ||
        "http://localhost:5000"

      const snippet =
        (createdResp as any)?.embedCode ||
        `<!-- Popuply Embed Code -->
<script src="${base}/embed.js" data-website-key="${website?.apiKey || website?.id}" async></script>
<!-- End Popuply Embed Code -->`

      setEmbedCode(snippet)
    } catch (e) {
      const apiErr = e as ApiError
      setError(apiErr?.message || "Failed to create website")
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = () => {
    if (!embedCode) return
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold">Add New Website</h2>
            <p className="text-gray-500 mt-1">Connect your website to start creating popups</p>
          </div>

          {/* Website Details */}
          <Card className="bg-white rounded-2xl shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle>Website Details</CardTitle>
              <CardDescription>Enter your website information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website-name">Website Name</Label>
                <Input
                  id="website-name"
                  placeholder="My Awesome Website"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  className="rounded-xl border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website-url">Website Domain or URL</Label>
                <Input
                  id="website-url"
                  placeholder="https://mywebsite.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="rounded-xl border-gray-300"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3 pt-2">
                <Button onClick={handleCreate} disabled={saving || !websiteUrl} className="rounded-xl">
                  {saving ? "Creating..." : "Create Website"}
                </Button>
                {created && (
                  <span className="text-sm text-gray-600 self-center">
                    Created: <span className="font-semibold">{created.domain}</span> (ID: {created.id})
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Embed Code */}
          {embedCode && (
            <Card className="bg-white rounded-2xl shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle>Installation Code</CardTitle>
                <CardDescription>Copy and paste this code into your website's {"<head>"} section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm">
                    <code>{embedCode}</code>
                  </pre>
                  <Button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 bg-[#007bff] hover:bg-[#0056b3] text-white rounded-lg"
                    size="sm"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>

                <div className="bg-[#ffd93d]/20 border border-[#ffd93d] rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> No verification needed. Once you add this code to your website, your popups
                    are ready to run immediately.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Setup Instructions */}
          <Card className="bg-white rounded-2xl shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle>Quick Setup Guide</CardTitle>
              <CardDescription>Follow these steps to install Popuply</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#007bff] text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Copy the embed code</h4>
                    <p className="text-sm text-gray-600">Click the "Copy Code" button above</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#007bff] text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Paste into your website</h4>
                    <p className="text-sm text-gray-600">
                      Add the code inside the {"<head>"} section of your HTML, before the closing {"</head>"} tag
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#007bff] text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">You're all set</h4>
                    <p className="text-sm text-gray-600">
                      After saving the changes on your site, return to your dashboard to create popups.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  Need help? Check out our{" "}
                  <Link href="/docs/setup" className="text-[#007bff] hover:underline font-semibold">
                    detailed setup guide
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full rounded-xl bg-transparent">
                Save for Later
              </Button>
            </Link>
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full bg-[#007bff] hover:bg-[#0056b3] text-white rounded-xl shadow-sm hover:shadow-md transition-all">
                Complete Setup
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
