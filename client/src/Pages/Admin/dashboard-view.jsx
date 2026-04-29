'use client'

import { useSelector } from 'react-redux'
import { Users, UserCheck, UserX } from 'lucide-react'
import MetricCard from './metric-card'
import AnalyticsCharts from './analytics-charts'

export default function DashboardView() {
  const { users } = useSelector((state) => state.dashboard)

  const mockAnalytics = {
    totalUsers: 1247,
    activeUsers: 892,
    deletedUsers: 24,
    totalStorage: 1024,
    usedStorage: 723,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your storage platform metrics and analytics.
        </p>
      </div>

      {/* Stats Cards - 3 Column Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard
          title="Total Users"
          value={mockAnalytics.totalUsers.toLocaleString()}
          change={12.5}
          icon={<Users className="h-6 w-6" />}
        />
        <MetricCard
          title="Active Users"
          value={mockAnalytics.activeUsers.toLocaleString()}
          icon={<UserCheck className="h-6 w-6" />}
          isLive
        />
        <MetricCard
          title="Deleted Users"
          value={mockAnalytics.deletedUsers}
          change={-8.2}
          changeLabel="vs last month"
          icon={<UserX className="h-6 w-6" />}
        />
      </div>

      {/* Quick Stats Card */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border-0 bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <h3 className="text-sm font-medium text-muted-foreground">Total Storage</h3>
          <p className="mt-2 text-3xl font-bold text-foreground">{mockAnalytics.totalStorage} GB</p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{
                width: `${(mockAnalytics.usedStorage / mockAnalytics.totalStorage) * 100}%`,
              }}
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {mockAnalytics.usedStorage} GB used of {mockAnalytics.totalStorage} GB
          </p>
        </div>

        <div className="rounded-xl border-0 bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <h3 className="text-sm font-medium text-muted-foreground">System Health</h3>
          <p className="mt-2 text-3xl font-bold text-emerald-600">Operational</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">API Latency</span>
              <span className="font-medium text-foreground">42ms</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Uptime</span>
              <span className="font-medium text-foreground">99.98%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Error Rate</span>
              <span className="font-medium text-foreground">0.02%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts />
    </div>
  )
}
