"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Copy, Check, Code } from "lucide-react"
import { Protected } from "@/components/auth-guard"

type EmbedInfo = {
  id: string
  embedUrl: string
  websiteKey: string
  embedSnippet?: string
  domain?: string
  name?: string
}

export default function EmbedCodePage() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [embed, setEmbed] = useState<EmbedInfo | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = sessionStorage.getItem("popuply_last_embed")
    if (raw) {
      try {
        setEmbed(JSON.parse(raw))
      } catch {
        // ignore
      }
    }
  }, [])

  const embedCode =
    embed?.embedSnippet ||
    (embed?.embedUrl && embed?.websiteKey
      ? `<script src="${embed.embedUrl}" data-website-key="${embed.websiteKey}" async></script>`
      : `<script src="https://YOUR_APP/public/embed.js" data-website-key="WEBSITE_KEY" async></script>`)

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerify = async () => {
    router.push("/dashboard")
  }

  const handleSkip = () => {
    router.push("/dashboard")
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
              <span className="font-semibold text-[#3A8DFF]">Step 2</span>
              <span>of 3</span>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className="bg-[#3A8DFF] h-1 transition-all duration-300" style={{ width: "66%" }} />
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border-gray-200 p-8">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-[#3A8DFF]/10 rounded-2xl flex items-center justify-center">
                    <Code className="w-8 h-8 text-[#3A8DFF]" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold">Install Embed Code</h1>
                <p className="text-gray-600">Paste this script inside the {"<head>"} tag of your website</p>
              </div>

              {embed ? (
                <div className="space-y-4">
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto text-sm leading-relaxed">
                      <code>{embedCode}</code>
                    </pre>
                    <Button
                      onClick={handleCopy}
                      className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-lg"
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

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Installation Instructions:</h3>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Copy the code above</li>
                      <li>Open your website's HTML file or template</li>
                      <li>Paste the code inside the {"<head>"} section</li>
                      <li>Save and publish your changes</li>
                    </ol>
                  </div>

                  <div className="text-center text-sm text-gray-600">
                    <p>
                      Need help?{" "}
                      <Link href="/docs/setup" className="text-[#3A8DFF] hover:underline font-semibold">
                        View detailed setup guide
                      </Link>
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-900">
                    No recent website found. Please add a website first to generate your unique embed code.
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => router.push("/onboarding/add-website")} className="rounded-xl">
                      Go to Add Website
                    </Button>
                    <Link href="/docs/setup">
                      <Button variant="outline" className="rounded-xl bg-transparent">
                        View Setup Guide
                      </Button>
                    </Link>
                  </div>
                </>
              )}

              {/* Footer Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/onboarding/add-website")}
                  className="flex-1 rounded-xl py-6"
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerify}
                  disabled={false}
                  className="flex-1 bg-[#3A8DFF] hover:bg-[#2d7ce6] text-white rounded-xl py-6 shadow-lg hover:shadow-xl transition-all"
                >
                  Continue
                </Button>
              </div>

              <div className="text-center">
                <Button variant="ghost" onClick={handleSkip} className="text-gray-600 hover:text-gray-900">
                  Skip for Now →
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Protected>
  )
}
