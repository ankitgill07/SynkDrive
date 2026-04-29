import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { File, MoreVertical, Clock } from 'lucide-react'
import { useState } from 'react'



const INCOMING_SHARES = [
  {
    id: '1',
    fileName: 'Annual Budget 2024.xlsx',
    sharedBy: {
      name: 'Jennifer Chen',
      email: 'jennifer@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
    },
    permission: 'edit',
    sharedDate: '3 hours ago',
    accepted: true,
  },
  {
    id: '2',
    fileName: 'Client Presentation.pptx',
    sharedBy: {
      name: 'David Rodriguez',
      email: 'david@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    },
    permission: 'view',
    sharedDate: '5 hours ago',
    accepted: false,
  },
  {
    id: '3',
    fileName: 'Design System v2.figma',
    sharedBy: {
      name: 'Lisa Wang',
      email: 'lisa@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    },
    permission: 'edit',
    sharedDate: '1 day ago',
    accepted: true,
  },
  {
    id: '4',
    fileName: 'Analytics Report - Q1.pdf',
    sharedBy: {
      name: 'Marcus Johnson',
      email: 'marcus@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    },
    permission: 'view',
    sharedDate: '2 days ago',
    accepted: true,
  },
]

export function SharedWithMe() {
  const [shares, setShares] = useState(INCOMING_SHARES)

  const handleAccept = (id) => {
    setShares(shares.map((share) => (share.id === id ? { ...share, accepted: true } : share)))
  }

  const handleDecline = (id) => {
    setShares(shares.filter((share) => share.id !== id))
  }

  const pendingShares = shares.filter((s) => !s.accepted)
  const acceptedShares = shares.filter((s) => s.accepted)

  return (
    <Card className="border-0 shadow-sm">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold">Shared with Me</h2>
        <p className="text-sm text-muted-foreground mt-1">Files and folders shared by your colleagues</p>
      </div>

      {pendingShares.length > 0 && (
        <div className="p-6 border-b border-border bg-accent/5">
          <p className="text-sm font-semibold mb-4 text-foreground">Pending Requests ({pendingShares.length})</p>
          <div className="space-y-3">
            {pendingShares.map((share) => (
              <div key={share.id} className="flex items-center justify-between p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-3 flex-1">
                  <File className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{share.fileName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={share.sharedBy.avatar} />
                        <AvatarFallback>{share.sharedBy.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">From {share.sharedBy.name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={() => handleAccept(share.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 text-xs"
                    onClick={() => handleDecline(share.id)}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">File Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">From</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Permission</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {acceptedShares.map((share) => (
              <tr key={share.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <File className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground text-sm">{share.fileName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={share.sharedBy.avatar} />
                      <AvatarFallback>{share.sharedBy.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{share.sharedBy.name}</p>
                      <p className="text-xs text-muted-foreground">{share.sharedBy.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={share.permission === 'edit' ? 'default' : 'secondary'} className="text-xs capitalize">
                    {share.permission}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{share.sharedDate}</td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Open file</DropdownMenuItem>
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Download</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Remove access</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {acceptedShares.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No accepted shared files yet</p>
          </div>
        )}
      </div>
    </Card>
  )
}
