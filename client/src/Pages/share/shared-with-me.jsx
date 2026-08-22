import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreVertical } from 'lucide-react'
import { formatTimestamp } from '@/utils/Helpers'
import { useNavigate } from 'react-router-dom'
import { renderFilePreview } from '@/utils/Helpers'


export function SharedWithMe({ shareWithMe }) {

  const navigate = useNavigate()
  const openSharedFile = (share) => navigate(`/email/shared/${share.fileId}`)

  return (
    <Card className="border-0 shadow-sm">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold">Shared with Me</h2>
        <p className="text-sm text-muted-foreground mt-1">Files and folders shared by your colleagues</p>
      </div>
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
            {shareWithMe.map((share) => (
              <tr key={share.fileId} onClick={() => openSharedFile(share)} className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {renderFilePreview({ file: share, size: 18 })}
                    <span className="font-medium text-foreground text-sm">{share.fileName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={share.sharedBy?.avatar} />
                      <AvatarFallback>{share.sharedBy?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{share.sharedBy?.name}</p>
                      <p className="text-xs text-muted-foreground">{share.sharedBy?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={share.permission === 'edit' ? 'default' : 'secondary'} className="text-xs capitalize">
                    {share.permission}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{formatTimestamp(share.createdAt)}</td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(event) => event.stopPropagation()}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
                      <DropdownMenuItem onClick={() => openSharedFile(share)}>Open file</DropdownMenuItem>
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
        {shareWithMe.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No accepted shared files yet</p>
          </div>
        )}
      </div>
    </Card>
  )
}
