"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { SubscriptionUpgradeDialog } from "@/components/subscription-upgrade-dialog"
import { ArrowLeft, Monitor, Tablet, Smartphone, Eye, Mail, Tag, Megaphone, FileText, X } from "lucide-react"
import Link from "next/link"
import { apiPost, apiGet } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import useSWR from "swr"

const TEMPLATES = {
  blank: {
    title: "Welcome!",
    description: "Enter your message here.",
    buttonText: "Submit",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    buttonColor: "#3A8DFF",
    showNameField: false,
    showEmailField: false,
  },
  newsletter: {
    title: "Subscribe to Our Newsletter",
    description: "Get the latest updates, exclusive content, and special offers delivered straight to your inbox.",
    buttonText: "Subscribe Now",
    backgroundColor: "#ffffff",
    textColor: "#1a1a1a",
    buttonColor: "#3A8DFF",
    showNameField: true,
    showEmailField: true,
  },
  discount: {
    title: "Get 20% Off Your First Order!",
    description: "Sign up now and receive an exclusive discount code. Limited time offer!",
    buttonText: "Claim Discount",
    backgroundColor: "#FFF9E6",
    textColor: "#1a1a1a",
    buttonColor: "#FF6B35",
    showNameField: false,
    showEmailField: true,
  },
  announcement: {
    title: "🎉 Big News!",
    description: "We're excited to announce our new product launch. Be the first to know!",
    buttonText: "Learn More",
    backgroundColor: "#F0F9FF",
    textColor: "#1a1a1a",
    buttonColor: "#3A8DFF",
    showNameField: false,
    showEmailField: false,
  },
}

type TemplateKey = keyof typeof TEMPLATES

export default function NewPopupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isSaving, setIsSaving] = useState(false)

  // Website fetching and selection
  const { data: websitesRaw } = useSWR<any>("/api/websites", apiGet)

  function normalizeWebsites(input: any): Array<{ id: string; domain: string; name: string }> {
    if (Array.isArray(input))
      return input.map((w: any) => ({
        id: String(w.id || w._id || ""),
        domain: w.domain || w.host || w.url || "unknown",
        name: w.name || w.domain || "Website",
      }))
    if (!input) return []
    if (Array.isArray((input as any).websites)) return normalizeWebsites((input as any).websites)
    if (Array.isArray((input as any).data)) return normalizeWebsites((input as any).data)
    if (Array.isArray((input as any).items)) return normalizeWebsites((input as any).items)
    if (Array.isArray((input as any).results)) return normalizeWebsites((input as any).results)
    return []
  }

  const websites = normalizeWebsites(websitesRaw)
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>("")

  useEffect(() => {
    if (!selectedWebsiteId) {
      const fromParam = searchParams.get("websiteId")
      const id = fromParam || websites[0]?.id
      if (id) {
        console.log("[v0] Setting selectedWebsiteId:", id)
        setSelectedWebsiteId(id)
      }
    }
  }, [websites, searchParams, selectedWebsiteId])

  const [popupName, setPopupName] = useState("Untitled Popup")
  const [status, setStatus] = useState<"draft" | "active">("draft")

  const [showTemplates, setShowTemplates] = useState(true)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState("")

  // Content state
  const [title, setTitle] = useState("Welcome to Our Website!")
  const [description, setDescription] = useState("Subscribe to get exclusive updates and special offers.")
  const [buttonText, setButtonText] = useState("Get Started")
  const [showNameField, setShowNameField] = useState(true)
  const [showEmailField, setShowEmailField] = useState(true)
  const [buttonLink, setButtonLink] = useState("")

  // Style state
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [textColor, setTextColor] = useState("#000000")
  const [buttonColor, setButtonColor] = useState("#3A8DFF")
  const [buttonTextColor, setButtonTextColor] = useState("#ffffff")
  const [borderRadius, setBorderRadius] = useState("12")
  const [showShadow, setShowShadow] = useState(true)
  const [fontSize, setFontSize] = useState("14")

  // Trigger state
  const [triggerType, setTriggerType] = useState("immediate")
  const [delaySeconds, setDelaySeconds] = useState("3")
  const [scrollPercentage, setScrollPercentage] = useState("50")

  const [hiddenTemplates, setHiddenTemplates] = useState<TemplateKey[]>([])

  const applyTemplate = (templateKey: TemplateKey) => {
    const template = TEMPLATES[templateKey]
    setTitle(template.title)
    setDescription(template.description)
    setButtonText(template.buttonText)
    setBackgroundColor(template.backgroundColor)
    setTextColor(template.textColor)
    setButtonColor(template.buttonColor)
    setShowNameField(template.showNameField)
    setShowEmailField(template.showEmailField)
  }

  const hideTemplate = (templateKey: TemplateKey) => {
    setHiddenTemplates((prev) => [...prev, templateKey])
  }

  const showTemplate = (templateKey: TemplateKey) => {
    setHiddenTemplates((prev) => prev.filter((t) => t !== templateKey))
  }

  const getDeviceWidth = () => {
    switch (device) {
      case "mobile":
        return "max-w-[320px]"
      case "tablet":
        return "max-w-[500px]"
      default:
        return "max-w-[600px]"
    }
  }

  const handleSave = async (shouldActivate = false) => {
    // Debug: ensure a website is selected
    console.log("[v0] handleSave called. selectedWebsiteId:", selectedWebsiteId, "shouldActivate:", shouldActivate)

    if (!selectedWebsiteId) {
      console.log("[v0] No website selected, aborting save.")
      toast({
        title: "Error",
        description: "Please select a website for this popup.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const nameToSave = (popupName && popupName.trim()) || (title && title.trim()) || "Untitled Popup"

      const popupData = {
        websiteId: selectedWebsiteId,
        name: nameToSave, // use computed name
        type: "email_capture",
        trigger: triggerType === "delay" ? "time_delay" : "page_load",
        status: shouldActivate ? "active" : "draft",
        designConfig: {
          backgroundColor,
          textColor,
          buttonColor,
          buttonTextColor,
          fontSize: `${fontSize}px`,
          borderRadius: `${borderRadius}px`,
          showShadow,
          title,
          description,
          buttonText,
          buttonLink,
          showNameField,
          showEmailField,
        },
        displayRules: {
          pages: ["*"],
          devices: ["desktop", "mobile", "tablet"],
          frequency: "once_per_session",
          delaySeconds: triggerType === "delay" ? Number.parseInt(delaySeconds) : 0,
          scrollPercentage: Number.parseInt(scrollPercentage),
        },
      }

      console.log("[v0] [Popup Save] Payload:", popupData)

      const response = await apiPost("/api/popups", popupData)

      console.log("[v0] [Popup Save] API Response:", response)

      toast({
        title: shouldActivate ? "Popup activated" : "Popup saved",
        description: shouldActivate
          ? "Your popup is now live and visible to visitors."
          : "Your popup has been saved as a draft.",
      })

      router.push(`/dashboard/popups?websiteId=${encodeURIComponent(selectedWebsiteId)}`)
    } catch (error: any) {
      // Log as much context as possible for debugging
      console.error("[v0] Error saving popup:", {
        name: error?.name,
        message: error?.message,
        status: error?.status,
        code: error?.code,
        stack: error?.stack,
        raw: error,
      })

      let errorMessage = "Failed to save popup. Please try again."
      if (error?.status === 400) {
        errorMessage = error?.message || "Invalid popup data. Please check your inputs."
      } else if (error?.status === 401) {
        errorMessage = "Your session has expired. Please log in again."
        router.push("/login")
      } else if (error?.status === 403) {
        errorMessage = "You've reached your popup limit. Please upgrade your plan."
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleActivate = () => {
    if (status === "draft") {
      handleSave(true)
    } else {
      setStatus("draft")
    }
  }

  // Guard Pro triggers by opening upgrade dialog
  const handleTriggerChange = (value: string) => {
    if (value === "scroll" || value === "exit") {
      const feature = value === "scroll" ? "Scroll Percentage triggers" : "Exit Intent triggers"
      console.log("[v0] Pro feature selected in Trigger Type:", value, "-> showing upgrade dialog for", feature)
      setUpgradeFeature(feature)
      setShowUpgradeDialog(true)
      return
    }
    console.log("[v0] Trigger type set to:", value)
    setTriggerType(value)
  }

  const templateConfig = {
    blank: { icon: FileText, color: "gray", label: "Blank", description: "Start from scratch" },
    newsletter: { icon: Mail, color: "blue", label: "Newsletter", description: "Collect subscribers" },
    discount: { icon: Tag, color: "orange", label: "Discount", description: "Promote offers" },
    announcement: { icon: Megaphone, color: "blue", label: "Announcement", description: "Share news" },
  }

  const visibleTemplates = (Object.keys(TEMPLATES) as TemplateKey[]).filter((key) => !hiddenTemplates.includes(key))

  return (
    <DashboardLayout>
      <div className="flex flex-col h-auto lg:h-[calc(100vh-4rem)] animate-in fade-in duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/popups">
              <Button variant="ghost" size="sm" className="transition-all hover:scale-105 text-sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Input
                value={popupName}
                onChange={(e) => setPopupName(e.target.value)}
                className="text-lg lg:text-xl font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto transition-all"
              />
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}
              >
                {status === "draft" ? "Draft" : "Active"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/popups")}
              className="flex-1 lg:flex-none transition-all hover:scale-105 text-sm"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSave(false)}
              variant="outline"
              className="flex-1 lg:flex-none transition-all hover:scale-105 bg-transparent text-sm"
              disabled={isSaving || !selectedWebsiteId}
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              onClick={handleActivate}
              className={`flex-1 lg:flex-none transition-all hover:scale-105 text-sm ${status === "active" ? "bg-gray-600 hover:bg-gray-700" : "bg-[#3A8DFF] hover:bg-[#2d7ce6]"}`}
              disabled={isSaving || !selectedWebsiteId}
            >
              {isSaving ? "Saving..." : status === "active" ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </div>

        {/* Website Selector */}
        <Card className="mb-6 p-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-4">
            <Label htmlFor="website-select" className="text-sm font-semibold whitespace-nowrap">
              Website:
            </Label>

            {/* Loading state */}
            {!websites && (
              <div className="text-sm text-gray-500" role="status" aria-live="polite">
                Loading websites...
              </div>
            )}

            {/* Empty state */}
            {websites && websites.length === 0 && (
              <div className="text-sm text-gray-500">
                No websites found.{" "}
                <Link href="/dashboard/websites/new" className="text-[#3A8DFF] underline">
                  Add a website
                </Link>{" "}
                to create a popup.
              </div>
            )}

            {/* Loaded state */}
            {websites && websites.length > 0 && (
              <Select
                value={selectedWebsiteId}
                onValueChange={(val) => {
                  setSelectedWebsiteId(val)
                  router.replace(`/dashboard/popups/new?websiteId=${encodeURIComponent(val)}`)
                }}
              >
                <SelectTrigger id="website-select" className="max-w-md">
                  <SelectValue placeholder="Select a website" />
                </SelectTrigger>
                <SelectContent>
                  {websites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </Card>

        {showTemplates ? (
          <Card className="mb-6 p-4 lg:p-6 animate-in slide-in-from-bottom-4 duration-500 relative">
            <button
              onClick={() => setShowTemplates(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors"
              aria-label="Hide templates"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-semibold mb-4">Quick Start Templates</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {(Object.keys(TEMPLATES) as TemplateKey[]).map((templateKey) => {
                const config = templateConfig[templateKey]
                const IconComponent = config.icon
                return (
                  <button
                    key={templateKey}
                    onClick={() => applyTemplate(templateKey)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#3A8DFF] hover:shadow-lg transition-all duration-300 hover:scale-105 text-left"
                  >
                    <div
                      className={`w-10 h-10 ${config.color === "blue" ? "bg-blue-50" : config.color === "orange" ? "bg-orange-50" : "bg-gray-100"} rounded-lg flex items-center justify-center mb-3 transition-colors`}
                    >
                      <IconComponent
                        className={`w-5 h-5 ${config.color === "blue" ? "text-[#3A8DFF]" : config.color === "orange" ? "text-orange-600" : "text-gray-600"} transition-colors`}
                      />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{config.label}</h4>
                    <p className="text-xs text-gray-500">{config.description}</p>
                  </button>
                )
              })}
            </div>
          </Card>
        ) : (
          <div className="mb-6">
            <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)} className="text-sm">
              + Show Quick Start Templates
            </Button>
          </div>
        )}

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
          {/* Left Panel - Editor Controls */}
          <div className="overflow-y-auto pr-0 lg:pr-2">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="content" className="transition-all text-sm">
                  Content
                </TabsTrigger>
                <TabsTrigger value="style" className="transition-all text-sm">
                  Style
                </TabsTrigger>
                <TabsTrigger value="triggers" className="transition-all text-sm">
                  Triggers
                </TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6 animate-in fade-in duration-300">
                <Card className="p-4 lg:p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-sm">
                        Headline
                      </Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter popup headline"
                        className="mt-2 transition-all focus:scale-[1.01] text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter popup description"
                        className="mt-2 min-h-[100px] transition-all focus:scale-[1.01] text-sm"
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <Label className="text-sm font-semibold">Form Fields</Label>
                      <p className="text-xs text-gray-500 mb-4">
                        Free plan includes Name + Email. Upgrade to Pro for custom fields.
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div>
                            <Label htmlFor="nameField" className="text-sm">
                              Name Field
                            </Label>
                            <p className="text-xs text-gray-500">Collect visitor names</p>
                          </div>
                          <Switch id="nameField" checked={showNameField} onCheckedChange={setShowNameField} />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div>
                            <Label htmlFor="emailField" className="text-sm">
                              Email Field
                            </Label>
                            <p className="text-xs text-gray-500">Collect email addresses</p>
                          </div>
                          <Switch id="emailField" checked={showEmailField} onCheckedChange={setShowEmailField} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Label className="text-sm font-semibold mb-3 block">Button Settings</Label>

                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="buttonText" className="text-sm">
                            Button Text
                          </Label>
                          <Input
                            id="buttonText"
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                            placeholder="Enter button text"
                            className="mt-2 transition-all focus:scale-[1.01] text-sm"
                          />
                        </div>

                        <div>
                          <Label htmlFor="buttonLink" className="text-sm">
                            Button Link (Optional)
                          </Label>
                          <Input
                            id="buttonLink"
                            value={buttonLink}
                            onChange={(e) => setButtonLink(e.target.value)}
                            placeholder="https://example.com"
                            className="mt-2 transition-all focus:scale-[1.01] text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Style Tab */}
              <TabsContent value="style" className="space-y-6 animate-in fade-in duration-300">
                <Card className="p-4 lg:p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="backgroundColor" className="text-sm">
                        Background Color
                      </Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-20 h-10 cursor-pointer transition-transform hover:scale-110"
                        />
                        <Input
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          placeholder="#ffffff"
                          className="flex-1 transition-all focus:scale-[1.01] text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="textColor" className="text-sm">
                        Text Color
                      </Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="textColor"
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-20 h-10 cursor-pointer transition-transform hover:scale-110"
                        />
                        <Input
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          placeholder="#000000"
                          className="flex-1 transition-all focus:scale-[1.01] text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="buttonColor" className="text-sm">
                        Button Color
                      </Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="buttonColor"
                          type="color"
                          value={buttonColor}
                          onChange={(e) => setButtonColor(e.target.value)}
                          className="w-20 h-10 cursor-pointer transition-transform hover:scale-110"
                        />
                        <Input
                          value={buttonColor}
                          onChange={(e) => setButtonColor(e.target.value)}
                          placeholder="#3A8DFF"
                          className="flex-1 transition-all focus:scale-[1.01] text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="buttonTextColor" className="text-sm">
                        Button Text Color
                      </Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="buttonTextColor"
                          type="color"
                          value={buttonTextColor}
                          onChange={(e) => setButtonTextColor(e.target.value)}
                          className="w-20 h-10 cursor-pointer transition-transform hover:scale-110"
                        />
                        <Input
                          value={buttonTextColor}
                          onChange={(e) => setButtonTextColor(e.target.value)}
                          placeholder="#ffffff"
                          className="flex-1 transition-all focus:scale-[1.01] text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="fontSize" className="text-sm">
                        Font Size (px)
                      </Label>
                      <Input
                        id="fontSize"
                        type="number"
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        placeholder="14"
                        className="mt-2 transition-all focus:scale-[1.01] text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="borderRadius" className="text-sm">
                        Border Radius (px)
                      </Label>
                      <Input
                        id="borderRadius"
                        type="number"
                        value={borderRadius}
                        onChange={(e) => setBorderRadius(e.target.value)}
                        placeholder="12"
                        className="mt-2 transition-all focus:scale-[1.01] text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <Label htmlFor="shadowToggle" className="text-sm">
                          Drop Shadow
                        </Label>
                        <p className="text-xs text-gray-500">Add shadow effect to popup</p>
                      </div>
                      <Switch id="shadowToggle" checked={showShadow} onCheckedChange={setShowShadow} />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Triggers Tab */}
              <TabsContent value="triggers" className="space-y-6 animate-in fade-in duration-300">
                <Card className="p-4 lg:p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="triggerType" className="text-sm">
                        Trigger Type
                      </Label>
                      <Select value={triggerType} onValueChange={handleTriggerChange}>
                        <SelectTrigger className="mt-2 transition-all hover:border-[#3A8DFF] text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">On Load (Immediate)</SelectItem>
                          <SelectItem value="delay">After X Seconds</SelectItem>
                          <SelectItem value="scroll">Scroll % (Pro)</SelectItem>
                          <SelectItem value="exit">Exit Intent (Pro)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {triggerType === "delay" && (
                      <div className="animate-in slide-in-from-top-4 duration-300">
                        <Label htmlFor="delaySeconds" className="text-sm">
                          Delay (seconds)
                        </Label>
                        <Input
                          id="delaySeconds"
                          type="number"
                          value={delaySeconds}
                          onChange={(e) => setDelaySeconds(e.target.value)}
                          placeholder="3"
                          className="mt-2 transition-all focus:scale-[1.01] text-sm"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="bg-gray-50 rounded-2xl p-4 lg:p-6 overflow-y-auto animate-in slide-in-from-right duration-500">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Eye className="w-4 h-4" />
                <span className="text-sm">Live Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={device === "desktop" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDevice("desktop")}
                  className={`transition-all hover:scale-110 text-xs ${device === "desktop" ? "bg-[#3A8DFF]" : ""}`}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={device === "tablet" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDevice("tablet")}
                  className={`transition-all hover:scale-110 text-xs ${device === "tablet" ? "bg-[#3A8DFF]" : ""}`}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={device === "mobile" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDevice("mobile")}
                  className={`transition-all hover:scale-110 text-xs ${device === "mobile" ? "bg-[#3A8DFF]" : ""}`}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Preview Container */}
            <div className="flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
              <div
                className={`${getDeviceWidth()} w-full transition-all duration-300 ease-out relative`}
                style={{
                  backgroundColor,
                  color: textColor,
                  borderRadius: `${borderRadius}px`,
                  padding: "32px",
                  fontSize: `${fontSize}px`,
                  boxShadow: showShadow
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    : "none",
                }}
              >
                <h3 className="font-bold mb-3 transition-all duration-300" style={{ fontSize: "18px" }}>
                  {title}
                </h3>
                <p className="mb-6 leading-relaxed transition-all duration-300" style={{ fontSize: "14px" }}>
                  {description}
                </p>

                <div className="space-y-3">
                  {showNameField && (
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      style={{ borderRadius: `${borderRadius}px`, fontSize: "14px" }}
                      className="transition-all duration-300 animate-in slide-in-from-top-2"
                    />
                  )}

                  {showEmailField && (
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      style={{ borderRadius: `${borderRadius}px`, fontSize: "14px" }}
                      className="transition-all duration-300 animate-in slide-in-from-top-4"
                    />
                  )}

                  <button
                    className="w-full py-3 px-6 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: buttonColor,
                      color: buttonTextColor,
                      borderRadius: `${borderRadius}px`,
                      fontSize: "14px",
                    }}
                  >
                    {buttonText}
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-400">
                    Powered by <span className="font-semibold text-[#3A8DFF]">Popuply</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SubscriptionUpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        feature={upgradeFeature}
      />
    </DashboardLayout>
  )
}
