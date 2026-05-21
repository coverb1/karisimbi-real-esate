import { StatsCards } from "@/src/components/admin/dashboard/StatsCards";
import { RecentListings } from "@/src/components/admin/dashboard/RecentListings";
import { RecentActivity } from "@/src/components/admin/dashboard/RecentActivity";

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="landing-eyebrow text-primary">Overview</p>
        <h4 className="landing-title-compact mt-1 text-gray-900">Dashboard</h4>
        <p className="landing-body mt-1 max-w-2xl text-gray-500">
          Welcome back,{" "}
          <span className="text-primary font-semibold">Karisimbi Real Estate</span>
          . Here is what is happening today.
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentListings />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
