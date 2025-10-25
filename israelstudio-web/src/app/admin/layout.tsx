import Link from "next/link";
import { ENABLE_AUTH } from "@/lib/authFlag";
import { getSessionSafe } from "@/lib/sessionSafe";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Show disabled message when auth is disabled
  if (!ENABLE_AUTH) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="font-display text-3xl mb-4">Admin Disabled</h1>
          <p className="text-neutral-600 mb-6">
            Admin functionality is currently disabled in this environment.
          </p>
          <Link href="/" className="btn btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

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
