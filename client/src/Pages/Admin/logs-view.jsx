'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { AlertCircle, CheckCircle, InfoIcon } from 'lucide-react'
import { getSystemLogs } from '@/api/AdminApi'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function LogsView() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      const data = await getSystemLogs({ page, limit: 10 })
      if (!data.error) {
        setLogs(data.logs || [])
        setTotalPages(data.totalPages || 1)
      } else {
        toast.error('Failed to fetch logs')
      }
      setLoading(false)
    }
    fetchLogs()
  }, [page])

  const getIcon = (level) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4" />
      case 'success':
        return <CheckCircle className="h-4 w-4" />
      case 'warning':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <InfoIcon className="h-4 w-4" />
    }
  }

  const levelColors = {
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
          <CardTitle className="text-foreground">Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p className="text-muted-foreground">Loading logs...</p>
            ) : logs.length === 0 ? (
              <p className="text-muted-foreground">No logs found.</p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 border-b border-border/30 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className={`mt-1 rounded-full p-2 ${levelColors[log.level] || levelColors.info}`}>
                    {getIcon(log.level)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(log.createdAt), 'MMM dd yyyy HH:mm:ss')}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.details}</p>
                    <div className="mt-2 flex items-center gap-2">
                      {log.user && (
                        <Badge variant="outline" className="bg-muted/30 text-muted-foreground">
                          {log.user.name || log.user.email}
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={levelColors[log.level] || levelColors.info}
                      >
                        {log.level}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
