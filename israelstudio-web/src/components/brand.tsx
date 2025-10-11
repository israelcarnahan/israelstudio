import Image from "next/image";
import Link from "next/link";

export function Brand({ showText = true }: { showText?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image src="/logo.png" alt="Israel's Studio logo" width={48} height={48} className="h-8 w-auto rounded-xl" />
      {showText ? <span className="font-display text-lg tracking-wide">Israel's Studio</span> : null}
    </Link>
  );
}
