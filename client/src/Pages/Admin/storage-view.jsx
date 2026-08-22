import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { HardDrive, File, FileText, Image, Video, Archive } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { getStorageStats } from '@/api/AdminApi'
import { toast } from 'sonner'

const fileIcons = {
  document: FileText,
  image: Image,
  video: Video,
  other: Archive,
}

export default function StorageView() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      const data = await getStorageStats()
      if (!data.error) {
        setStats(data)
      } else {
        toast.error('Failed to fetch storage stats')
      }
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) {
    return <div className="p-6">Loading storage stats...</div>
  }

  if (!stats) {
    return <div className="p-6">No stats available</div>
  }

  const formatStorageSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const totalAllocated = stats.totalAllocated || (1 * 1024 ** 3)
  const totalUsed = stats.totalUsed || 0
  const usedFormatted = formatStorageSize(totalUsed)
  const totalFormatted = formatStorageSize(totalAllocated)
  const usedPercentage = totalAllocated ? Math.min((totalUsed / totalAllocated) * 100, 100) : 0
  const freePercentage = 100 - usedPercentage

  const storageByType = (stats.categories || []).map((cat) => {
    const Icon = fileIcons[cat.name.toLowerCase()] || File
    return {
      name: cat.name,
      formattedSize: formatStorageSize(cat.size),
      percentage: cat.percentage || 0,
      icon: Icon,
    }
  })

  const topUsersChartData = (stats.topUsers || []).map((u) => ({
    name: u.name || u.email || 'User',
    usedStorageGB: parseFloat(((u.storageUsed || 0) / (1024 ** 3)).toFixed(3)),
  }))

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
              <p className="text-3xl font-bold text-foreground">{usedFormatted}</p>
              <p className="text-xs text-muted-foreground">of {totalFormatted}</p>
            </div>
            <Progress
              value={usedPercentage}
              className="h-3"
            />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Used</p>
                <p className="font-semibold text-foreground">
                  {usedPercentage.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Available</p>
                <p className="font-semibold text-foreground">
                  {freePercentage.toFixed(1)}%
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
              {storageByType.map((type) => {
                const Icon = type.icon
                return (
                  <div key={type.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1"><Icon className="h-4 w-4"/> {type.name}</span>
                      <span className="font-medium text-foreground">{type.formattedSize}</span>
                    </div>
                    <Progress value={type.percentage} className="mt-1 h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Users */}
      <Card className="rounded-xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Top Storage Users</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topUsersChartData}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
                formatter={(value) => [`${value} GB`, 'Storage Used']}
              />
              <Bar dataKey="usedStorageGB" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
