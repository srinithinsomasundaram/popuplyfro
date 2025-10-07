"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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
import { ArrowLeft, Monitor, Tablet, Smartphone, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { apiGet, apiPatch } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function EditPopupPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const popupId = params.id as string

  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState("")

  // Popup state
  const [popupName, setPopupName] = useState("Untitled Popup")
  const [status, setStatus] = useState<"draft" | "active">("draft")

  // Content state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [buttonText, setButtonText] = useState("")
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

  // Fetch popup data on mount
  useEffect(() => {
    const fetchPopup = async () => {
      try {
        console.log("[v0] Fetching popup:", popupId)
        const response = await apiGet(`/api/popups/${popupId}`)
        console.log("[v0] Fetch popup success:", response)
        const popup = response.popup

        // Populate form with existing data
        setPopupName(popup.name || "Untitled Popup")
        setStatus(popup.status || "draft")

        // Design config
        const design = popup.designConfig || {}
        setBackgroundColor(design.backgroundColor || "#ffffff")
        setTextColor(design.textColor || "#000000")
        setButtonColor(design.buttonColor || "#3A8DFF")
        setButtonTextColor(design.buttonTextColor || "#ffffff")
        setBorderRadius((design.borderRadius || "12px").replace("px", ""))
        setFontSize((design.fontSize || "14px").replace("px", ""))
        setShowShadow(design.showShadow !== false)
        setTitle(design.title || "")
        setDescription(design.description || "")
        setButtonText(design.buttonText || "")
        setButtonLink(design.buttonLink || "")
        setShowNameField(design.showNameField !== false)
        setShowEmailField(design.showEmailField !== false)

        // Display rules
        const rules = popup.displayRules || {}
        setTriggerType(popup.trigger === "time_delay" ? "delay" : "immediate")
        setDelaySeconds(String(rules.delaySeconds || 3))
        setScrollPercentage(String(rules.scrollPercentage || 50))

        setIsLoading(false)
      } catch (error: any) {
        console.error("[v0] Error fetching popup:", {
          name: error?.name,
          message: error?.message,
          status: error?.status,
          code: error?.code,
          stack: error?.stack,
          raw: error,
        })
        let errorMessage = "Failed to load popup. Please try again."
        if (error.status === 404) {
          errorMessage = "Popup not found. It may have been deleted."
        } else if (error.status === 401) {
          errorMessage = "Your session has expired. Please log in again."
          router.push("/login")
          return
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })

        router.push("/dashboard")
      }
    }

    fetchPopup()
  }, [popupId, router, toast])

  const handleSave = async (shouldActivate = false) => {
    setIsSaving(true)
    try {
      const updates: any = {
        name: popupName,
        trigger: triggerType === "delay" ? "time_delay" : "page_load", // Fixed: use "page_load" instead of "immediate"
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

      if (shouldActivate) {
        updates.status = "active"
      }

      console.log("[v0] [Popup Update] Payload:", updates)

      await apiPatch(`/api/popups/${popupId}`, updates)

      console.log("[v0] [Popup Update] Success for:", popupId)

      if (shouldActivate) {
        setStatus("active")
      }

      toast({
        title: shouldActivate ? "Popup activated" : "Changes saved",
        description: shouldActivate
          ? "Your popup is now live and visible to visitors."
          : "Your changes have been saved successfully.",
      })

      router.push("/dashboard/popups")
    } catch (error: any) {
      console.error("[v0] Error updating popup:", {
        name: error?.name,
        message: error?.message,
        status: error?.status,
        code: error?.code,
        stack: error?.stack,
        raw: error,
      })

      let errorMessage = "Failed to update popup. Please try again."
      if (error?.status === 400) {
        errorMessage = error?.message || "Invalid popup data. Please check your inputs."
      } else if (error?.status === 401) {
        errorMessage = "Your session has expired. Please log in again."
        router.push("/login")
      } else if (error?.status === 403) {
        errorMessage = "Cannot modify this popup. It may be archived or you don't have permission."
      } else if (error?.status === 404) {
        errorMessage = "Popup not found. It may have been deleted."
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

  const handleActivate = async () => {
    if (status === "draft") {
      await handleSave(true)
    } else {
      setIsSaving(true)
      try {
        await apiPatch(`/api/popups/${popupId}`, { status: "draft" })
        setStatus("draft")
        toast({
          title: "Popup deactivated",
          description: "This popup is no longer active.",
        })
        router.push("/dashboard/popups")
      } catch (error: any) {
        console.error("[v0] Error deactivating popup:", {
          name: error?.name,
          message: error?.message,
          status: error?.status,
          code: error?.code,
          stack: error?.stack,
          raw: error,
        })
        toast({
          title: "Error",
          description: error?.message || "Failed to deactivate popup",
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleProFeatureClick = (feature: string) => {
    setUpgradeFeature(feature)
    setShowUpgradeDialog(true)
  }

  const handleTriggerChange = (value: string) => {
    if (value === "scroll" || value === "exit") {
      handleProFeatureClick(value === "scroll" ? "Scroll Percentage triggers" : "Exit Intent triggers")
    } else {
      setTriggerType(value)
    }
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#3A8DFF]" />
            <p className="text-gray-600">Loading popup...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-auto lg:h-[calc(100vh-4rem)] animate-in fade-in duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
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
              onClick={() => router.push("/dashboard")}
              className="flex-1 lg:flex-none transition-all hover:scale-105 text-sm"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSave(false)}
              variant="outline"
              className="flex-1 lg:flex-none transition-all hover:scale-105 bg-transparent text-sm"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              onClick={handleActivate}
              className={`flex-1 lg:flex-none transition-all hover:scale-105 text-sm ${status === "active" ? "bg-gray-600 hover:bg-gray-700" : "bg-[#3A8DFF] hover:bg-[#2d7ce6]"}`}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : status === "active" ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </div>

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
