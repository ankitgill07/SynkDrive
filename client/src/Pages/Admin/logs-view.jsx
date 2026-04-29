'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { AlertCircle, CheckCircle, InfoIcon } from 'lucide-react'

export default function LogsView() {
  const mockLogs = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 3600000),
      action: 'User created',
      user: 'James Park',
      details: 'New user account created',
      type: 'info',
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 7200000),
      action: 'Storage limit exceeded',
      user: 'Sarah Chen',
      details: 'User storage usage exceeded 90%',
      type: 'warning',
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 10800000),
      action: 'User deleted',
      user: 'Admin',
      details: 'User account permanently deleted',
      type: 'error',
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 14400000),
      action: 'System maintenance',
      user: 'System',
      details: 'Scheduled maintenance completed',
      type: 'success',
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 18000000),
      action: 'User role updated',
      user: 'Emma Wilson',
      details: 'Role changed from Viewer to Admin',
      type: 'info',
    },
  ]

  const getIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4" />
      case 'success':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <InfoIcon className="h-4 w-4" />
    }
  }

  const typeColors = {
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">System Logs</h1>
        <p className="text-muted-foreground">
          View system activity and user actions.
        </p>
      </div>

      {/* Logs List */}
      <Card className="rounded-xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 border-b border-border/30 pb-4 last:border-b-0 last:pb-0"
              >
                <div className={`mt-1 rounded-full p-2 ${typeColors[log.type]}`}>
                  {getIcon(log.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(log.timestamp, 'HH:mm:ss')}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{log.details}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="bg-muted/30 text-muted-foreground">
                      {log.user}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={typeColors[log.type]}
                    >
                      {log.type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
