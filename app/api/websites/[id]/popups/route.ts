import { NextResponse } from "next/server"
import { connectMongo } from "@/lib/mongoose"
import Popup from "@/models/popup" // add popup model import

export const dynamic = "force-dynamic"

export async function GET(_req: Request, context: { params: { id: string } }) {
  const { id } = context.params

  // The Popups page expects a raw array from the API (not wrapped in an object)
  // to avoid breaking its `useSWR<Array<...>>` usage.
  try {
    await connectMongo()
    const docs = await Popup.find({ websiteId: id }).sort({ createdAt: -1 }).lean()
    return NextResponse.json(
      (docs || []).map((d: any) => ({
        id: String(d._id),
        name: d.name || "Untitled Popup",
        status: d.status || "draft",
        type: "email_capture",
        counters: d.counters || { views: 0, clicks: 0, conversions: 0 },
      })),
    )
  } catch (err: any) {
    console.error("[v0] GET /api/websites/[id]/popups error:", err?.message)
    return NextResponse.json([])
  }
}
