'use client'

import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Share2, Download, Eye, Edit, User, Lock } from 'lucide-react'



const ACTIVITIES = [
  {
    id: '1',
    type: 'shared',
    user: { name: 'Sarah Mitchell', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    description: 'shared',
    fileName: 'Q1 Revenue Report.pdf',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'downloaded',
    user: { name: 'James Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
    description: 'downloaded',
    fileName: 'Marketing Strategy 2024.docx',
    timestamp: '4 hours ago',
  },
  {
    id: '3',
    type: 'viewed',
    user: { name: 'Emily Brooks', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
    description: 'viewed',
    fileName: 'Budget Allocation.xlsx',
    timestamp: '6 hours ago',
  },
  {
    id: '4',
    type: 'edited',
    user: { name: 'Robert Garcia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert' },
    description: 'edited',
    fileName: 'Product Roadmap Q2.pptx',
    timestamp: '1 day ago',
  },
  {
    id: '5',
    type: 'access_changed',
    user: { name: 'Amanda Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda' },
    description: "changed access to 'Can Edit'",
    fileName: 'Design System v2.figma',
    timestamp: '2 days ago',
  },
  {
    id: '6',
    type: 'shared',
    user: { name: 'Christopher Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher' },
    description: 'shared',
    fileName: 'Analytics Report - Q1.pdf',
    timestamp: '3 days ago',
  },
]

const getActivityIcon = (type) => {
  switch (type) {
    case 'shared':
      return <Share2 className="w-4 h-4" />
    case 'downloaded':
      return <Download className="w-4 h-4" />
    case 'viewed':
      return <Eye className="w-4 h-4" />
    case 'edited':
      return <Edit className="w-4 h-4" />
    case 'access_changed':
      return <Lock className="w-4 h-4" />
    default:
      return <User className="w-4 h-4" />
  }
}


const getActivityColor = (type) => {
  switch (type) {
    case 'shared':
      return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
    case 'downloaded':
      return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
    case 'viewed':
      return 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
    case 'edited':
      return 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300'
    case 'access_changed':
      return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
    default:
      return 'bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300'
  }
}

export function ActivityFeed() {
  return (
    <Card className="border-0 shadow-sm">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold">Recent Activity</h2>
        <p className="text-sm text-muted-foreground mt-1">Track all sharing and file access activities</p>
      </div>
      <div className="space-y-1">
        {ACTIVITIES.map((activity, index) => (
          <div key={activity.id} className="p-6 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
            <div className="flex gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{activity.user.name}</span>
                      <span className="text-muted-foreground">{activity.description}</span>
                      {activity.fileName && (
                        <>
                          <span className="text-muted-foreground">to</span>
                          <span className="font-medium text-foreground">{activity.fileName}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={`inline-flex items-center justify-center p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{activity.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
