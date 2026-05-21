import { AdminSidebar } from "@/src/components/admin/AdminSidebar";
import { AdminTopbar } from "@/src/components/admin/AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell flex h-screen overflow-hidden bg-surface text-[13px] text-gray-700">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
