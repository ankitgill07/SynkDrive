import Header from '@/components/Header/Header'
import SideBare from '@/components/Sidebare/SideBare'
import { userAuth } from '@/contextApi/AuthContext'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  const { user, checkAuthorization } = userAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - responsive container handles absolute/fixed on mobile and static on desktop */}
      <SideBare 
        user={user} 
        checkAuthorization={checkAuthorization} 
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header 
          user={user} 
          onMenuClick={() => setMobileSidebarOpen(true)}
        />
        <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout