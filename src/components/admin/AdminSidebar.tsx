"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, PlusCircle, Bell,
  Settings, MessageSquare, LogOut, Home,
} from "lucide-react";

const navItems = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    ],
  },
  {
    label: "Properties",
    items: [
      { icon: Building2, label: "All Listings", href: "/admin/dashboard/listing" },
      { icon: PlusCircle, label: "Add Property", href: "/admin/dashboard/Addproperty", badge: "New" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: Bell, label: "Notifications", href: "/admin/dashboard/Notification" },
      { icon: Settings, label: "Settings", href: "/admin/settings" },
    ],
  },
  {
    label: "Testimonials",
    items: [
      { icon: MessageSquare, label: "Add Testimonial", href: "/admin/testimonials/new" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col border-r border-gray-200 bg-white md:flex">
      {/* Logo */}
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Home size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold leading-none text-primary">Karisimbi</p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-5 overflow-y-auto p-3">
        {navItems.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">{group.label}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={[
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                        active
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-50 hover:text-primary",
                      ].join(" ")}
                    >
                      <item.icon size={15} strokeWidth={2} />
                      {item.label}
                      {item.badge && (
                        <span className="ml-auto text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="space-y-1 border-t border-gray-100 p-3">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
            KR
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800">Karisimbi RE</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400">Administrator</p>
          </div>
        </div>
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:bg-red-50 hover:text-red-600">
          <LogOut size={14} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
