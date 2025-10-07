"use client"

import useSWR from "swr"
import Link from "next/link"
import { useMemo, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Sparkles,
  Eye,
  MousePointerClick,
  TrendingUp,
  MoreVertical,
  Copy,
  Pencil,
  Trash2,
  Flag,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiGet, apiPost, apiDelete, type ApiError } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function PopupsPage() {
  const router = useRouter()
  const params = useSearchParams()
  const { toast } = useToast()
  const { data: websitesRaw } = useSWR<any>("/api/websites", apiGet)
  const [websiteId, setWebsiteId] = useState<string | undefined>(params.get("websiteId") || undefined)

  function normalizeWebsites(input: any): Array<{ id: string; domain: string; name: string }> {
    if (Array.isArray(input)) return input
    if (!input) return []
    if (Array.isArray(input.websites)) return input.websites
    if (Array.isArray(input.data)) return input.data
    if (Array.isArray(input.items)) return input.items
    if (Array.isArray(input.results)) return input.results
    if (typeof input === "object") {
      const arr = Object.values(input).filter(
        (v: any) => v && typeof v === "object" && "id" in v && "domain" in v,
      ) as any[]
      if (arr.length) return arr as any
    }
    return []
  }

  const websites = normalizeWebsites(websitesRaw)

  useEffect(() => {
    if (!websiteId) {
      const fromParam = params.get("websiteId")
      if (fromParam) {
        setWebsiteId(fromParam)
      } else if (websites[0]?.id) {
        setWebsiteId(websites[0].id)
      }
    }
  }, [params, websiteId, websites])

  function normalizePopups(raw: any): Array<{
    id: string
    name: string
    status: "active" | "paused" | "draft"
    counters?: any
    type?: string
  }> {
    if (!raw) return []
    const arr = Array.isArray(raw)
      ? raw
      : Array.isArray(raw.popups)
        ? raw.popups
        : Array.isArray(raw.data)
          ? raw.data
          : Array.isArray(raw.items)
            ? raw.items
            : Array.isArray(raw.results)
              ? raw.results
              : []
    return arr.map((p: any) => ({
      id: String(p.id || p._id || p.popupId || ""),
      name: p.name || p.title || "Untitled Popup",
      status: (p.status || "draft") as "active" | "paused" | "draft",
      counters: p.counters || { views: p.views ?? 0, clicks: p.clicks ?? 0, conversions: p.conversions ?? 0 },
      type: p.type || p.variant || undefined,
    }))
  }

  async function fetchPopupsForWebsite(id: string) {
    const endpoints = [
      `/api/popups?websiteId=${encodeURIComponent(id)}`,
      `/api/websites/${id}/popups`,
      `/api/popups/${encodeURIComponent(id)}`,
    ]

    let lastError: any = null
    for (const url of endpoints) {
      try {
        const res = await apiGet<any>(url)
        const normalized = normalizePopups(res)
        return normalized
      } catch (err: any) {
        lastError = err
        const status = (err as ApiError)?.status
        if (status === 401) throw err
        continue
      }
    }
    throw lastError
  }

  const {
    data: popupsRaw,
    error,
    isLoading,
    mutate,
  } = useSWR(websiteId ? ["popups", websiteId] : null, () => fetchPopupsForWebsite(websiteId!))

  const popups =
    Array.isArray(popupsRaw) && popupsRaw.length > 0 && typeof popupsRaw[0] === "object" && "id" in popupsRaw[0]
      ? (popupsRaw as Array<{
          id: string
          name: string
          status: "active" | "paused" | "draft"
          counters?: any
          type?: string
        }>)
      : normalizePopups(popupsRaw)

  const currentWebsite = useMemo(() => websites.find((w) => w.id === websiteId), [websites, websiteId])

  const handleEditPopup = (popupId: string) => {
    router.push(`/dashboard/popups/${popupId}/edit`)
  }

  const handleDuplicatePopup = async (popupId: string) => {
    try {
      await apiPost(`/api/popups/${popupId}/duplicate`, {})
      toast({
        title: "Success",
        description: "Popup duplicated successfully",
      })
      mutate()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to duplicate popup",
        variant: "destructive",
      })
    }
  }

  const handleReportPopup = async (popupId: string) => {
    try {
      await apiPost(`/api/popups/${popupId}/report`, {})
      toast({
        title: "Reported",
        description: "Thanks for your report — we'll review it shortly.",
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to report popup",
        variant: "destructive",
      })
    }
  }

  const handleDeletePopup = async (popupId: string) => {
    if (!confirm("Are you sure you want to delete this popup? This action cannot be undone.")) {
      return
    }

    try {
      await apiDelete(`/api/popups/${popupId}`)
      toast({
        title: "Success",
        description: "Popup deleted successfully",
      })
      mutate()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to delete popup",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold">Popups</h2>
            {/* Website selector */}
            <Select
              value={websiteId}
              onValueChange={(val) => {
                setWebsiteId(val)
                router.replace(`/dashboard/popups?websiteId=${encodeURIComponent(val)}`)
              }}
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select website" />
              </SelectTrigger>
              <SelectContent>
                {websites.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Link href="/dashboard/popups/new">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-[#3A8DFF] to-[#5BA3FF] hover:from-[#2d7ce6] hover:to-[#4a92ee] text-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <Plus className="mr-2 h-4 w-4" />
              Create Popup
            </Button>
          </Link>
        </div>

        {/* Popups List */}
        <Card className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold">
              {currentWebsite ? `All Popups • ${currentWebsite.domain}` : "All Popups"}
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {!websiteId ? (
              <div className="p-6 text-sm text-gray-600">Select a website to view its popups.</div>
            ) : isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#3A8DFF] to-[#5BA3FF] bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#3A8DFF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-semibold text-base sm:text-lg truncate">Popup Name</h4>
                          <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                            Status
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Type
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">Website Domain</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-4 sm:gap-8">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-gray-600 mb-1">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs">Views</span>
                        </div>
                        <div className="font-semibold text-sm sm:text-base text-[#3A8DFF]">0</div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center gap-1 text-gray-600 mb-1">
                          <MousePointerClick className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs">Clicks</span>
                        </div>
                        <div className="font-semibold text-sm sm:text-base text-[#3A8DFF]">0</div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center gap-1 text-gray-600 mb-1">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs">Rate</span>
                        </div>
                        <div className="font-semibold text-sm sm:text-base text-[#3A8DFF]">0%</div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Flag className="mr-2 h-4 w-4" />
                            Report
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-6 text-sm text-red-600">
                {(error as ApiError)?.status === 401
                  ? "Please log in to view popups."
                  : `Failed to load popups: ${(error as any)?.message || "Unknown error"}`}
              </div>
            ) : (popups?.length || 0) === 0 ? (
              <div className="p-6 text-sm text-gray-600">No popups yet. Create your first popup!</div>
            ) : (
              popups!.map((popup) => (
                <div key={popup.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#3A8DFF] to-[#5BA3FF] bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#3A8DFF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-semibold text-base sm:text-lg truncate">{popup.name}</h4>
                          <Badge
                            variant={popup.status === "active" ? "default" : "secondary"}
                            className={
                              popup.status === "active"
                                ? "bg-green-100 text-green-700 hover:bg-green-100 text-xs"
                                : "bg-gray-100 text-gray-700 text-xs"
                            }
                          >
                            {popup.status}
                          </Badge>
                          {popup.type ? (
                            <Badge variant="outline" className="text-xs">
                              {popup.type}
                            </Badge>
                          ) : null}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{currentWebsite?.domain}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-4 sm:gap-8">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-gray-600 mb-1">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs">Views</span>
                        </div>
                        <div className="font-semibold text-sm sm:text-base text-[#3A8DFF]">
                          {popup?.counters?.views ?? 0}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center gap-1 text-gray-600 mb-1">
                          <MousePointerClick className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs">Clicks</span>
                        </div>
                        <div className="font-semibold text-sm sm:text-base text-[#3A8DFF]">
                          {popup?.counters?.clicks ?? 0}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center gap-1 text-gray-600 mb-1">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs">Rate</span>
                        </div>
                        <div className="font-semibold text-sm sm:text-base text-[#3A8DFF]">
                          {popup?.counters?.conversions && popup?.counters?.views
                            ? Math.round((popup.counters.conversions / Math.max(1, popup.counters.views)) * 1000) / 10
                            : 0}
                          %
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditPopup(popup.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicatePopup(popup.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReportPopup(popup.id)}>
                            <Flag className="mr-2 h-4 w-4" />
                            Report
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePopup(popup.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Free Plan Notice */}
        <Card className="bg-yellow-50 border-yellow-200 rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base sm:text-lg mb-2">Free Plan Limit</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4">
                You can only have 1 active popup at a time on the Free plan. Upgrade to Pro to create unlimited popups
                and unlock advanced features!
              </p>
              <Link href="/dashboard/billing">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-[#3A8DFF] to-[#5BA3FF] hover:from-[#2d7ce6] hover:to-[#4a92ee] text-white rounded-xl">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
