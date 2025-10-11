"use client";
type TileProps = {
  src: string;
  poster?: string;
  fit?: "cover" | "contain";
  objectPosition?: string;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
};
export default function VideoTile({
  src,
  poster,
  fit = "contain",
  objectPosition,
  controls = true,
  muted = true,
  loop = true,
  autoPlay = false,
}: TileProps) {
  return (
    <video
      className={fit === "cover" ? "video-fit-cover" : "video-fit-contain"}
      src={src}
      poster={poster}
      playsInline
      controls={controls}
      muted={muted}
      loop={loop}
      autoPlay={autoPlay}
      preload="metadata"
      style={objectPosition ? { objectPosition } : undefined}
    />
  );
}
