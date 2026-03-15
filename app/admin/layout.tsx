import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "./_components/AdminSidebar";

export const metadata = { title: "Admin — Draughts & Dragons" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // No session means this must be the login page — middleware.ts guards all other /admin routes.
  // Rendering without sidebar avoids an infinite redirect loop on /admin/login.
  if (!session) return <>{children}</>;

  return (
    <div className="min-h-screen bg-dungeon-black flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
