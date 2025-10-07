"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, CreditCard, Calendar } from "lucide-react"

export default function BillingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")

  const starterPrice = billingPeriod === "monthly" ? 9 : Math.round(9 * 12 * 0.85)
  const growthPrice = billingPeriod === "monthly" ? 29 : Math.round(29 * 12 * 0.85)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold">Billing & Subscription</h2>
          <p className="text-gray-600 mt-1 text-sm">Manage your subscription and billing information</p>
        </div>

        <Card className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg lg:text-xl font-bold">Current Plan</h3>
                <Badge className="bg-gray-100 text-gray-700 text-xs">Free</Badge>
              </div>
              <p className="text-gray-600 text-sm">You are currently on the Free plan</p>
            </div>
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Crown className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-xs text-gray-600 mb-1">Websites</p>
              <p className="font-semibold text-sm">1 / 1</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Active Popups</p>
              <p className="font-semibold text-sm">1 / 1</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Branding</p>
              <p className="font-semibold text-sm">Powered by Popuply</p>
            </div>
          </div>
        </Card>

        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 lg:gap-3 bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`flex-1 sm:flex-none px-4 lg:px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                billingPeriod === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`flex-1 sm:flex-none px-4 lg:px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                billingPeriod === "yearly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly
              <span className="ml-2 text-xs text-green-600 font-semibold">Save 15%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Free Plan */}
          <Card className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
            <div className="mb-6">
              <h3 className="text-base lg:text-lg font-bold mb-2">Free</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl lg:text-3xl font-bold">$0</span>
                <span className="text-gray-600 text-sm">/month</span>
              </div>
              <p className="text-xs text-gray-600 mb-3">Forever Free</p>
              <Badge className="bg-green-100 text-green-700 text-xs">Current Plan</Badge>
            </div>

            <ul className="space-y-2.5 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">1 Website only</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">1 Active Popup</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Basic Templates</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Basic Triggers (on load, after X sec)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Collect Name + Email</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Basic Analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">CSV Export</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">"Powered by Popuply" branding</span>
              </li>
            </ul>

            <Button variant="outline" className="w-full rounded-xl py-5 text-sm bg-transparent" disabled>
              Current Plan
            </Button>
          </Card>

          {/* Starter Plan - MOST POPULAR */}
          <Card className="bg-white rounded-2xl shadow-xl border-2 border-[#3A8DFF] p-4 lg:p-6 relative lg:transform lg:scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-[#3A8DFF] to-[#5BA3FF] text-white px-4 py-1 text-xs">
                MOST POPULAR
              </Badge>
            </div>

            <div className="mb-6">
              <h3 className="text-base lg:text-lg font-bold mb-2">Starter</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl lg:text-3xl font-bold">${starterPrice}</span>
                <span className="text-gray-600 text-sm">/{billingPeriod === "monthly" ? "month" : "year"}</span>
              </div>
              <p className="text-xs text-gray-600 mb-3">For small teams</p>
            </div>

            <ul className="space-y-2.5 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Up to 5 Websites</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Up to 20 Active Popups</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Advanced Templates</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Custom Branding (remove Powered by Popuply)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Custom Form Fields</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Email Integrations (Mailchimp, Zapier, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Advanced Analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Priority Email Support</span>
              </li>
            </ul>

            <Button className="w-full bg-gradient-to-r from-[#3A8DFF] to-[#5BA3FF] hover:from-[#2d7ce6] hover:to-[#4a92ee] text-white rounded-xl py-5 text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Crown className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </Card>

          {/* Growth Plan */}
          <Card className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
            <div className="mb-6">
              <h3 className="text-base lg:text-lg font-bold mb-2">Growth</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl lg:text-3xl font-bold">${growthPrice}</span>
                <span className="text-gray-600 text-sm">/{billingPeriod === "monthly" ? "month" : "year"}</span>
              </div>
              <p className="text-xs text-gray-600 mb-3">For agencies & businesses</p>
            </div>

            <ul className="space-y-2.5 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Unlimited Websites</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Unlimited Popups</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">All Starter Features</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">A/B Testing Popups</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Team Access (multiple users)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">API Access</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Premium 24/7 Support</span>
              </li>
            </ul>

            <Button className="w-full bg-gradient-to-r from-[#3A8DFF] to-[#5BA3FF] hover:from-[#2d7ce6] hover:to-[#4a92ee] text-white rounded-xl py-5 text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Crown className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </Card>
        </div>

        {/* Payment Method */}
        <Card className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-bold mb-4">Payment Method</h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">No payment method added</p>
                <p className="text-xs text-gray-600">Add a payment method to upgrade to Pro</p>
              </div>
            </div>
            <Button variant="outline" className="w-full sm:w-auto rounded-xl bg-transparent text-sm">
              Add Payment Method
            </Button>
          </div>
        </Card>

        {/* Billing History */}
        <Card className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-bold mb-4">Billing History</h3>
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No billing history yet</p>
            <p className="text-xs mt-1">Your invoices will appear here once you upgrade</p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
