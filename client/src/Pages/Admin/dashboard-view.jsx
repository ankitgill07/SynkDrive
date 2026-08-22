import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, HardDrive } from 'lucide-react';
import MetricCard from './metric-card';
import AnalyticsCharts from './analytics-charts';
import { getDashboardMetrics } from '@/api/AdminApi';

export default function DashboardView() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      const data = await getDashboardMetrics();
      if (!data.error) {
        setMetrics(data);
      }
      setLoading(false);
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Loading metrics...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const formatStorageSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const totalUsedFormatted = formatStorageSize(metrics?.totalUsed || 0)
  const totalAllocatedFormatted = formatStorageSize(metrics?.totalAllocated || 0)
  const storagePercent = metrics?.totalAllocated ? ((metrics.totalUsed / metrics.totalAllocated) * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your storage platform metrics and analytics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard
          title="Total Users"
          value={metrics?.totalUsers?.toLocaleString() || '0'}
          icon={<Users className="h-6 w-6" />}
        />
        <MetricCard
          title="Active Sessions"
          value={metrics?.activeSessions?.toLocaleString() || '0'}
          icon={<UserCheck className="h-6 w-6" />}
          isLive
        />
        <MetricCard
          title="Disabled Users"
          value={metrics?.disabledUsers || '0'}
          icon={<UserX className="h-6 w-6" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border-0 bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <h3 className="text-sm font-medium text-muted-foreground">Total Storage</h3>
          <p className="mt-2 text-3xl font-bold text-foreground">{totalUsedFormatted}</p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(storagePercent, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {totalUsedFormatted} used of {totalAllocatedFormatted} allocated
          </p>
        </div>

        <div className="rounded-xl border-0 bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <h3 className="text-sm font-medium text-muted-foreground">System Health</h3>
          <p className="mt-2 text-3xl font-bold text-emerald-600">Operational</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Users</span>
              <span className="font-medium text-foreground">{metrics?.totalUsers || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active Sessions</span>
              <span className="font-medium text-foreground">{metrics?.activeSessions || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Disabled Accounts</span>
              <span className="font-medium text-foreground">{metrics?.disabledUsers || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <AnalyticsCharts chartData={metrics?.registrationGrowth || []} />
    </div>
  );
}
