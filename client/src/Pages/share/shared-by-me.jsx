'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { File, MoreVertical, Globe, Lock, Users } from 'lucide-react'
import { useState } from 'react'

const SHARED_FILES = [
  {
    id: '1',
    name: 'Q1 Revenue Report.pdf',
    type: 'document',
    sharedWith: ['john@company.com', 'sarah@company.com', 'mike@company.com'],
    permission: 'edit',
    sharedDate: '2 days ago',
    visibility: 'team',
  },
  {
    id: '2',
    name: 'Marketing Strategy 2024.docx',
    type: 'document',
    sharedWith: ['team@company.com'],
    permission: 'edit',
    sharedDate: '1 week ago',
    visibility: 'team',
  },
  {
    id: '3',
    name: 'Budget Allocation.xlsx',
    type: 'spreadsheet',
    sharedWith: ['finance@company.com', 'alex@company.com'],
    permission: 'view',
    sharedDate: '3 days ago',
    visibility: 'team',
  },
  {
    id: '4',
    name: 'Product Roadmap Q2.pptx',
    type: 'presentation',
    sharedWith: ['product@company.com', 'design@company.com'],
    permission: 'edit',
    sharedDate: '5 days ago',
    visibility: 'public',
  },
]

export function SharedByMe() {
  const [files, setFiles] = useState(SHARED_FILES)

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
            {files.map((file) => (
              <tr key={file.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <File className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground text-sm">{file.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {file.sharedWith.length > 0 && (
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
                    {getVisibilityIcon(file.visibility)}
                    <span className="capitalize">{file.visibility}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{file.sharedDate}</td>
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
