'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { File, MoreVertical, Globe, Lock, Users } from 'lucide-react'
import { useState } from 'react'
import { formatTimestamp } from '@/utils/Helpers'



export function SharedByMe({ shareByMe }) {
  const [files, setFiles] = useState()
  console.log(shareByMe);

  const getVisibilityIcon = (visibility) => {
    if (visibility === 'public') return <Globe className="w-4 h-4" />
    if (visibility === 'team') return <Users className="w-4 h-4" />
    return <Lock className="w-4 h-4" />
  }

  const getPermissionBadgeVariant = (permission) => {
    if (permission === 'edit') return 'default'
    if (permission === 'admin') return 'default'
    return 'secondary'
  }

  return (
    <Card className="border-0 shadow-sm">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold">Files I Shared</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage and track all your shared files</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">File Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Shared With</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Permission</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Visibility</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {shareByMe.map((file) => (
              <tr key={file?.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <File className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground text-sm">{file.fileName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {file?.sharedWith?.length > 0 && (
                      <>
                        <span className="text-sm text-muted-foreground">{file.sharedWith.length} people</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getPermissionBadgeVariant(file.permission)} className="text-xs capitalize">
                    {file.permission}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getVisibilityIcon(file.type)}
                    <span className="capitalize">{file.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{formatTimestamp(file.createdAt)}</td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Manage sharing</DropdownMenuItem>
                      <DropdownMenuItem>Download</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Stop sharing</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
