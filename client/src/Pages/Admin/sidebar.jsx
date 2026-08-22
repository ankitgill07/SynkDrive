import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  HardDrive,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import logo from "@/assets/images/logo.png"

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'logs', label: 'Logs', icon: FileText },

];

export default function Sidebar({ sidebarCollapsed, onToggleSidebar, setActiveView, activeView, isAdmin, user, mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const roleLabel = isAdmin ? 'Admin' : 'Manager';

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity duration-300"
          onClick={onMobileClose}
        />
      )}

      <TooltipProvider delayDuration={0}>
        <aside
          className={cn(
            'fixed top-0 bottom-0 z-50 flex h-screen flex-col border-r border-border/30 bg-sidebar transition-all duration-200 ease-in-out',
            sidebarCollapsed ? 'lg:w-[72px]' : 'lg:w-[240px]',
            // Responsive placement: slide out of screen by default on mobile, slide in when active
            mobileOpen ? 'left-0 w-[240px]' : '-left-full lg:left-0'
          )}
        >
          {/* Logo / Header */}
          <div className="flex h-16 items-center justify-between border-b border-border/30 px-4">
            <div
              onClick={() => window.location.reload()}
              className="flex items-center group cursor-pointer"
            >
              <div className="shrink-0">
                <img
                  className="w-9 h-9 rounded-md object-cover"
                  src={logo}
                  alt="Logo"
                />
              </div>
              {(!sidebarCollapsed || mobileOpen) && (
                <span className="text-lg font-semibold text-sidebar-foreground ml-2">SynkDrive</span>
              )}
            </div>
            {mobileOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMobileClose}
                className="lg:hidden text-muted-foreground hover:bg-accent"
                title="Close menu"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Back to Drive */}
          <div className="border-b border-border/30 p-3">
            {sidebarCollapsed && !mobileOpen ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate('/drive/home')}
                    className="flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">Back to Drive</TooltipContent>
              </Tooltip>
            ) : (
              <button
                onClick={() => navigate('/drive/home')}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 shrink-0" />
                <span>Back to Drive</span>
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              const button = (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    if (mobileOpen) onMobileClose();
                  }}
                  className={cn(
                    'relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    'active:scale-[0.98]',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <Icon className={cn('h-5 w-5 shrink-0', sidebarCollapsed && !mobileOpen && 'mx-auto')} />
                  {(!sidebarCollapsed || mobileOpen) && <span>{item.label}</span>}
                </button>
              );

              if (sidebarCollapsed && !mobileOpen) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={item.id}>{button}</div>;
            })}
          </nav>

          {/* User Profile Section */}
          <div className="border-t border-border/30 p-3">
            {sidebarCollapsed && !mobileOpen ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center">
                    <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                      <AvatarImage src={user?.picture} alt={user?.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  <div>
                    <p className="font-medium">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{roleLabel}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="flex items-center gap-3 rounded-xl px-2 py-2">
                <Avatar className="h-9 w-9 ring-2 ring-primary/20 shrink-0">
                  <AvatarImage src={user?.picture} alt={user?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{roleLabel}</p>
                </div>
              </div>
            )}
          </div>

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
    </>
  );
}
