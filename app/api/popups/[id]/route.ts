import { NextResponse } from "next/server"
import { connectMongo } from "@/lib/mongoose"
import Popup from "@/models/popup"

export const dynamic = "force-dynamic"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongo()
    const doc = await Popup.findById(params.id).lean()
    if (!doc) return NextResponse.json({ message: "Not found" }, { status: 404 })

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
    console.error("[v0] GET /api/popups/[id] error:", err?.message)
    return NextResponse.json({ message: "Failed to load popup" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongo()
    const body = await req.json()
    console.log("[v0] PATCH /api/popups/%s payload:", params.id, body)

    const updates: any = {}
    if (typeof body.name === "string") updates.name = body.name?.trim() || "Untitled Popup"
    if (typeof body.status === "string") {
      updates.status = ["draft", "active", "paused"].includes(body.status) ? body.status : "draft"
    }
    if (typeof body.trigger === "string") {
      updates.trigger = ["page_load", "time_delay"].includes(body.trigger) ? body.trigger : "page_load"
    }
    if (body.designConfig) updates.designConfig = { ...(body.designConfig || {}) }
    if (body.displayRules) updates.displayRules = { ...(body.displayRules || {}) }

    const doc = await Popup.findByIdAndUpdate(params.id, updates, { new: true, runValidators: true }).lean()
    if (!doc) return NextResponse.json({ message: "Not found" }, { status: 404 })

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
    console.error("[v0] PATCH /api/popups/[id] error:", err?.message)
    const msg = err?.message?.includes("MONGODB_URI")
      ? "Database is not configured. Please set MONGODB_URI."
      : "Failed to update popup"
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongo()
    await Popup.findByIdAndDelete(params.id)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("[v0] DELETE /api/popups/[id] error:", err?.message)
    const msg = err?.message?.includes("MONGODB_URI")
      ? "Database is not configured. Please set MONGODB_URI."
      : "Failed to delete popup"
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}
