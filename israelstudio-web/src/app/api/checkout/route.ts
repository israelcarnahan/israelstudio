import { NextResponse } from "next/server";
import { createHostedCheckoutLink } from "@/lib/square";

export async function POST(req: Request) {
  try {
    const { lines } = await req.json();
    if (!Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }
    const url = await createHostedCheckoutLink(lines.map((l: { name: string; amountCents: number; quantity?: number }) => ({
      name: String(l.name),
      amountCents: Number(l.amountCents),
      quantity: Number(l.quantity || 1),
    })));
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 });
  }
}
