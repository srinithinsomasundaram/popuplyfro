"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Mail, Lock, Bell, Trash2, Copy, Check, Crown, Globe, AlertTriangle } from "lucide-react"
import { apiGet, apiPatch, apiPost, apiDelete, type ApiError } from "@/lib/api"
import { setTokens } from "@/lib/auth"

export default function SettingsPage() {
  const router = useRouter()

  // Fetch user data from /api/auth/me
  const { data: userData, isLoading: userLoading, error: userError, mutate: mutateUser } = useSWR<any>("/api/auth/me", apiGet)

  // Fetch subscription data
  const { data: subscriptionData, isLoading: subLoading } = useSWR<any>("/api/user/subscription", apiGet, {
    shouldRetryOnError: false, // Don't retry if endpoint doesn't exist yet
  })

  // Fetch websites for embed code
  const { data: websitesData, isLoading: websitesLoading } = useSWR<any>("/api/websites", apiGet)

  // Extract user from response
  const user = userData?.success ? userData.data : userData

  // Extract subscription from response
  const subscription = subscriptionData?.success ? subscriptionData.data : subscriptionData

  // Normalize websites array
  function normalizeWebsites(input: any): Array<{ id: string; domain: string; name?: string; websiteKey?: string }> {
    if (!input) return []
    if (Array.isArray(input)) return input
    if (input.success && Array.isArray(input.data?.websites)) return input.data.websites
    if (Array.isArray(input.websites)) return input.websites
    if (Array.isArray(input.data)) return input.data
    return []
  }

  const websites = normalizeWebsites(websitesData)
  const primaryWebsite = websites[0]

  // Embed code generation
  const embedBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
  const embedCode = primaryWebsite
    ? `<!-- Popuply Embed Code -->
<script src="${embedBase}/public/embed.js" data-website-key="${primaryWebsite.websiteKey || primaryWebsite.id}" async></script>
<!-- End Popuply Embed Code -->`
    : "<!-- No website found. Please create a website first. -->"

  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [leadNotifications, setLeadNotifications] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(false)

  // UI state
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [dangerMsg, setDangerMsg] = useState<string | null>(null)
  const [copiedEmbed, setCopiedEmbed] = useState(false)

  // Populate form when user data loads
  useEffect(() => {
    if (!user) return
    setName(user.name || user.fullName || "")
    setEmail(user.email || "")
    setCompany(user.company || "")
    setEmailNotifications(user.preferences?.emailNotifications ?? true)
    setLeadNotifications(user.preferences?.leadNotifications ?? true)
    setWeeklyReports(user.preferences?.weeklyReports ?? false)
    setMarketingEmails(user.preferences?.marketingEmails ?? false)
  }, [user])

  // Handle profile save
  async function handleSaveProfile() {
    setSavingProfile(true)
    setProfileMsg(null)
    try {
      const response = await apiPatch("/api/auth/me", {
        name,
        email,
        company,
        preferences: {
          emailNotifications,
          leadNotifications,
          weeklyReports,
          marketingEmails,
        },
      })

      await mutateUser()
      setProfileMsg({ type: 'success', text: response?.message || "Profile updated successfully" })

      // Clear success message after 3 seconds
      setTimeout(() => setProfileMsg(null), 3000)
    } catch (e) {
      const err = e as ApiError
      setProfileMsg({ type: 'error', text: err?.message || "Failed to save changes" })
    } finally {
      setSavingProfile(false)
    }
  }

  // Handle password change
  async function handleChangePassword() {
    setPwSaving(true)
    setPwMsg(null)

    // Validation
    if (newPassword !== confirmPassword) {
      setPwMsg({ type: 'error', text: "New passwords do not match" })
      setPwSaving(false)
      return
    }

    if (newPassword.length < 8) {
      setPwMsg({ type: 'error', text: "Password must be at least 8 characters" })
      setPwSaving(false)
      return
    }

    try {
      const response = await apiPost("/api/auth/change-password", {
        currentPassword,
        newPassword,
      })

      // Update tokens if returned
      if (response?.data?.accessToken && response?.data?.refreshToken) {
        setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      } else if (response?.accessToken && response?.refreshToken) {
        setTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        })
      }

      setPwMsg({ type: 'success', text: "Password updated successfully" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      // Clear success message after 3 seconds
      setTimeout(() => setPwMsg(null), 3000)
    } catch (e) {
      const err = e as ApiError
      setPwMsg({ type: 'error', text: err?.message || "Failed to update password" })
    } finally {
      setPwSaving(false)
    }
  }

  // Handle account deletion
  async function handleDeleteAccount() {
    if (!confirm("⚠️ This will permanently delete your account and all data. This action cannot be undone. Are you sure?")) {
      return
    }

    const confirmText = prompt('Type "DELETE" to confirm:')
    if (confirmText !== "DELETE") {
      setDangerMsg("Account deletion cancelled")
      return
    }

    try {
      await apiDelete("/api/auth/me")
      // Clear local storage
      localStorage.clear()
      router.replace("/")
    } catch (e) {
      const err = e as ApiError
      setDangerMsg(err?.message || "Failed to delete account")
    }
  }

  // Copy embed code
  function handleCopyEmbed() {
    navigator.clipboard.writeText(embedCode)
    setCopiedEmbed(true)
    setTimeout(() => setCopiedEmbed(false), 2000)
  }

  // Get tier badge color
  function getTierBadgeColor(tier?: string) {
    switch (tier) {
      case "free": return "bg-gray-100 text-gray-800"
      case "starter": return "bg-blue-100 text-blue-800"
      case "growth": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const isLoading = userLoading || subLoading || websitesLoading

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold">Settings</h2>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A8DFF]"></div>
              <span className="ml-3 text-gray-600">Loading settings...</span>
            </div>
          </Card>
        )}

        {/* Error State */}
        {userError && (
          <Card className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Failed to load settings</h3>
                <p className="text-sm text-red-700">
                  {userError?.message || "Please make sure you're logged in and try again."}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Subscription Info */}
        {!isLoading && user && (
          <Card className="bg-gradient-to-br from-[#3A8DFF]/10 to-purple-500/10 rounded-2xl shadow-sm p-6 border-2 border-[#3A8DFF]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#3A8DFF] rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Current Plan</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${getTierBadgeColor(user.tier || subscription?.tier)} capitalize`}>
                      {user.tier || subscription?.tier || "Free"}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {subscription?.status === "active" ? "Active" : subscription?.status || "Active"}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => router.push("/dashboard/billing")}
                className="bg-[#3A8DFF] hover:bg-[#2d7ce6] text-white rounded-xl"
              >
                Upgrade Plan
              </Button>
            </div>

            {subscription?.features && (
              <div className="mt-4 pt-4 border-t border-[#3A8DFF]/20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Websites:</span>
                    <span className="ml-2 font-semibold">
                      {subscription.features.websites === "unlimited" ? "∞" : subscription.features.websites || 1}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Popups:</span>
                    <span className="ml-2 font-semibold">
                      {subscription.features.popups === "unlimited" ? "∞" : subscription.features.popups || 1}
                    </span>
                  </div>
                  {subscription.features.advancedTriggers && (
                    <div className="text-green-600">✓ Advanced Triggers</div>
                  )}
                  {subscription.features.abTesting && (
                    <div className="text-green-600">✓ A/B Testing</div>
                  )}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Account Information */}
        {!isLoading && user && (
          <Card className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-6">Account Information</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 rounded-xl"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name (Optional)</Label>
                <Input
                  id="company"
                  placeholder="Your company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
              {profileMsg && (
                <div className={`text-sm ${profileMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {profileMsg.text}
                </div>
              )}
              <div className="flex-1"></div>
              <Button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="bg-[#3A8DFF] hover:bg-[#2d7ce6] text-white rounded-xl"
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>
        )}

        {/* Password Settings */}
        {!isLoading && user && (
          <Card className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-6">Change Password</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10 rounded-xl"
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 rounded-xl"
                    placeholder="Min 8 characters"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 rounded-xl"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
              {pwMsg && (
                <div className={`text-sm ${pwMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {pwMsg.text}
                </div>
              )}
              <div className="flex-1"></div>
              <Button
                onClick={handleChangePassword}
                disabled={pwSaving || !currentPassword || !newPassword || !confirmPassword}
                className="bg-[#3A8DFF] hover:bg-[#2d7ce6] text-white rounded-xl"
              >
                {pwSaving ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </Card>
        )}

        {/* Notification Settings */}
        {!isLoading && user && (
          <Card className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-6">Notification Preferences</h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Popup Updates</p>
                    <p className="text-sm text-gray-600">Receive email updates about your popups</p>
                  </div>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Lead Notifications</p>
                    <p className="text-sm text-gray-600">Get notified when someone submits a form</p>
                  </div>
                </div>
                <Switch checked={leadNotifications} onCheckedChange={setLeadNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Weekly Reports</p>
                    <p className="text-sm text-gray-600">Receive weekly analytics summaries</p>
                  </div>
                </div>
                <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Marketing Emails</p>
                    <p className="text-sm text-gray-600">Receive tips and product updates</p>
                  </div>
                </div>
                <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="bg-[#3A8DFF] hover:bg-[#2d7ce6] text-white rounded-xl"
                >
                  {savingProfile ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Embed Code */}
        {!isLoading && primaryWebsite && (
          <Card className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-gray-600" />
              <h3 className="text-xl font-bold">Embed Code</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Add this script to the {"<head>"} of <span className="font-semibold">{primaryWebsite.domain}</span>
            </p>

            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm">
                <code>{embedCode}</code>
              </pre>
              <Button
                onClick={handleCopyEmbed}
                className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
                size="sm"
              >
                {copiedEmbed ? (
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

            <p className="text-xs text-gray-500 mt-3">
              {websites.length} website{websites.length !== 1 ? 's' : ''} connected
            </p>
          </Card>
        )}

        {/* Danger Zone */}
        {!isLoading && user && (
          <Card className="bg-white rounded-2xl shadow-sm border-2 border-red-200 p-6">
            <h3 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                <div>
                  <p className="font-semibold text-red-900">Delete Account</p>
                  <p className="text-sm text-red-700">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  {dangerMsg && <p className="text-sm text-red-600 mt-2">{dangerMsg}</p>}
                </div>
                <Button variant="destructive" className="rounded-xl" onClick={handleDeleteAccount}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
