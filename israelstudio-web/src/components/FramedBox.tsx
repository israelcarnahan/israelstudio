import Image from "next/image";
type Props = {
  frameSrc: string;
  children: React.ReactNode;
  offsets?: { left?: string; top?: string; width?: string; height?: string };
  className?: string;
  priority?: boolean;
};
export default function FramedBox({
  frameSrc,
  children,
  offsets,
  className = "",
  priority = false,
}: Props) {
  const style: React.CSSProperties = {
    ["--v-left" as any]: offsets?.left ?? "9%",
    ["--v-top" as any]: offsets?.top ?? "10%",
    ["--v-width" as any]: offsets?.width ?? "82%",
    ["--v-height" as any]: offsets?.height ?? "68%",
  };
  return (
    <div className={`frame2 framed-shadow ${className}`}>
      <Image
        src={frameSrc}
        alt=""
        width={1400}
        height={1000}
        className="frame2-img"
        priority={priority}
      />
      <div className="frame2-canvas" style={style}>
        <div className="frame2-fill">{children}</div>
      </div>
    </div>
  );
}
