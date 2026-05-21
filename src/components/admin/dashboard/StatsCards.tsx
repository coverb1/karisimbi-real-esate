import { DollarSign, Building2, Users, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: DollarSign,
    iconBg: "bg-emerald-500",
    label: "Portfolio Value",
    value: "RWF 2.1B",
    sub: "Est. from list prices",
    trend: "+12% vs last month",
    trendUp: true,
  },
  {
    icon: Building2,
    iconBg: "bg-blue-500",
    label: "Properties Listed",
    value: "24",
    sub: "Active listings",
    trend: "+0.0% vs last month",
    trendUp: true,
  },
  {
    icon: Users,
    iconBg: "bg-violet-500",
    label: "Registered Clients",
    value: "138",
    sub: "Total clients",
    trend: "+3 MoM",
    trendUp: true,
  },
  {
    icon: TrendingUp,
    iconBg: "bg-orange-500",
    label: "New This Month",
    value: "7",
    sub: "New listings",
    trend: "+4 in prior month",
    trendUp: false,
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.iconBg}`}>
              <s.icon size={18} className="text-white" strokeWidth={2} />
            </div>
            <span className={`landing-eyebrow ${s.trendUp ? "text-emerald-600" : "text-gray-400"}`}>
              Up {s.trend}
            </span>
          </div>
          <p className="font-heading text-3xl font-semibold leading-none text-gray-900">{s.value}</p>
          <p className="mt-2 text-sm font-medium text-gray-700">{s.label}</p>
          <p className="landing-body mt-1 text-gray-400">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
