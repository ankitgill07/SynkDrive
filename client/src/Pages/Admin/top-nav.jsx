import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Bell, Search, LogOut, ArrowLeft, Shield, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function TopNav({ sidebarCollapsed, user, logout, currentRole, onMenuClick }) {
  const navigate = useNavigate();
  const isAdmin = ['admin'].includes(currentRole);
  const roleLabel = isAdmin ? 'Admin' : 'Manager';

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const handleBackToDrive = () => {
    navigate('/drive/home');
  };

  return (
    <header
      className={cn(
        'fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-card px-4 sm:px-6 transition-all duration-200 ease-in-out left-0',
        sidebarCollapsed ? 'lg:left-[72px]' : 'lg:left-[240px]'
      )}
    >
      
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Menu Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-muted-foreground hover:text-foreground shrink-0"
          title="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          onClick={handleBackToDrive}
          className="gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden xs:inline">Back to Drive</span>
        </Button>
        <Badge variant="outline" className={cn('text-xs shrink-0', isAdmin ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200')}>
          <Shield className="h-3 w-3 mr-1" />
          {roleLabel}
        </Badge>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 transition-all duration-200 hover:bg-muted px-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.picture} />
                <AvatarFallback>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">{user?.name || 'User'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="truncate">{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleBackToDrive}>Back to Drive</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive">
              <LogOut className="h-4 w-4" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
