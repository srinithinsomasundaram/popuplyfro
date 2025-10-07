import { NextResponse } from "next/server"
import { connectMongo } from "@/lib/mongoose"
import Website from "@/models/website"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await connectMongo()

    // In a real app you would filter by signed-in user.
    // For now, return all for demo purposes.
    const docs = await Website.find({})
      .select("domain websiteKey name faviconUrl status settings stats createdAt updatedAt")
      .lean()

    const websites = (docs || []).map((d: any) => ({
      id: String(d._id),
      domain: d.domain,
      websiteKey: d.websiteKey,
      name: d.name || d.domain,
      faviconUrl: d.faviconUrl || null,
      status: d.status || "pending",
      settings: d.settings || {},
      stats: d.stats || { totalViews: 0, totalConversions: 0, last30Days: { views: 0, conversions: 0 } },
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }))

    return NextResponse.json({ websites })
  } catch (err: any) {
    console.error("[v0] GET /api/websites error:", err?.message)
    return NextResponse.json({ websites: [], error: "Failed to load websites" }, { status: 500 })
  }
}
