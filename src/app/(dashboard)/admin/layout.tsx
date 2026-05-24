import { AdminSidebar } from "@/src/components/admin/AdminSidebar";
import { AdminTopbar } from "@/src/components/admin/AdminTopbar";
import { requireAdminUser } from "@/src/lib/auth/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminUser();

  return (
    <div className="admin-shell flex h-screen overflow-hidden bg-surface text-[13px] text-gray-700">
      <AdminSidebar user={user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopbar user={user} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
