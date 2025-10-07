"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Globe, CheckCircle2, Clock, Copy, Check, Trash2, BarChart3, Zap } from "lucide-react"
import { apiDelete, apiGet, type ApiError } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast" // toast on delete

type Website = {
  id: string
  domain: string
  name?: string
  status?: "active" | "paused" | "pending"
  apiKey?: string
}

export default function ManageWebsitePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const websiteId = params?.id
  const { toast } = useToast() // toast

  const {
    data: website,
    error,
    isLoading,
    mutate,
  } = useSWR<Website>(websiteId ? `/api/websites/${websiteId}` : null, apiGet)

  const [copied, setCopied] = useState(false)
  const embedBase =
    (typeof window !== "undefined" && window.location.origin) ||
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) ||
    "http://localhost:5000"

  const embedCode = useMemo(() => {
    const key = website?.apiKey || website?.id || "site_api_key"
    return ` Popuply Embed Code 
<script src="${embedBase}/public/embed.js" data-website-key="${key}" async></script>
 End Popuply Embed Code `
  }, [website?.apiKey, website?.id, embedBase])

  async function handleDeleteWebsite() {
    if (!websiteId) return
    if (!confirm("This will permanently delete this website and its popups. Continue?")) return
    try {
      await apiDelete(`/api/websites/${websiteId}`)
      toast({ title: "Website deleted", description: "The website and related popups were removed." }) //
      router.replace("/dashboard")
    } catch (e) {
      const err = e as ApiError
      toast({
        title: "Delete failed",
        description: err?.message || "Failed to delete website.",
        variant: "destructive",
      }) //
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3A8DFF]/20 to-[#5BA3FF]/10 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#3A8DFF]" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold">
                {isLoading ? "Loading website..." : website?.domain || "Website"}
              </h2>
              <p className="text-gray-600 text-sm">Manage settings and integration for this website</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/dashboard/popups?websiteId=${encodeURIComponent(websiteId || "")}`}>
              <Button variant="outline" className="rounded-xl bg-transparent text-sm">
                <Zap className="mr-2 h-4 w-4" />
                View Popups
              </Button>
            </Link>
            <Link href={`/dashboard/analytics?websiteId=${encodeURIComponent(websiteId || "")}`}>
              <Button variant="outline" className="rounded-xl bg-transparent text-sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* Website Details */}
        <Card className="bg-white rounded-2xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-xs text-gray-600">Domain</Label>
              <Input readOnly value={website?.domain || ""} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Website ID</Label>
              <Input readOnly value={website?.id || ""} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Status</Label>
              <div className="mt-2">
                <Badge
                  className={
                    website?.status === "active"
                      ? "bg-green-100 text-green-700 hover:bg-green-100 text-xs"
                      : website?.status === "pending"
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs"
                        : "bg-gray-100 text-gray-700 text-xs"
                  }
                >
                  {website?.status === "active" ? (
                    <>
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Verified
                    </>
                  ) : website?.status === "pending" ? (
                    <>
                      <Clock className="mr-1 h-3 w-3" />
                      Pending verification
                    </>
                  ) : (
                    <>Paused</>
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Embed Code */}
        <Card className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold mb-2">Embed Code</h3>
          <p className="text-sm text-gray-600 mb-4">
            Add this script to the {"<head>"} of <span className="font-semibold">{website?.domain || "your site"}</span>
          </p>

          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm">
              <code>{embedCode}</code>
            </pre>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(embedCode)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
              size="sm"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
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
        </Card>

        {/* Danger Zone */}
        <Card className="bg-white rounded-2xl shadow-sm border-2 border-red-200 p-6">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
            <div>
              <p className="font-semibold text-red-900">Delete Website</p>
              <p className="text-sm text-red-700">
                Permanently delete this website and all associated popups. This action cannot be undone.
              </p>
            </div>
            <Button variant="destructive" className="rounded-xl" onClick={handleDeleteWebsite} disabled={!websiteId}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Website
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
