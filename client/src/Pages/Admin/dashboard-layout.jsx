import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, setActiveView } from '@/lib/dashboardSlice';
import { cn } from '@/lib/utils';
import { userAuth } from '@/contextApi/AuthContext';
import { useState } from 'react';
import Sidebar from './sidebar';
import TopNav from './top-nav';
import DashboardView from './dashboard-view';
import UsersView from './users-view';
import StorageView from './storage-view';
import LogsView from './logs-view';


export default function DashboardLayout() {
  const dispatch = useDispatch();
  const { sidebarCollapsed, activeView } = useSelector((state) => state.dashboard);
  const { user, logout } = userAuth();
  const currentRole = (user?.role || '').toLowerCase();
  const isAdmin = ['admin'].includes(currentRole);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleToggleSidebar = () => dispatch(toggleSidebar());
  const handleSetActiveView = (view) => {
    dispatch(setActiveView(view));
    setMobileSidebarOpen(false); // Close sidebar on mobile when navigating
  };

  const renderView = () => {
    switch (activeView) {
      case 'users':
        return <UsersView currentRole={currentRole} isAdmin={isAdmin} />;
      case 'storage':
        return <StorageView />;
      case 'logs':
        return <LogsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
        setActiveView={handleSetActiveView}
        activeView={activeView}
        isAdmin={isAdmin}
        user={user}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <TopNav 
        sidebarCollapsed={sidebarCollapsed} 
        user={user} 
        logout={logout} 
        currentRole={currentRole} 
        onMenuClick={() => setMobileSidebarOpen(true)}
      />
      <main
        className={cn(
          'mt-16 flex-1 overflow-auto transition-all duration-200 ml-0',
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[240px]'
        )}
      >
        <div className="p-4 sm:p-6">{renderView()}</div>
      </main>
    </div>
  );
}
