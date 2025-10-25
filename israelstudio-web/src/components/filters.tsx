"use client";
import SplashLink from "./SplashLink";
import { useSearchParams, usePathname } from "next/navigation";

type ChipProps = { href: string; label: string; active: boolean };
function Chip({ href, label, active }: ChipProps) {
  return (
    <SplashLink
      href={href}
      className={`chip ${active ? "chip-sparkle" : "chip-ghost-sparkle"}`}
    >
      {label}
    </SplashLink>
  );
}

export function CategoryFilters({
  cats,
}: {
  cats: { slug: string; name: string }[];
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  const current = params.get("c") || "paintings";

  return (
    <div className="flex flex-wrap gap-2">
      {cats.map((c) => {
        const sp = new URLSearchParams(params);
        sp.set("c", c.slug);
        const href = `${pathname}?${sp.toString()}`;
        const active = current === c.slug;
        return <Chip key={c.slug} href={href} label={c.name} active={active} />;
      })}
    </div>
  );
}
