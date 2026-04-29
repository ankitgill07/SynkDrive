'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cn } from '@/lib/utils'
import { Bell, Search, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function TopNav({ sidebarCollapsed }) {
  const [searchQuery, setSearchQuery] = useState('')
  const dispatch = useDispatch()
  const { notifications } = useSelector((state) => state.dashboard)
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header
      className={cn(
        'fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-card px-6 transition-all duration-200 ease-in-out',
        sidebarCollapsed ? 'left-[72px]' : 'left-[240px]'
      )}
    >
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users, files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full rounded-xl border-border/50 bg-background pl-10 transition-all duration-200 focus-visible:border-primary focus-visible:ring-primary"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative transition-all duration-200 hover:bg-muted"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </Button>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 transition-all duration-200 hover:bg-muted"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://avatar.vercel.sh/admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-medium">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <LogOut className="h-4 w-4" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
