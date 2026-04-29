import { Card } from '@/components/ui/card'
import { Share2, FileUp, Users, Lock } from 'lucide-react'

export function ShareStats() {
  const stats = [
    {
      label: 'Files Shared by Me',
      value: '24',
      icon: FileUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'Shared with Me',
      value: '18',
      icon: Share2,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      label: 'Collaborators',
      value: '12',
      icon: Users,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950',
    },
    {
      label: 'Private Files',
      value: '42',
      icon: Lock,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`${stat.color} w-6 h-6`} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
