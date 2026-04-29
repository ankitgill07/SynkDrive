'use client'

import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  HardDrive,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'logs', label: 'Logs', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ sidebarCollapsed, onToggleSidebar, setActiveView }) {
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border/30 bg-sidebar transition-all duration-200 ease-in-out',
          sidebarCollapsed ? 'w-[72px]' : 'w-[240px]'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border/30 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <HardDrive className="h-5 w-5 text-primary-foreground" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-lg font-semibold text-sidebar-foreground">CloudStore</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {menuItems.map((item) => {
            const Icon = item.icon

            const button = (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={cn(
                  'relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  'active:scale-[0.98]'
                )}
              >
                <Icon className={cn('h-5 w-5 shrink-0', sidebarCollapsed && 'mx-auto')} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            )

            if (sidebarCollapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" className="ml-2">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return button
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-border/30 p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="w-full transition-all duration-200 hover:bg-sidebar-accent"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
