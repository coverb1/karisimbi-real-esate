// 📁 components/admin/RecentActivity.tsx
"use client";

import { useEffect, useState } from "react";
import { Building2, Clock } from "lucide-react";

interface Property {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  status: string;
}

interface ActivityItem {
  id: string;
  label: string;
  time: string;
  isNew: boolean; // true = just added, false = updated
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch("/api/Getproperties");
        const data = await res.json();
        const properties: Property[] = data.properties ?? [];

        // Build one activity per property — prefer updated_at if different from created_at
        const items: ActivityItem[] = properties
          .map((p) => {
            const wasUpdated =
              new Date(p.updated_at).getTime() - new Date(p.created_at).getTime() > 60_000; // >1 min gap means it was edited

            return {
              id: p.id,
              label: wasUpdated
                ? `Updated: ${p.title}`
                : `New listing: ${p.title}`,
              time: wasUpdated ? p.updated_at : p.created_at,
              isNew: !wasUpdated,
            };
          })
          // Sort newest first
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
          // Show only the 8 most recent
          .slice(0, 8);

        setActivities(items);
      } catch (err) {
        console.error("Failed to load activity", err);
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, []);

  return (
    <div className="h-full rounded-lg border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <h4 className="landing-card-title text-gray-900">Recent Activity</h4>
        <Clock size={14} className="text-gray-400" />
      </div>

      {/* Loading skeleton */}
      {loading && (
        <ul className="divide-y divide-gray-50 px-2 py-2">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="flex items-start gap-3 px-4 py-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-1/4 animate-pulse rounded bg-gray-100" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Activity list */}
      {!loading && activities.length === 0 && (
        <p className="px-5 py-8 text-center text-sm text-gray-400">No activity yet.</p>
      )}

      {!loading && activities.length > 0 && (
        <ul className="divide-y divide-gray-50 px-2 py-2">
          {activities.map((a) => (
            <li
              key={a.id + a.time}
              className="flex items-start gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-gray-50"
            >
              {/* Icon — green for new, blue for updated */}
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  a.isNew
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <Building2 size={14} strokeWidth={2} />
              </div>

              <div>
                <p className="landing-card-title text-gray-700">{a.label}</p>
                <p className="mt-1 text-[13px] font-medium text-gray-400">{timeAgo(a.time)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}