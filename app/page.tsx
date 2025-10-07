import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Zap, Layout, BarChart3, Sparkles, Target, Clock } from "lucide-react"
import { LandingNotification } from "@/components/landing-notification"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNotification />

      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#3A8DFF] rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-heading">Popuply</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link href="/docs/how-to-use" className="text-gray-600 hover:text-gray-900 transition-colors">
              Docs
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#3A8DFF] hover:bg-[#2d7ce6] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-[#3A8DFF]/10 rounded-full">
            <span className="text-[#3A8DFF] font-semibold text-sm uppercase tracking-wide">No Code Required</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            Create Stunning Popups in Minutes
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 mb-8 leading-relaxed text-pretty">
            Engage visitors, grow your sales, without code. Add beautiful, responsive popups to your website with just
            one line of code.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-[#3A8DFF] hover:bg-[#2d7ce6] text-white rounded-2xl px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Start Free
              </Button>
            </Link>
            <Link href="/docs/setup">
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl px-8 py-6 text-lg border-2 hover:bg-gray-50 bg-transparent"
              >
                View Setup Guide
              </Button>
            </Link>
          </div>

          {/* Mockup Preview */}
          <div className="mt-16 relative">
            <div className="bg-gray-100 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto border-2 border-[#3A8DFF]/20">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#3A8DFF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-8 h-8 text-[#3A8DFF]" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-lg mb-2">Get 20% Off Today!</h3>
                    <p className="text-gray-600 text-sm mb-4">Subscribe to our newsletter and get exclusive deals.</p>
                    <Button className="w-full bg-[#3A8DFF] hover:bg-[#2d7ce6] text-white rounded-xl">
                      Claim Discount
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-500">Powerful features to grow your business</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow border-gray-200">
              <CardHeader>
                <div className="w-12 h-12 bg-[#3A8DFF]/10 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-[#3A8DFF]" />
                </div>
                <CardTitle className="text-xl">Easy Setup</CardTitle>
                <CardDescription className="text-gray-500 leading-relaxed">
                  Add one line of code to your website and start creating popups instantly. No technical knowledge
                  required.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow border-gray-200">
              <CardHeader>
                <div className="w-12 h-12 bg-[#3A8DFF]/10 rounded-xl flex items-center justify-center mb-4">
                  <Layout className="w-6 h-6 text-[#3A8DFF]" />
                </div>
                <CardTitle className="text-xl">Ready Templates</CardTitle>
                <CardDescription className="text-gray-500 leading-relaxed">
                  Choose from beautiful pre-designed templates for newsletters, discounts, and announcements.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow border-gray-200">
              <CardHeader>
                <div className="w-12 h-12 bg-[#3A8DFF]/10 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-[#3A8DFF]" />
                </div>
                <CardTitle className="text-xl">Responsive Popups</CardTitle>
                <CardDescription className="text-gray-500 leading-relaxed">
                  Your popups look perfect on every device. Desktop, tablet, and mobile - all automatically optimized.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow border-gray-200">
              <CardHeader>
                <div className="w-12 h-12 bg-[#3A8DFF]/10 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-[#3A8DFF]" />
                </div>
                <CardTitle className="text-xl">Smart Triggers</CardTitle>
                <CardDescription className="text-gray-500 leading-relaxed">
                  Show popups on page load, scroll percentage, time delay, or exit intent. Perfect timing every time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow border-gray-200">
              <CardHeader>
                <div className="w-12 h-12 bg-[#3A8DFF]/10 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-[#3A8DFF]" />
                </div>
                <CardTitle className="text-xl">Analytics Dashboard</CardTitle>
                <CardDescription className="text-gray-500 leading-relaxed">
                  Track views, clicks, and conversion rates. Understand what works and optimize your popups.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow border-gray-200">
              <CardHeader>
                <div className="w-12 h-12 bg-[#3A8DFF]/10 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-[#3A8DFF]" />
                </div>
                <CardTitle className="text-xl">Live Preview</CardTitle>
                <CardDescription className="text-gray-500 leading-relaxed">
                  See your changes in real-time as you design. What you see is exactly what your visitors get.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-500">Start free, upgrade when you need more</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gray-100 rounded-2xl p-1.5">
              <button className="px-6 py-2.5 rounded-xl bg-white shadow-sm font-semibold text-gray-900 transition-all">
                Monthly
              </button>
              <button className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:text-gray-900 transition-all">
                Yearly <span className="text-[#3A8DFF] text-sm ml-1">(Save 15%)</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-8">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl mb-2">Free</CardTitle>
                <div className="mb-4">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
                <CardDescription className="text-gray-500">Forever free</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 Website only</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 Active Popup</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Basic Templates</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Basic Triggers</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Collect Name + Email</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Basic Analytics</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">CSV Export</span>
                </div>
                <div className="text-sm text-gray-500 italic pt-2">"Powered by Popuply" branding</div>
                <Link href="/signup" className="block pt-4">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl py-6 text-lg border-2 hover:bg-gray-50 bg-transparent"
                  >
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Starter Plan */}
            <Card className="bg-white rounded-2xl shadow-xl border-2 border-[#3A8DFF] p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3A8DFF] text-white px-4 py-1 rounded-full text-sm font-semibold">
                MOST POPULAR
              </div>
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl mb-2">Starter</CardTitle>
                <div className="mb-4">
                  <span className="text-5xl font-bold">$9</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
                <CardDescription className="text-gray-500">For small teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Up to 5 Websites</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Up to 20 Active Popups</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Advanced Templates</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Custom Branding</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Custom Form Fields</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Email Integrations</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Advanced Analytics</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Priority Email Support</span>
                </div>
                <Link href="/signup" className="block pt-4">
                  <Button className="w-full bg-[#3A8DFF] hover:bg-[#2d7ce6] text-white rounded-xl py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Growth Plan */}
            <Card className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-8">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl mb-2">Growth</CardTitle>
                <div className="mb-4">
                  <span className="text-5xl font-bold">$29</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
                <CardDescription className="text-gray-500">For agencies & businesses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited Websites</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited Popups</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">All Starter Features</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">A/B Testing Popups</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Team Access</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">API Access</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#3A8DFF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Premium 24/7 Support</span>
                </div>
                <Link href="/signup" className="block pt-4">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl py-6 text-lg border-2 hover:bg-gray-50 bg-transparent"
                  >
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#3A8DFF] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold font-heading">Popuply</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">Create stunning popups in minutes without code.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-gray-600 hover:text-gray-900 text-sm">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Documentation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs/how-to-use" className="text-gray-600 hover:text-gray-900 text-sm">
                    How to Use
                  </Link>
                </li>
                <li>
                  <Link href="/docs/setup" className="text-gray-600 hover:text-gray-900 text-sm">
                    Setup Guide
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs/terms" className="text-gray-600 hover:text-gray-900 text-sm">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/docs/privacy" className="text-gray-600 hover:text-gray-900 text-sm">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2025 Popuply. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
