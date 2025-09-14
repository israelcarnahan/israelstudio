"use client";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

type ChipProps = { href: string; label: string; active: boolean };
function Chip({ href, label, active }: ChipProps) {
  return (
    <Link
      href={href}
      className={`chip ${active ? "bg-neutral-900 text-white border-neutral-900" : ""}`}
    >
      {label}
    </Link>
  );
}

export function CategoryFilters({ cats }: { cats: { slug: string; name: string }[] }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const current = params.get("c") || "paintings";

  return (
    <div className="flex flex-wrap gap-2">
      {cats.map(c => {
        const sp = new URLSearchParams(params);
        sp.set("c", c.slug);
        const href = `${pathname}?${sp.toString()}`;
        const active = current === c.slug;
        return <Chip key={c.slug} href={href} label={c.name} active={active} />;
      })}
    </div>
  );
}
