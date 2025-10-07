import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SWRConfig } from "swr" // add global SWR config for caching/session UX
import { Toaster } from "@/components/ui/toaster" // global toaster provider
import { Suspense } from "react" // Import Suspense for useSearchParams
import "./globals.css"

export const metadata: Metadata = {
  title: "Popuply - Create Stunning Popups in Minutes",
  description: "Engage visitors, grow your sales, without code. Add beautiful, responsive popups to your website with just one line of code.",
  keywords: ["popups", "website popups", "email capture", "conversion optimization", "lead generation"],
  authors: [{ name: "Popuply Team" }],
  openGraph: {
    title: "Popuply - Create Stunning Popups in Minutes",
    description: "Engage visitors and grow your sales with beautiful, responsive popups.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SWRConfig value={{ revalidateOnFocus: false, dedupingInterval: 5000, shouldRetryOnError: true }}>
          <Suspense fallback={null}>
            {" "}
            {/* Wrap children in Suspense boundary */}
            {children}
          </Suspense>
        </SWRConfig>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
