'use client'

import { Plus } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import UsersTable from './users-table'

export default function UsersView() {
  const { users } = useSelector((state) => state.dashboard)

  return (
    <div className="space-y-6">
     
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, permissions, and storage allocations.
          </p>
        </div>
        <Button className="gap-2 rounded-xl shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <UsersTable />
    </div>
  )
}
