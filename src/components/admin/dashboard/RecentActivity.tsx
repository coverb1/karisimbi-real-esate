import { Building2, Users, Clock } from "lucide-react";

const activities = [
  {
    icon: Users,
    color: "bg-violet-100 text-violet-600",
    label: "New client: Jean Baptiste",
    time: "2 hours ago",
  },
  {
    icon: Building2,
    color: "bg-emerald-100 text-emerald-600",
    label: "New listing: Modern Luxury Villa",
    time: "9 May",
  },
  {
    icon: Building2,
    color: "bg-emerald-100 text-emerald-600",
    label: "New listing: Executive Penthouse",
    time: "9 May",
  },
  {
    icon: Building2,
    color: "bg-emerald-100 text-emerald-600",
    label: "New listing: Garden View Residence",
    time: "8 May",
  },
  {
    icon: Users,
    color: "bg-violet-100 text-violet-600",
    label: "New client: Marie Claire",
    time: "7 May",
  },
];

export function RecentActivity() {
  return (
    <div className="h-full rounded-lg border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <h4 className="landing-card-title text-gray-900">Recent Activity</h4>
        <Clock size={14} className="text-gray-400" />
      </div>

      <ul className="divide-y divide-gray-50 px-2 py-2">
        {activities.map((a, i) => (
          <li
            key={i}
            className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${a.color}`}
            >
              <a.icon size={14} strokeWidth={2} />
            </div>
            <div>
              <p className="landing-card-title text-gray-700">{a.label}</p>
              <p className="mt-1 text-[13px] font-medium text-gray-400">{a.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
