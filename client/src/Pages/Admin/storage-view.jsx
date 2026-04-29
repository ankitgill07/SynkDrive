import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { HardDrive, File } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function StorageView() {
  const mockAnalytics = {
    totalStorage: 1024,
    usedStorage: 723,
  }

  const storageByType = [
    { name: 'Images', size: 245, percentage: 34, icon: File },
    { name: 'Documents', size: 178, percentage: 25, icon: File },
    { name: 'Videos', size: 189, percentage: 26, icon: File },
    { name: 'Others', size: 111, percentage: 15, icon: File },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Storage Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage your platform storage usage.
        </p>
      </div>

      {/* Storage Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <HardDrive className="h-5 w-5 text-primary" />
              Total Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Usage</p>
              <p className="text-3xl font-bold text-foreground">{mockAnalytics.usedStorage} GB</p>
              <p className="text-xs text-muted-foreground">of {mockAnalytics.totalStorage} GB</p>
            </div>
            <Progress
              value={(mockAnalytics.usedStorage / mockAnalytics.totalStorage) * 100}
              className="h-3"
            />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Used</p>
                <p className="font-semibold text-foreground">
                  {((mockAnalytics.usedStorage / mockAnalytics.totalStorage) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Available</p>
                <p className="font-semibold text-foreground">
                  {((
                    ((mockAnalytics.totalStorage - mockAnalytics.usedStorage) /
                      mockAnalytics.totalStorage) *
                    100
                  ).toFixed(1))}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Storage by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {storageByType.map((type) => (
                <div key={type.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{type.name}</span>
                    <span className="font-medium text-foreground">{type.size} GB</span>
                  </div>
                  <Progress value={type.percentage * 3.33} className="mt-1 h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Growth Chart */}
      <Card className="rounded-xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Storage Growth (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { day: 'Day 1', usage: 650 },
                { day: 'Day 5', usage: 680 },
                { day: 'Day 10', usage: 695 },
                { day: 'Day 15', usage: 710 },
                { day: 'Day 20', usage: 719 },
                { day: 'Day 25', usage: 722 },
                { day: 'Day 30', usage: 723 },
              ]}
            >
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
              <Bar dataKey="usage" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
