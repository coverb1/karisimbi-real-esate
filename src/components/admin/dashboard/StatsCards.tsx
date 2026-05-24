// 📁 components/admin/StatsCards.tsx
"use client";

import { useEffect, useState } from "react";
import { DollarSign, Building2, TrendingUp } from "lucide-react";

interface Property {
  price: number;
  created_at: string;
  status: string;
}

interface Stats {
  portfolioValue: number;
  totalListings: number;
  newThisMonth: number;
  priorMonthListings: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/Getproperties");
        const data = await res.json();
        const properties: Property[] = data.properties ?? [];

        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const portfolioValue = properties.reduce((sum, p) => sum + p.price, 0);
        const totalListings = properties.length;

        const newThisMonth = properties.filter(
          (p) => new Date(p.created_at) >= thisMonthStart
        ).length;

        const priorMonthListings = properties.filter((p) => {
          const d = new Date(p.created_at);
          return d >= lastMonthStart && d < thisMonthStart;
        }).length;

        setStats({ portfolioValue, totalListings, newThisMonth, priorMonthListings });
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  function formatValue(n: number) {
    if (n >= 1_000_000_000) return `RWF ${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `RWF ${(n / 1_000_000).toFixed(1)}M`;
    return `RWF ${n.toLocaleString()}`;
  }

  function monthDiff(newVal: number, oldVal: number) {
    if (oldVal === 0) return newVal > 0 ? "New this month" : "No change";
    const pct = (((newVal - oldVal) / oldVal) * 100).toFixed(1);
    return `${Number(pct) >= 0 ? "+" : ""}${pct}% vs last month`;
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 animate-pulse rounded-lg border border-gray-100 bg-white shadow-sm" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      icon: DollarSign,
      iconBg: "bg-emerald-500",
      label: "Portfolio Value",
      value: formatValue(stats.portfolioValue),
      sub: "Est. from all list prices",
      trend: "Live total",
      trendUp: true,
    },
    {
      icon: Building2,
      iconBg: "bg-blue-500",
      label: "Properties Listed",
      value: String(stats.totalListings),
      sub: "All listings in database",
      trend: monthDiff(stats.totalListings, stats.priorMonthListings),
      trendUp: stats.totalListings >= stats.priorMonthListings,
    },
    {
      icon: TrendingUp,
      iconBg: "bg-orange-500",
      label: "New This Month",
      value: String(stats.newThisMonth),
      sub: "Added since month start",
      trend: `${stats.priorMonthListings} added last month`,
      trendUp: stats.newThisMonth >= stats.priorMonthListings,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((s) => (
        <div
          key={s.label}
          className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.iconBg}`}>
              <s.icon size={18} className="text-white" strokeWidth={2} />
            </div>
            <span className={`landing-eyebrow ${s.trendUp ? "text-emerald-600" : "text-gray-400"}`}>
              {s.trend}
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