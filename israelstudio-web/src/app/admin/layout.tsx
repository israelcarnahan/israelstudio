import Link from "next/link";
import { getSessionSafe } from "@/lib/sessionSafe";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionSafe();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div>
      <div className="border-b border-neutral-200 bg-white">
        <div className="container h-14 flex items-center justify-between">
          <div className="font-display">Admin</div>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/products">Products</Link>
            <Link href="/api/auth/signout" className="text-red-600">
              Sign Out
            </Link>
          </nav>
        </div>
      </div>
      <div className="container py-8">{children}</div>
    </div>
  );
}
