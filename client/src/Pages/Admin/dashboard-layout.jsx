import { useSelector, useDispatch } from 'react-redux'
import { toggleSidebar, setActiveView } from '@/lib/dashboardSlice'
import { cn } from '@/lib/utils'
import Sidebar from './sidebar'
import TopNav from './top-nav'
import DashboardView from './dashboard-view'
import UsersView from './users-view'
import StorageView from './storage-view'
import LogsView from './logs-view'
import SettingsView from './settings-view'

export default function DashboardLayout() {
  const dispatch = useDispatch()
  const { sidebarCollapsed, activeView } = useSelector((state) => state.dashboard)

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }

  const handleSetActiveView = (view) => {
    dispatch(setActiveView(view))
  }

  const renderView = () => {
    switch (activeView) {
      case 'users':
        return <UsersView />
      case 'storage':
        return <StorageView />
      case 'logs':
        return <LogsView />
      case 'settings':
        return <SettingsView />
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar sidebarCollapsed={sidebarCollapsed} onToggleSidebar={handleToggleSidebar} setActiveView={handleSetActiveView} />
      <TopNav sidebarCollapsed={sidebarCollapsed} />
      <main
        className={cn(
          'mt-16 flex-1 overflow-auto transition-all duration-200',
          sidebarCollapsed ? 'ml-[72px]' : 'ml-[240px]'
        )}
      >
        <div className="p-6">{renderView()}</div>
      </main>
    </div>
  )
}
