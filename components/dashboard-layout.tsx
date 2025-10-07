"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sparkles, Globe, Zap, BarChart3, CreditCard, Settings, LogOut, Crown, HelpCircle, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import useSWR from "swr"
import { apiGet } from "@/lib/api"
import { clearTokens } from "@/lib/auth"
import { Protected } from "@/components/auth-guard"
import { DashboardNotifications } from "@/components/dashboard-notifications"

const navigation = [
  { name: "Websites", href: "/dashboard", icon: Globe },
  { name: "Popups", href: "/dashboard/popups", icon: Zap },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { data: profile } = useSWR<{ user?: { email?: string; name?: string; subscriptionTier?: string } }>(
    "/user/profile",
    apiGet,
  )
  const userName = profile?.user?.name || profile?.user?.email || "User"
  const subTier = profile?.user?.subscriptionTier || "Free"

  useEffect(() => {
    if (typeof window !== "undefined" && pathname?.startsWith("/dashboard")) {
      localStorage.setItem("lastDashboardPath", pathname)
    }
  }, [pathname])

  return (
    <Protected>
      <div className="min-h-screen bg-gray-50">
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}

        <aside
          className={cn(
            "fixed left-0 top-0 z-50 h-screen w-64 border-r border-gray-200 bg-white transition-transform duration-300",
            "lg:translate-x-0",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#3A8DFF] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold font-heading">Popuply</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-gray-600 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive ? "bg-[#3A8DFF] text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* User Menu */}
            <div className="border-t border-gray-200 p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-3 px-2 hover:bg-gray-100">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#3A8DFF] text-white text-sm">
                        {userName?.slice(0, 2)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium text-sm">{userName}</span>
                      <span className="text-xs text-gray-500">{subTier} Plan</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-sm">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-sm" onClick={() => router.push("/dashboard/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-sm"
                    onClick={() => {
                      clearTokens()
                      router.replace("/login")
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </aside>

        <div className="lg:pl-64">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-lg lg:text-xl font-bold">Dashboard</h1>
                {/* Breadcrumb for secondary pages */}
                <nav aria-label="Breadcrumb" className="hidden md:block">
                  <ol className="flex items-center gap-2 text-xs text-gray-500">
                    {pathname
                      ?.split("/")
                      .filter(Boolean)
                      .map((seg, idx, arr) => {
                        const href = "/" + arr.slice(0, idx + 1).join("/")
                        const label = seg.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                        const isLast = idx === arr.length - 1
                        return (
                          <li key={href} className="inline-flex items-center gap-2">
                            {idx > 0 && <span className="text-gray-300">/</span>}
                            {isLast ? (
                              <span className="font-medium text-gray-700">{label}</span>
                            ) : (
                              <Link href={href} className="hover:text-gray-900">
                                {label}
                              </Link>
                            )}
                          </li>
                        )
                      })}
                  </ol>
                </nav>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <DashboardNotifications />
              <Link href="/docs/how-to-use" className="hidden sm:block">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 text-sm">
                  <HelpCircle className="mr-0 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Help</span>
                </Button>
              </Link>
              {/* Quick actions in top navbar */}
              <Link href="/dashboard/popups/new" className="hidden md:block">
                <Button variant="outline" className="rounded-xl text-sm bg-transparent">
                  Create Popup
                </Button>
              </Link>
              <Link href="/dashboard/websites/new" className="hidden md:block">
                <Button variant="outline" className="rounded-xl text-sm bg-transparent">
                  Add Website
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900 text-sm"
                onClick={() => {
                  clearTokens()
                  router.replace("/login")
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
              <Link href="/dashboard/billing">
                <Button className="bg-[#3A8DFF] hover:bg-[#2d7ce6] text-white rounded-xl shadow-sm hover:shadow-md transition-all text-xs lg:text-sm px-3 lg:px-4">
                  <Crown className="mr-0 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Upgrade to Pro</span>
                  <span className="sm:hidden">Pro</span>
                </Button>
              </Link>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </Protected>
  )
}
