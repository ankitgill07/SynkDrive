import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const mockAnalytics = {
  userGrowth: [850, 920, 980, 1050, 1120, 1180, 1247],
  activeSessions: [720, 780, 820, 850, 870, 880, 892],
  totalStorage: 1024,
  usedStorage: 723,
}

function UserGrowthChart() {
  const data = mockAnalytics.userGrowth.map((value, index) => ({
    day: `Day ${index + 1}`,
    users: value,
  }))

  return (
    <Card className="col-span-2 rounded-xl border-0 shadow-sm transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-foreground">User Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="var(--primary)"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function ActiveSessionsChart() {
  const data = mockAnalytics.activeSessions.map((value, index) => ({
    time: `${10 + index}:00`,
    sessions: value,
  }))

  return (
    <Card className="rounded-xl border-0 shadow-sm transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-foreground">Active Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="sessions" fill="var(--primary)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function StorageUsageChart() {
  const usedPercentage = Math.round(
    (mockAnalytics.usedStorage / mockAnalytics.totalStorage) * 100
  )
  const freeStorage = mockAnalytics.totalStorage - mockAnalytics.usedStorage
  const data = [
    { name: 'Used', value: mockAnalytics.usedStorage, color: 'var(--primary)' },
    { name: 'Free', value: freeStorage, color: 'var(--muted)' },
  ]

  return (
    <Card className="rounded-xl border-0 shadow-sm transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-foreground">Storage Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          <div className="relative h-40 w-40">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">{usedPercentage}%</span>
              <span className="text-sm text-muted-foreground">Used</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Used Storage</span>
              </div>
              <span className="text-sm font-medium text-foreground">{mockAnalytics.usedStorage} GB</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-muted" />
                <span className="text-sm text-muted-foreground">Free Storage</span>
              </div>
              <span className="text-sm font-medium text-foreground">{freeStorage} GB</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AnalyticsCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <UserGrowthChart />
      <ActiveSessionsChart />
      <StorageUsageChart />
    </div>
  )
}
