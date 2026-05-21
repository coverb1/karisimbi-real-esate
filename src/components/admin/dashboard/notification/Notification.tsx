"use client";

import { useState } from "react";
import {
  Bell,
  Mail,
  Wrench,
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

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifType = "maintenance" | "contact" | "inquiry" | "viewing";

interface Notification {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  type: NotifType;
  time: string;
  submittedAt: string;
  group: "today" | "yesterday" | "older";
  unread: boolean;
  property?: string;
  location?: string;
  beds?: number;
  baths?: number;
  price?: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    name: "Jean Pierre K.",
    email: "jeanpierre.k@gmail.com",
    phone: "+250 788 123 456",
    message: "I am interested in scheduling a viewing this weekend. Is Saturday morning available?",
    type: "viewing",
    time: "1h ago",
    submittedAt: "22 May 2026, 09:14 AM",
    group: "today",
    unread: true,
    property: "Hilltop Panorama Estate",
    location: "Rebero",
    beds: 6,
    baths: 5,
    price: "RWF 580,000,000",
  },
  {
    id: 2,
    name: "Alice Uwimana",
    email: "alice.u@email.com",
    phone: "+250 722 987 654",
    message: "Is the City Centre Apartment still available? I would love to arrange a visit.",
    type: "contact",
    time: "3h ago",
    submittedAt: "22 May 2026, 07:30 AM",
    group: "today",
    unread: true,
    property: "City Centre Apartment",
    location: "Kigali CBD",
    beds: 2,
    baths: 1,
    price: "RWF 95,000,000",
  },
  {
    id: 3,
    name: "Samuel Nkusi",
    email: "samuel.nkusi@outlook.com",
    message: "I would like to negotiate the price on the villa. Can we discuss further?",
    type: "inquiry",
    time: "5h ago",
    submittedAt: "22 May 2026, 05:00 AM",
    group: "today",
    unread: true,
    property: "Modern Luxury Villa",
    location: "Kigali Heights",
    beds: 5,
    baths: 4,
    price: "RWF 450,000,000",
  },
  {
    id: 4,
    name: "Marie Claire",
    email: "m.claire@yahoo.com",
    phone: "+250 733 456 789",
    message: "The gate latch at the front entrance is broken and needs urgent repair.",
    type: "maintenance",
    time: "1d ago",
    submittedAt: "21 May 2026, 02:15 PM",
    group: "yesterday",
    unread: false,
    property: "Garden View Residence",
    location: "Kimihurura",
  },
  {
    id: 5,
    name: "Emmanuel Habimana",
    email: "e.habimana@gmail.com",
    message: "How many parking spaces are included with the penthouse purchase?",
    type: "inquiry",
    time: "1d ago",
    submittedAt: "21 May 2026, 10:45 AM",
    group: "yesterday",
    unread: false,
    property: "Executive Penthouse",
    location: "Gacuriro",
    beds: 3,
    baths: 3,
    price: "RWF 280,000,000",
  },
  {
    id: 6,
    name: "Diane Ingabire",
    email: "diane.i@gmail.com",
    phone: "+250 788 654 321",
    message: "I am looking for a 4-bedroom family house in Nyarutarama. Do you have any listings?",
    type: "contact",
    time: "2d ago",
    submittedAt: "20 May 2026, 04:00 PM",
    group: "yesterday",
    unread: false,
    location: "Nyarutarama",
  },
  {
    id: 7,
    name: "Patrick Mugisha",
    email: "p.mugisha@hotmail.com",
    phone: "+250 722 111 222",
    message: "The water heater in the master bathroom stopped working. Please send a technician.",
    type: "maintenance",
    time: "3d ago",
    submittedAt: "19 May 2026, 08:30 AM",
    group: "older",
    unread: false,
    property: "Lakeside Retreat",
    location: "Nyamata",
  },
  {
    id: 8,
    name: "Grace Mutesi",
    email: "grace.mutesi@gmail.com",
    phone: "+250 788 333 444",
    message: "I would like a private tour of the mansion this weekend. Please confirm availability.",
    type: "viewing",
    time: "4d ago",
    submittedAt: "18 May 2026, 11:00 AM",
    group: "older",
    unread: false,
    property: "Diplomatic Quarter Mansion",
    location: "Kacyiru",
    beds: 7,
    baths: 6,
    price: "RWF 890,000,000",
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  NotifType,
  {
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    badgeBg: string;
    badgeText: string;
    label: string;
  }
> = {
  viewing: {
    icon: Eye,
    iconColor: "text-[#770634]",
    iconBg: "bg-[#f9f0f3]",
    badgeBg: "bg-[#f9f0f3]",
    badgeText: "text-[#770634]",
    label: "Viewing Request",
  },
  inquiry: {
    icon: FileText,
    iconColor: "text-[#92600a]",
    iconBg: "bg-[#fef3e2]",
    badgeBg: "bg-[#fef3e2]",
    badgeText: "text-[#92600a]",
    label: "Inquiry",
  },
  contact: {
    icon: Mail,
    iconColor: "text-[#185FA5]",
    iconBg: "bg-[#e6f1fb]",
    badgeBg: "bg-[#e6f1fb]",
    badgeText: "text-[#185FA5]",
    label: "Contact",
  },
  maintenance: {
    icon: Wrench,
    iconColor: "text-[#1a5c2a]",
    iconBg: "bg-[#f0f7f1]",
    badgeBg: "bg-[#f0f7f1]",
    badgeText: "text-[#1a5c2a]",
    label: "Maintenance",
  },
};

type FilterTab = "all" | NotifType;

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "viewing", label: "Viewing" },
  { key: "inquiry", label: "Inquiry" },
  { key: "contact", label: "Contact" },
  { key: "maintenance", label: "Maintenance" },
];

const GROUP_LABELS = {
  today: "Today",
  yesterday: "Yesterday",
  older: "Older",
} as const;

// ─── Detail Panel ─────────────────────────────────────────────────────────────

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
      {/* Panel header */}
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
        {/* Sender info */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-2.5">
          <p className="landing-eyebrow text-gray-400 mb-3">Sender Details</p>
          <div className="flex items-center gap-2.5 text-sm text-gray-700">
            <Mail size={13} className="shrink-0 text-gray-400" />
            <span>{notif.email}</span>
          </div>
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

        {/* Message */}
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <p className="landing-eyebrow text-gray-400 mb-3">Message</p>
          <p className="text-sm text-gray-700 leading-relaxed">{notif.message}</p>
        </div>

        {/* Property details — only if linked */}
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
                {(notif.beds || notif.baths) && (
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    {notif.beds && <span>{notif.beds} beds</span>}
                    {notif.baths && <span>{notif.baths} baths</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="border-t border-gray-100 px-5 py-4 flex gap-3">
        <a
          href={`mailto:${notif.email}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#770634] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#8f0740] transition-colors"
        >
          <Mail size={14} />
          Email customer
        </a>
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
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [items, setItems] = useState<Notification[]>(NOTIFICATIONS);
  const [selected, setSelected] = useState<Notification | null>(null);

  const filtered =
    activeTab === "all" ? items : items.filter((n) => n.type === activeTab);

  const countByType = (type: FilterTab) =>
    type === "all"
      ? items.length
      : items.filter((n) => n.type === type).length;

  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  const handleSelect = (notif: Notification) => {
    setSelected(notif);
    setItems((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
  };

  const groups: ("today" | "yesterday" | "older")[] = [
    "today",
    "yesterday",
    "older",
  ];

  return (
    <div className="admin-shell min-h-screen bg-[#f8f8f8] p-6">
      <div className="flex gap-5 items-start">

        {/* ── Left: List panel ── */}
        <div className="flex-1 min-w-0">
          {/* Page Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="landing-eyebrow text-primary">System</p>
              <h1 className="landing-title-compact mt-1 text-gray-900">Notifications</h1>
              <p className="mt-1 text-sm text-gray-500">
                {items.length} total&nbsp;&nbsp;·&nbsp;&nbsp;
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

          {/* Filter Tabs */}
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

          {/* Notification Groups */}
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
                      const isActive = selected?.id === notif.id;

                      return (
                        <div
                          key={notif.id}
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
                            <p className="text-xs text-gray-400 mb-1">{notif.email}</p>
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
                <p className="font-semibold text-gray-700">No notifications</p>
                <p className="mt-1 text-sm text-gray-400">Nothing here for this filter yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Detail panel ── */}
        {selected && (
          <div className="w-80 shrink-0 sticky top-6 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <DetailPanel notif={selected} onClose={() => setSelected(null)} />
          </div>
        )}

        {/* ── Right: Empty state placeholder ── */}
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