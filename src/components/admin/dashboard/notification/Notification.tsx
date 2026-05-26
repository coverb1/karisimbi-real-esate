"use client";

import { useMemo, useState, type ElementType } from "react";
import {
  Bell,
  Mail,
  MapPin,
  SlidersHorizontal,
  CheckCheck,
  Eye,
  FileText,
  Phone,
  Clock,
  ArrowLeft,
  Building2,
} from "lucide-react";
import {
  useNotifications,
  type NotifType,
  type UnifiedNotification,
} from "@/src/hooks/use-notifications";

interface Notification extends UnifiedNotification {
  time: string;
  submittedAt: string;
  group: "today" | "yesterday" | "older";
  property?: string;
  price?: string;
}

const TYPE_CONFIG: Record<
  NotifType,
  {
    icon: ElementType;
    iconColor: string;
    iconBg: string;
    badgeBg: string;
    badgeText: string;
    label: string;
  }
> = {
  "property-visit": {
    icon: Eye,
    iconColor: "text-[#770634]",
    iconBg: "bg-[#f9f0f3]",
    badgeBg: "bg-[#f9f0f3]",
    badgeText: "text-[#770634]",
    label: "Property Visit",
  },
  "sell-property": {
    icon: FileText,
    iconColor: "text-[#92600a]",
    iconBg: "bg-[#fef3e2]",
    badgeBg: "bg-[#fef3e2]",
    badgeText: "text-[#92600a]",
    label: "Sell Property",
  },
};

type FilterTab = "all" | NotifType;

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "sell-property", label: "Sell Property" },
  { key: "property-visit", label: "Property Visit" },
];

const GROUP_LABELS = {
  today: "Today",
  yesterday: "Yesterday",
  older: "Older",
} as const;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getGroup(dateValue: string): Notification["group"] {
  const submitted = startOfDay(new Date(dateValue));
  const today = startOfDay(new Date());
  const diffDays = Math.floor(
    (today.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  return "older";
}

function formatRelativeTime(dateValue: string) {
  const diffMs = Date.now() - new Date(dateValue).getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function formatSubmittedAt(dateValue: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(dateValue));
}

function formatPrice(value?: string | null) {
  if (!value) return undefined;
  return value.toLowerCase().startsWith("rwf") ? value : `RWF ${value}`;
}

function normalizeNotification(notif: UnifiedNotification): Notification {
  if (notif.type === "sell-property") {
    return {
      ...notif,
      time: formatRelativeTime(notif.created_at),
      submittedAt: formatSubmittedAt(notif.created_at),
      group: getGroup(notif.created_at),
      property: notif.property_type
        ? `${notif.property_type} for sale`
        : "Property sale request",
      location: notif.location,
      price: formatPrice(notif.asking_price),
    };
  }

  return {
    ...notif,
    time: formatRelativeTime(notif.created_at),
    submittedAt: formatSubmittedAt(notif.created_at),
    group: getGroup(notif.created_at),
    property: notif.property_type
      ? `${notif.property_type} visit`
      : "Property visit request",
    location: notif.property_location,
    price: formatPrice(notif.property_price),
  };
}

function DetailPanel({
  notif,
  onClose,
}: {
  notif: Notification;
  onClose: () => void;
}) {
  const cfg = TYPE_CONFIG[notif.type];
  const Icon = cfg.icon;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={13} />
        </button>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cfg.iconBg}`}>
          <Icon size={15} className={cfg.iconColor} strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{notif.name}</p>
          <p className={`text-[11px] font-semibold uppercase tracking-wide ${cfg.badgeText}`}>
            {cfg.label}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-2.5">
          <p className="landing-eyebrow text-gray-400 mb-3">Sender Details</p>
          {notif.email && (
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <Mail size={13} className="shrink-0 text-gray-400" />
              <span>{notif.email}</span>
            </div>
          )}
          {notif.phone && (
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <Phone size={13} className="shrink-0 text-gray-400" />
              <span>{notif.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 text-sm text-gray-400">
            <Clock size={13} className="shrink-0" />
            <span>Submitted {notif.submittedAt}</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <p className="landing-eyebrow text-gray-400 mb-3">Message</p>
          <p className="text-sm text-gray-700 leading-relaxed">{notif.message}</p>
        </div>

        {notif.property && (
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="landing-eyebrow text-gray-400 mb-3">Property</p>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f9f0f3]">
                <Building2 size={15} className="text-[#770634]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{notif.property}</p>
                {notif.location && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={10} />
                    {notif.location}
                  </p>
                )}
                {notif.price && (
                  <p className="mt-1.5 text-sm font-bold text-[#770634]">{notif.price}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {(notif.email || notif.phone) && (
        <div className="border-t border-gray-100 px-5 py-4 flex gap-3">
          {notif.email && (
            <a
              href={`mailto:${notif.email}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#770634] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#8f0740] transition-colors"
            >
              <Mail size={14} />
              Email customer
            </a>
          )}
          {notif.phone && (
            <a
              href={`tel:${notif.phone}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Phone size={14} />
              Call customer
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selected, setSelected] = useState<Notification | null>(null);
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const items = useMemo(
    () => notifications.map(normalizeNotification),
    [notifications]
  );

  const filtered =
    activeTab === "all" ? items : items.filter((n) => n.type === activeTab);

  const countByType = (type: FilterTab) =>
    type === "all"
      ? items.length
      : items.filter((n) => n.type === type).length;

  const markAllRead = () => {
    markAllAsRead();
    setSelected((prev) => (prev ? { ...prev, unread: false } : prev));
  };

  const handleSelect = (notif: Notification) => {
    setSelected({ ...notif, unread: false });
    if (notif.unread) {
      markAsRead(notif.id, notif.type);
    }
  };

  const groups: ("today" | "yesterday" | "older")[] = [
    "today",
    "yesterday",
    "older",
  ];

  return (
    <div className="admin-shell min-h-screen bg-[#f8f8f8] p-6">
      <div className="flex gap-5 items-start">
        <div className="flex-1 min-w-0">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="landing-eyebrow text-primary">System</p>
              <h1 className="landing-title-compact mt-1 text-gray-900">Notifications</h1>
              <p className="mt-1 text-sm text-gray-500">
                {items.length} total&nbsp;&nbsp;-&nbsp;&nbsp;
                {unreadCount > 0 ? (
                  <span className="font-semibold text-[#770634]">{unreadCount} unread</span>
                ) : (
                  <span className="text-gray-400">All caught up</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#770634] hover:underline"
                >
                  <CheckCheck size={14} />
                  Mark all as read
                </button>
              )}
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <SlidersHorizontal size={14} />
                Filter
              </button>
            </div>
          </div>

          <div className="mb-5 flex w-fit gap-1 rounded-xl border border-gray-200 bg-white p-1.5">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-[#770634] text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    activeTab === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {countByType(tab.key)}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {groups.map((group) => {
              const groupItems = filtered.filter((n) => n.group === group);
              if (groupItems.length === 0) return null;
              return (
                <div key={group}>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                      {GROUP_LABELS[group]}
                    </span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </div>

                  <div className="flex flex-col gap-2">
                    {groupItems.map((notif) => {
                      const cfg = TYPE_CONFIG[notif.type];
                      const Icon = cfg.icon;
                      const isActive =
                        selected?.id === notif.id && selected?.type === notif.type;

                      return (
                        <div
                          key={`${notif.type}-${notif.id}`}
                          onClick={() => handleSelect(notif)}
                          className={`relative flex cursor-pointer items-start gap-4 rounded-xl border px-4 py-3.5 transition-all ${
                            isActive
                              ? "border-[#770634] bg-[#f9f0f3]"
                              : notif.unread
                              ? "border-l-[3px] border-l-[#770634] border-t-gray-100 border-r-gray-100 border-b-gray-100 bg-white hover:border-gray-300"
                              : "border-gray-100 bg-white hover:border-gray-300"
                          }`}
                        >
                          {notif.unread && !isActive && (
                            <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[#770634]" />
                          )}

                          <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.iconBg}`}>
                            <Icon size={16} className={cfg.iconColor} strokeWidth={2} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="mb-0.5 flex items-center justify-between gap-2">
                              <span className="font-semibold text-gray-900 text-sm">{notif.name}</span>
                              <span className="shrink-0 text-xs text-gray-400">{notif.time}</span>
                            </div>
                            {notif.email && (
                              <p className="text-xs text-gray-400 mb-1">{notif.email}</p>
                            )}
                            <p className="truncate text-sm text-gray-500 mb-2">{notif.message}</p>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${cfg.badgeBg} ${cfg.badgeText}`}>
                                <Icon size={10} strokeWidth={2.5} />
                                {cfg.label}
                              </span>
                              {notif.location && (
                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                  <MapPin size={11} />
                                  {notif.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Bell size={20} className="text-gray-400" />
                </div>
                <p className="font-semibold text-gray-700">
                  {loading ? "Loading notifications" : "No notifications"}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  {loading ? "Fetching the latest submissions." : "Nothing here for this filter yet."}
                </p>
              </div>
            )}
          </div>
        </div>

        {selected && (
          <div className="w-80 shrink-0 sticky top-6 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <DetailPanel notif={selected} onClose={() => setSelected(null)} />
          </div>
        )}

        {!selected && (
          <div className="w-80 shrink-0 sticky top-6 rounded-xl border border-dashed border-gray-200 bg-white flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gray-50">
              <Bell size={18} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-400">Select a notification</p>
            <p className="mt-1 text-xs text-gray-300">Details will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
