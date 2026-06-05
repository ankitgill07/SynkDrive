import Header from '@/components/Header/Header'
import SideBare from '@/components/Sidebare/SideBare'
import { userAuth } from '@/contextApi/AuthContext'
import React from 'react'
import { Outlet } from 'react-router-dom'

function MainLayout() {


  return (
<div className="flex min-h-screen">
  <aside className="w-64">
    <SideBare />
  </aside>

  <div className="flex-1">
    <Header />
    <main className="pt-20 px-5">
      <Outlet />
    </main>
  </div>
</div>
  )
}

export default MainLayout