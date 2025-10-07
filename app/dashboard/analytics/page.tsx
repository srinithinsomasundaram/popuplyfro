"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { apiGet, type ApiError } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton" // skeletons for charts/table

type Website = { id: string; domain: string; name: string }
type AnalyticsResponse = {
  series: Array<{ date: string; views: number; clicks: number }>
  breakdown: Array<{
    popupId: string
    popupName: string
    websiteDomain: string
    views: number
    clicks: number
    ctr: number
  }>
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<"7days" | "30days" | "90days">("7days")
  const [websiteId, setWebsiteId] = useState<string | "all">("all")

  const { data: websitesRaw } = useSWR<any>("/websites", apiGet)

  function normalizeWebsites(input: any): Array<Website> {
    if (Array.isArray(input)) return input as Website[]
    if (!input) return []
    if (Array.isArray(input.websites)) return input.websites
    if (Array.isArray(input.data)) return input.data
    if (Array.isArray(input.items)) return input.items
    if (Array.isArray(input.results)) return input.results
    if (typeof input === "object") {
      const arr = Object.values(input).filter(
        (v: any) => v && typeof v === "object" && "id" in v && "domain" in v,
      ) as any[]
      if (arr.length) return arr as Website[]
    }
    return []
  }

  const websites = normalizeWebsites(websitesRaw)

  const key = useMemo(() => {
    const params = new URLSearchParams()
    params.set("range", range)
    if (websiteId !== "all") params.set("websiteId", websiteId)
    return `/analytics?${params.toString()}`
  }, [range, websiteId])
  const { data, error, isLoading } = useSWR<AnalyticsResponse>(key, apiGet)

  const handleExportCSV = () => {
    const header = ["Date", "Views", "Clicks", "CTR"]
    const rows = (data?.series || []).map((r) => [
      r.date,
      r.views,
      r.clicks,
      `${r.views ? ((r.clicks / r.views) * 100).toFixed(1) : "0.0"}%`,
    ])
    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `popuply-analytics-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const chartConfig = {
    views: { label: "Views", color: "#007bff" },
    clicks: { label: "Clicks", color: "#ffd93d" },
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold">Popup Performance</h2>
            <p className="text-gray-500 mt-1 text-sm">Track your popup metrics and conversions</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="rounded-xl border-gray-300 hover:border-[#3A8DFF] transition-all text-sm bg-transparent"
              disabled={isLoading || !!error}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Select value={range} onValueChange={(v) => setRange(v as any)}>
              <SelectTrigger className="w-40 rounded-xl border-gray-300 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Select value={websiteId} onValueChange={(v) => setWebsiteId(v)}>
              <SelectTrigger className="w-48 rounded-xl border-gray-300 text-sm">
                <SelectValue placeholder="All Websites" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Websites</SelectItem>
                {websites.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chart */}
        <Card className="bg-white rounded-2xl shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle>Views & Clicks Over Time</CardTitle>
            <CardDescription>Daily performance metrics for your popups</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3 py-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-80 w-full rounded-xl" />
              </div>
            ) : error ? (
              <div className="text-sm text-red-600 py-4">
                {(error as ApiError)?.status === 401 ? "Please log in to view analytics." : "Failed to load analytics."}
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.series || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="views" fill="#007bff" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="clicks" fill="#ffd93d" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Popup Performance Table */}
        <Card className="bg-white rounded-2xl shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle>Popup Breakdown</CardTitle>
            <CardDescription>Individual performance for each popup</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2 py-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
              </div>
            ) : error ? (
              <div className="text-sm text-red-600 py-4">Failed to load breakdown.</div>
            ) : (data?.breakdown?.length || 0) === 0 ? (
              <div className="text-sm text-gray-500 py-4">No data for the selected filters.</div>
            ) : (
              <div className="space-y-2">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 pb-3 border-b border-gray-200 text-sm font-semibold text-gray-600">
                  <div className="col-span-2">Popup Name</div>
                  <div className="text-center">Views</div>
                  <div className="text-center">Clicks</div>
                  <div className="text-center">CTR</div>
                </div>

                {/* Rows */}
                {(data?.breakdown || []).map((row) => (
                  <div key={row.popupId} className="grid grid-cols-5 gap-4 py-3 border-b border-gray-100 items-center">
                    <div className="col-span-2">
                      <div className="font-semibold">{row.popupName}</div>
                      <div className="text-sm text-gray-500">{row.websiteDomain}</div>
                    </div>
                    <div className="text-center font-semibold text-[#007bff]">{row.views.toLocaleString()}</div>
                    <div className="text-center font-semibold text-[#007bff]">{row.clicks.toLocaleString()}</div>
                    <div className="text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        {`${(row.ctr * 100).toFixed(0)}%`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
