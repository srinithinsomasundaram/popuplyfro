"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, ArrowRight } from "lucide-react"
import { Protected } from "@/components/auth-guard"

export default function WelcomePage() {
  const router = useRouter()

  return (
    <Protected>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="w-8 h-8 bg-[#3A8DFF] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-heading">Popuply</span>
            </Link>
          </div>
        </header>

        {/* Welcome Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border-gray-200 p-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-[#3A8DFF]/10 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-[#3A8DFF]" />
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-bold">👋 Welcome to Popuply</h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Set up your website popups in just 3 simple steps
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 space-y-4 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#3A8DFF] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Add Your Website</h3>
                    <p className="text-sm text-gray-600">Tell us which website you want to add popups to</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#3A8DFF] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Install Embed Code</h3>
                    <p className="text-sm text-gray-600">Copy and paste one line of code to your website</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#3A8DFF] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Start Creating</h3>
                    <p className="text-sm text-gray-600">Create your first popup from the dashboard</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => router.push("/onboarding/add-website")}
                className="w-full bg-[#3A8DFF] hover:bg-[#2d7ce6] text-white rounded-xl py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-sm text-gray-500">Takes less than 5 minutes to complete</p>
            </div>
          </Card>
        </div>
      </div>
    </Protected>
  )
}
