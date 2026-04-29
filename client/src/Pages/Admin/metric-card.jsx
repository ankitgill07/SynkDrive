'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

export default function MetricCard({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon,
  isLive = false,
  className,
}) {
  return (
    <Card
      className={cn(
        'group relative overflow-hidden rounded-xl border-0 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {isLive && (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-600">Live</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
            {change !== undefined && (
              <p
                className={cn(
                  'text-xs font-medium',
                  change >= 0 ? 'text-emerald-600' : 'text-red-600'
                )}
              >
                {change >= 0 ? '+' : ''}{change}% {changeLabel}
              </p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EBF2FF] text-primary transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
