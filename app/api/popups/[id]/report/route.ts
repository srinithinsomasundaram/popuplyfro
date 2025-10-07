import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  console.log("[v0] Report received for popup:", params.id)
  return NextResponse.json({ ok: true })
}
