"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "How to Use", href: "/docs/how-to-use" },
  { name: "Setup Guide", href: "/docs/setup" },
  { name: "Terms & Conditions", href: "/docs/terms" },
  { name: "Privacy Policy", href: "/docs/privacy" },
]

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#007bff] rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-heading">Popuply</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#007bff] hover:bg-[#0056b3] text-white rounded-xl">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="sticky top-24 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      isActive ? "bg-[#007bff] text-white" : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-3xl">{children}</main>
        </div>
      </div>
    </div>
  )
}
