"use client";

import Link from "next/link";
import { Search, Bell, Plus } from "lucide-react";
import type { CurrentUser } from "@/src/types/auth";

export function AdminTopbar({ user }: { user: CurrentUser }) {
  const initials = user?.fullName
    ? user?.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "KR";

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-gray-100 bg-white px-4 sm:px-5">
      <h4 className="mr-2 text-sm font-semibold text-gray-800">
        Dashboard
      </h4>

      {/* Search */}
      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search anything here..."
          className="h-8 w-full rounded-full border border-gray-200 bg-gray-50 pl-8 pr-4 text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:border-primary/50 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Link
          href="/admin/dashboard/Addproperty"
          aria-label="Add property"
          className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
        </Link>

        <Link
          href="/admin/dashboard/Notification"
          aria-label="Notifications"
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary/40 hover:text-primary transition-colors relative"
        >
          <Bell size={15} />

          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </Link>

        <div className="flex items-center gap-2 ml-2">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-[11px] font-bold">
            {initials}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-none text-gray-800">
              {user.fullName}
            </p>

            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
