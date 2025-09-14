import { v2 as cloudinary } from "cloudinary";

export function ensureCloudinaryEnv() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary env vars missing");
  }
}

export function getCloudinary() {
  ensureCloudinaryEnv();
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
    secure: true,
  });
  return cloudinary;
}
