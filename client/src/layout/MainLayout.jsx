import Header from '@/components/Header/Header'
import SideBare from '@/components/Sidebare/SideBare'
import { userAuth } from '@/contextApi/AuthContext'
import React from 'react'
import { Outlet } from 'react-router-dom'

function MainLayout() {


  return (
    <div className="grid grid-cols-[280px_1fr] min-h-screen">
      {/* Sidebar column */}
      <aside className="col-span-1">
        <SideBare />
      </aside>

      {/* Content column */}
      <div className="col-span-1">
        <Header />
        <main className="pt-18 mt-6  ">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout