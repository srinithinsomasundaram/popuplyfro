import { NextResponse } from "next/server"
import { connectMongo } from "@/lib/mongoose"
import Popup from "@/models/popup"

export const dynamic = "force-dynamic"

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectMongo()
    const doc = await Popup.findById(params.id).lean()
    if (!doc) return NextResponse.json({ message: "Not found" }, { status: 404 })

    const copy = await Popup.create({
      websiteId: doc.websiteId,
      name: `Copy of ${doc.name || "Untitled Popup"}`,
      status: "draft",
      trigger: doc.trigger,
      designConfig: doc.designConfig || {},
      displayRules: doc.displayRules || {},
      counters: { views: 0, clicks: 0, conversions: 0 },
    })

    return NextResponse.json({ id: String(copy._id) })
  } catch (err: any) {
    console.error("[v0] POST /api/popups/[id]/duplicate error:", err?.message)
    return NextResponse.json({ message: "Failed to duplicate popup" }, { status: 500 })
  }
}
