import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const Attachment = z.object({
  fileName: z.string().min(1).max(120),
  contentType: z.string().min(1).max(120),
  data: z.string().min(1), // base64 without data: prefix
});

const Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  service: z.enum(["Painting","Rug","Other"]),
  size: z.string().optional(),
  message: z.string().optional(),
  website: z.string().optional(), // honeypot
  attachments: z.array(Attachment).max(5).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = Schema.parse(json);

    // Honeypot: if filled, drop quietly
    if (data.website && data.website.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    const to = process.env.CONTACT_TO || "ritnourisrael@gmail.com";
    const from = process.env.CONTACT_FROM || "Israel's Studio <onboarding@resend.dev>";
    const key = process.env.RESEND_API_KEY;

    const subject = `New commission request from ${data.name}`;
    const plain = `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "-"}
Service: ${data.service}
Size: ${data.size || "-"}
Message:
${data.message || "-"}
    `.trim();

    if (key) {
      const resend = new Resend(key);
      await resend.emails.send({
        from,
        to,
        subject,
        text: plain,
        reply_to: data.email,
        attachments: (data.attachments || []).map(a => ({
          fileName: a.fileName,
          content: a.data,           // base64
          contentType: a.contentType,
        })),
      });
    } else {
      console.log("[QUOTE - no RESEND_API_KEY, logging only]\n" + plain);
      if (data.attachments?.length) {
        console.log(`[QUOTE] ${data.attachments.length} attachment(s) received`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok:false, error: e?.message ?? "invalid" }, { status: 400 });
  }
}
