import { NextResponse } from "next/server";
import { getCloudinary } from "../../../src/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "no_file" }, { status: 400 });

    const bytes = Buffer.from(await file.arrayBuffer());
    const cld = getCloudinary();

    const uploaded: any = await new Promise((resolve, reject) => {
      const stream = cld.uploader.upload_stream({ folder: "israelstudio" }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
      stream.end(bytes);
    });

    return NextResponse.json({
      url: uploaded.secure_url,
      width: uploaded.width,
      height: uploaded.height,
      public_id: uploaded.public_id,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "upload_failed" }, { status: 500 });
  }
}
