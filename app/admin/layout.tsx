import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-neutral-200 bg-white">
        <div className="container h-14 flex items-center justify-between">
          <div className="font-display">Admin</div>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/products">Products</Link>
          </nav>
        </div>
      </div>
      <div className="container py-8">{children}</div>
    </div>
  );
}
