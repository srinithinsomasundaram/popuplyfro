import { NextResponse } from "next/server"
import { connectMongo } from "@/lib/mongoose"
import Popup from "@/models/popup"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    await connectMongo()
    const { searchParams } = new URL(req.url)
    const websiteId = searchParams.get("websiteId")

    const filter: any = {}
    if (websiteId) filter.websiteId = websiteId

    const docs = await Popup.find(filter).sort({ createdAt: -1 }).lean()
    return NextResponse.json(
      docs.map((d: any) => ({
        id: String(d._id),
        name: d.name,
        status: d.status,
        type: "email_capture",
        counters: d.counters || { views: 0, clicks: 0, conversions: 0 },
      })),
    )
  } catch (err: any) {
    console.error("[v0] GET /api/popups error:", err?.message)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    await connectMongo()
    const body = await req.json()
    console.log("[v0] POST /api/popups payload:", body)

    const {
      websiteId,
      name,
      status = "draft",
      trigger = "page_load",
      designConfig = {},
      displayRules = {},
    } = body || {}

    if (!websiteId) {
      return NextResponse.json({ message: "websiteId is required" }, { status: 400 })
    }

    const computedName =
      (typeof name === "string" && name.trim()) ||
      (typeof (designConfig as any)?.title === "string" && (designConfig as any).title.trim()) ||
      "Untitled Popup"

    // Basic validation on enums
    const safeStatus = ["draft", "active", "paused"].includes(status) ? status : "draft"
    const safeTrigger = ["page_load", "time_delay"].includes(trigger) ? trigger : "page_load"

    const doc = await Popup.create({
      websiteId,
      name: computedName, // use computed name
      status: safeStatus,
      trigger: safeTrigger,
      designConfig: { ...(designConfig || {}) },
      displayRules: { ...(displayRules || {}) },
      counters: { views: 0, clicks: 0, conversions: 0 },
    })

    return NextResponse.json({
      popup: {
        id: String(doc._id),
        name: doc.name,
        status: doc.status,
        trigger: doc.trigger,
        designConfig: doc.designConfig || {},
        displayRules: doc.displayRules || {},
        counters: doc.counters || { views: 0, clicks: 0, conversions: 0 },
        websiteId: String(doc.websiteId),
      },
    })
  } catch (err: any) {
    console.error("[v0] POST /api/popups error:", err?.message)
    const msg = err?.message?.includes("MONGODB_URI")
      ? "Database is not configured. Please set MONGODB_URI."
      : "Failed to create popup"
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}
