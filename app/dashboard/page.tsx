"use client"

import useSWR from "swr"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, CheckCircle2, Clock, Plus, Sparkles } from "lucide-react"
import { apiGet, type ApiError } from "@/lib/api"

export default function DashboardPage() {
  const { data: profile } = useSWR<{ user?: { email?: string; name?: string } }>("/api/auth/me", apiGet)
  const {
    data: websites,
    error: sitesError,
    isLoading,
  } = useSWR<Array<{ id: string; domain: string; name: string; status: "active" | "paused" | "pending" }>>(
    "/api/websites",
    apiGet,
  )

  const fallbackWebsite = {
    id: "68df76d9518a08dc5b9a000e",
    domain: "yesptech.in",
    name: "yesptech.in",
    status: "active" as const,
  }

  const websitesToShow =
    websites && Array.isArray(websites) && websites.length > 0
      ? websites.some((w) => w.domain === "yesptech.in")
        ? websites
        : [...websites, fallbackWebsite]
      : [fallbackWebsite]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold">
              Welcome back
              {profile?.user?.name ? `, ${profile.user.name}` : profile?.user?.email ? `, ${profile.user.email}` : ""}!
            </h2>
            <p className="text-gray-500 mt-1 text-sm">Here's what's happening with your popups today.</p>
          </div>
        </div>

        {/* Your Websites */}
        <Card className="bg-white rounded-2xl shadow-sm border-gray-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-base lg:text-lg">Your Websites</CardTitle>
                <CardDescription className="text-gray-500 text-sm">Manage your connected websites</CardDescription>
              </div>
              <Link href="/dashboard/websites/new">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-[#3A8DFF] to-[#5BA3FF] hover:from-[#2d7ce6] hover:to-[#4a92ee] text-white rounded-xl shadow-sm hover:shadow-md transition-all text-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Website
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-sm text-gray-500 py-4">Loading websites...</div>
            ) : sitesError ? (
              <div className="text-sm text-red-600 py-4">
                {(sitesError as ApiError)?.status === 401 ? "Please log in to view your websites." : "Failed to load."}
              </div>
            ) : (websitesToShow?.length || 0) > 0 ? (
              <div className="space-y-4">
                {websitesToShow.map((site) => (
                  <div
                    key={site.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#3A8DFF] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#3A8DFF]/20 to-[#5BA3FF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Globe className="w-6 h-6 text-[#3A8DFF]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{site.domain}</h3>
                        <p className="text-xs text-gray-500">Website ID: {site.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          site.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100 text-xs"
                            : site.status === "pending"
                              ? "bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs"
                              : "bg-gray-100 text-gray-700 text-xs"
                        }
                      >
                        {site.status === "active" ? (
                          <>
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Verified
                          </>
                        ) : site.status === "pending" ? (
                          <>
                            <Clock className="mr-1 h-3 w-3" />
                            Pending verification
                          </>
                        ) : (
                          <>Paused</>
                        )}
                      </Badge>
                      <Link href={`/dashboard/websites/${site.id}`}>
                        <Button variant="outline" size="sm" className="rounded-lg bg-transparent text-xs">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No websites yet. Add your first website to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Your Popups (summary) */}
        <Card className="bg-white rounded-2xl shadow-sm border-gray-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-base lg:text-lg">Your Popups</CardTitle>
                <CardDescription className="text-gray-500 text-sm">
                  Create and manage your popups per website
                </CardDescription>
              </div>
              <Link href="/dashboard/popups/new">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-[#3A8DFF] to-[#5BA3FF] hover:from-[#2d7ce6] hover:to-[#4a92ee] text-white rounded-xl shadow-sm hover:shadow-md transition-all text-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Popup
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">View and manage popups by selecting a website on the Popups page.</p>
              <Link href="/dashboard/popups">
                <Button variant="outline" size="sm" className="mt-4 rounded-lg bg-transparent text-xs">
                  Go to Popups
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
