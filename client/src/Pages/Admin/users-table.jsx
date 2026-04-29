'use client'

import { useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cn } from '@/lib/utils'
import { updateUser, deleteUser, forceLogoutUser } from '@/lib/dashboardSlice'
import { formatDistanceToNow, format } from 'date-fns'
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Pencil,
  LogOut,
  Trash2,
  Download,
  Columns3,
  ChevronsUpDown,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import ConfirmModal from './confirm-modal'
import EditUserModal from './edit-user-modal'
import { toast } from 'sonner'

const statusColors = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  offline: 'bg-gray-100 text-gray-600 border-gray-200',
  deleted: 'bg-red-50 text-red-700 border-red-200',
}

const roleColors = {
  super_admin: 'bg-blue-50 text-blue-700 border-blue-200',
  admin: 'bg-amber-50 text-amber-700 border-amber-200',
  viewer: 'bg-gray-100 text-gray-600 border-gray-200',
}

const roleLabels = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  viewer: 'Viewer',
}

export default function UsersTable() {
  const dispatch = useDispatch()
  const { users } = useSelector((state) => state.dashboard)

  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [selectedUsers, setSelectedUsers] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [visibleColumns, setVisibleColumns] = useState({
    user: true,
    userId: true,
    storage: true,
    status: true,
    role: true,
    lastActive: true,
    createdAt: true,
    actions: true,
  })
  const [editingUser, setEditingUser] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [logoutConfirm, setLogoutConfirm] = useState(null)

  const filteredUsers = useMemo(() => {
    let result = [...users]

    if (searchQuery) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((user) => user.status === statusFilter)
    }

    if (roleFilter !== 'all') {
      result = result.filter((user) => user.role === roleFilter)
    }

    result.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [users, searchQuery, statusFilter, roleFilter, sortField, sortDirection])

  const totalPages = Math.ceil(filteredUsers.length / pageSize)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(new Set(paginatedUsers.map((u) => u.id)))
    } else {
      setSelectedUsers(new Set())
    }
  }

  const handleSelectUser = (userId, checked) => {
    const newSelected = new Set(selectedUsers)
    if (checked) {
      newSelected.add(userId)
    } else {
      newSelected.delete(userId)
    }
    setSelectedUsers(newSelected)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
  }

  const handleSaveUser = (updates) => {
    dispatch(updateUser({ userId: editingUser.id, updates }))
    setEditingUser(null)
    toast.success({
      title: 'Success',
      description: 'User updated successfully',
    })
  }

  const handleDeleteUser = (user) => {
    setDeleteConfirm(user)
  }

  const handleConfirmDelete = () => {
    dispatch(deleteUser(deleteConfirm.id))
    setDeleteConfirm(null)
    toast.success({
      title: 'User Deleted',
      description: `${deleteConfirm.name} has been deleted`,
    })
  }

  const handleForceLogout = (user) => {
    setLogoutConfirm(user)
  }

  const handleConfirmLogout = () => {
    dispatch(forceLogoutUser(logoutConfirm.id))
    setLogoutConfirm(null)
    toast.success({
      title: 'User Logged Out',
      description: `${logoutConfirm.name} has been logged out`,
    })
  }

  const handleBulkDelete = () => {
    selectedUsers.forEach((userId) => {
      dispatch(deleteUser(userId))
    })
    setSelectedUsers(new Set())
    toast.success({
      title: 'Users Deleted',
      description: `${selectedUsers.size} users have been deleted`,
    })
  }

  const handleBulkLogout = () => {
    selectedUsers.forEach((userId) => {
      dispatch(forceLogoutUser(userId))
    })
    setSelectedUsers(new Set())
    toast.success({
      title: 'Users Logged Out',
      description: `${selectedUsers.size} users have been logged out`,
    })
  }

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Role', 'Status', 'Storage (GB)', 'Created At', 'Last Active'],
      ...filteredUsers.map((user) => [
        user.name,
        user.email,
        roleLabels[user.role],
        user.status,
        user.storageUsed,
        format(user.createdAt, 'yyyy-MM-dd HH:mm'),
        formatDistanceToNow(user.lastActive, { addSuffix: true }),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users-export.csv'
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success({
      title: 'Export Complete',
      description: `${filteredUsers.length} users exported to CSV`,
    })
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <Select value={statusFilter} onValueChange={(val) => {
            setStatusFilter(val)
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>

          <Select value={roleFilter} onValueChange={(val) => {
            setRoleFilter(val)
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" title="Column visibility">
                <Columns3 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.keys(visibleColumns).map((col) => (
                <DropdownMenuCheckboxItem
                  key={col}
                  checked={visibleColumns[col]}
                  onCheckedChange={(checked) =>
                    setVisibleColumns((prev) => ({
                      ...prev,
                      [col]: checked,
                    }))
                  }
                >
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleExport}
                title="Export as CSV"
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export as CSV</TooltipContent>
          </Tooltip>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.size > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <span className="text-sm font-medium text-blue-900">
              {selectedUsers.size} selected
            </span>
            <div className="ml-auto flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBulkLogout}
                className="h-8"
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                Logout
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBulkDelete}
                className="h-8 hover:bg-red-100 hover:text-red-700"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedUsers(new Set())}
                className="h-8"
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-xl border-0 bg-card p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="px-4 py-3 text-left font-semibold">
                    <Checkbox
                      checked={selectedUsers.size === paginatedUsers.length && paginatedUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  {visibleColumns.user && (
                    <th
                      className="cursor-pointer px-4 py-3 text-left font-semibold hover:bg-muted/50"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        User
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )
                        )}
                      </div>
                    </th>
                  )}
                  {visibleColumns.userId && (
                    <th className="px-4 py-3 text-left font-semibold">ID</th>
                  )}
                  {visibleColumns.storage && (
                    <th
                      className="cursor-pointer px-4 py-3 text-left font-semibold hover:bg-muted/50"
                      onClick={() => handleSort('storageUsed')}
                    >
                      <div className="flex items-center gap-2">
                        Storage
                        {sortField === 'storageUsed' && (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )
                        )}
                      </div>
                    </th>
                  )}
                  {visibleColumns.status && (
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                  )}
                  {visibleColumns.role && (
                    <th className="px-4 py-3 text-left font-semibold">Role</th>
                  )}
                  {visibleColumns.lastActive && (
                    <th
                      className="cursor-pointer px-4 py-3 text-left font-semibold hover:bg-muted/50"
                      onClick={() => handleSort('lastActive')}
                    >
                      <div className="flex items-center gap-2">
                        Last Active
                        {sortField === 'lastActive' && (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )
                        )}
                      </div>
                    </th>
                  )}
                  {visibleColumns.createdAt && (
                    <th
                      className="cursor-pointer px-4 py-3 text-left font-semibold hover:bg-muted/50"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center gap-2">
                        Created
                        {sortField === 'createdAt' && (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )
                        )}
                      </div>
                    </th>
                  )}
                  {visibleColumns.actions && (
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={cn(
                      'transition-colors duration-150 hover:bg-[#F8F9FA]',
                      index % 2 === 1 && 'bg-muted/30',
                      selectedUsers.has(user.id) && 'bg-primary/5'
                    )}
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedUsers.has(user.id)}
                        onCheckedChange={(checked) =>
                          handleSelectUser(user.id, checked)
                        }
                      />
                    </td>
                    {visibleColumns.user && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
                            <AvatarFallback>
                              {user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">
                              {user.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                    )}
                    {visibleColumns.userId && (
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {user.id}
                      </td>
                    )}
                    {visibleColumns.storage && (
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-foreground">
                            {user.storageUsed} GB
                          </div>
                          <Progress
                            value={(user.storageUsed / 1024) * 100}
                            className="h-1.5 w-20"
                          />
                        </div>
                      </td>
                    )}
                    {visibleColumns.status && (
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={cn('font-medium capitalize', statusColors[user.status])}
                        >
                          {user.status === 'active' && (
                            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          )}
                          {user.status}
                        </Badge>
                      </td>
                    )}
                    {visibleColumns.role && (
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={cn('font-medium', roleColors[user.role])}
                        >
                          {roleLabels[user.role]}
                        </Badge>
                      </td>
                    )}
                    {visibleColumns.lastActive && (
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {formatDistanceToNow(user.lastActive, { addSuffix: true })}
                      </td>
                    )}
                    {visibleColumns.createdAt && (
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {format(user.createdAt, 'MMM dd, yyyy')}
                      </td>
                    )}
                    {visibleColumns.actions && (
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Pencil className="mr-2 h-3.5 w-3.5" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleForceLogout(user)}
                              className="text-amber-600"
                            >
                              <LogOut className="mr-2 h-3.5 w-3.5" />
                              Force Logout
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <Select value={String(pageSize)} onValueChange={(val) => {
                setPageSize(parseInt(val))
                setCurrentPage(1)
              }}>
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">of {filteredUsers.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Modals */}
        <EditUserModal
          open={!!editingUser}
          user={editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          onSave={handleSaveUser}
        />
        
        <ConfirmModal
          open={!!deleteConfirm}
          title="Delete User"
          description={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
          confirmLabel="Delete"
          confirmVariant="destructive"
          onOpenChange={(open) => !open && setDeleteConfirm(null)}
          onConfirm={handleConfirmDelete}
        />

        <ConfirmModal
          open={!!logoutConfirm}
          title="Force Logout"
          description={`Force logout ${logoutConfirm?.name}? They will be logged out immediately.`}
          confirmLabel="Logout"
          onOpenChange={(open) => !open && setLogoutConfirm(null)}
          onConfirm={handleConfirmLogout}
        />
      </div>
    </TooltipProvider>
  )
}
