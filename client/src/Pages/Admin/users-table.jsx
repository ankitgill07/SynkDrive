'use client'

import { useState, useMemo, useEffect } from 'react'
import { cn } from '@/lib/utils'
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
import { getAdminUsers, updateAdminUser, deleteAdminUser, bulkDeleteUsers, logoutAdminUser, bulkLogoutUsers } from '@/api/AdminApi'

const statusColors = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  disabled: 'bg-red-50 text-red-700 border-red-200',
}

const roleColors = {
  admin: 'bg-amber-50 text-amber-700 border-amber-200',
  manager: 'bg-blue-50 text-blue-700 border-blue-200',
  user: 'bg-gray-100 text-gray-600 border-gray-200',
}

const roleLabels = {
  admin: 'Admin',
  manager: 'Manager',
  user: 'User',
}

export default function UsersTable({ currentRole, isAdmin }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

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

  const fetchUsers = async () => {
    setLoading(true)
    const params = {
      page: currentPage,
      limit: pageSize,
      search: searchQuery,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      role: roleFilter !== 'all' ? roleFilter : undefined,
      sortField: sortField,
      sortDirection: sortDirection,
    }
    const data = await getAdminUsers(params)
    if (data && !data.error) {
      setUsers(data.users || [])
      setTotalCount(data.totalCount || data.total || 0)
    } else {
      toast.error('Failed to fetch users')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, pageSize, searchQuery, statusFilter, roleFilter, sortField, sortDirection])

  const totalPages = Math.ceil(totalCount / pageSize) || 1

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(new Set(users.map((u) => u._id || u.id)))
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

  const handleSaveUser = async (updates) => {
    const userId = editingUser._id || editingUser.id
    const data = await updateAdminUser(userId, updates)
    if (data && !data.error) {
      toast.success('User updated successfully')
      setEditingUser(null)
      fetchUsers()
    } else {
      toast.error(data?.message || data?.error || 'Failed to update user')
    }
  }

  const handleDeleteUser = (user) => {
    setDeleteConfirm(user)
  }

  const handleConfirmDelete = async () => {
    const userId = deleteConfirm._id || deleteConfirm.id
    const data = await deleteAdminUser(userId)
    if (data && !data.error) {
      toast.success(`${deleteConfirm.name} has been deleted`)
      setDeleteConfirm(null)
      fetchUsers()
    } else {
      toast.error(data?.message || data?.error || 'Failed to delete user')
    }
  }

  const handleForceLogout = (user) => {
    setLogoutConfirm(user)
  }

  const handleConfirmLogout = async () => {
    const userId = logoutConfirm._id || logoutConfirm.id
    const data = await logoutAdminUser(userId)
    if (data && !data.error) {
      toast.success(`${logoutConfirm.name} has been logged out`)
      setLogoutConfirm(null)
      fetchUsers()
    } else {
      toast.error(data?.message || data?.error || 'Failed to logout user')
    }
  }

  const handleBulkDelete = async () => {
    const data = await bulkDeleteUsers(Array.from(selectedUsers))
    if (!data.error) {
      toast.success(`${selectedUsers.size} users have been deleted`)
      setSelectedUsers(new Set())
      fetchUsers()
    } else {
      toast.error('Failed to bulk delete users')
    }
  }

  const handleBulkLogout = async () => {
    const data = await bulkLogoutUsers(Array.from(selectedUsers))
    if (!data.error) {
      toast.success(`${selectedUsers.size} users have been logged out`)
      setSelectedUsers(new Set())
      fetchUsers()
    } else {
      toast.error('Failed to bulk logout users')
    }
  }

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Role', 'Status', 'Storage Used (GB)', 'Allocated (GB)', 'Created At'],
      ...users.map((user) => [
        user.name,
        user.email,
        roleLabels[(user.role || '').toLowerCase()] || user.role,
        user.isDisable ? 'disabled' : 'active',
        (user.usedStorage / (1024 ** 3)).toFixed(2),
        (user.maxStorageLimite / (1024 ** 3)).toFixed(2),
        format(new Date(user.createdAt), 'yyyy-MM-dd HH:mm'),
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

    toast.success(`${users.length} users exported to CSV`)
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
              <SelectItem value="disabled">Disabled</SelectItem>
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
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="user">User</SelectItem>
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
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="h-8 hover:bg-red-100 hover:text-red-700"
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Delete
                </Button>
              )}
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
                      checked={selectedUsers.size === users.length && users.length > 0}
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
                      onClick={() => handleSort('usedStorage')}
                    >
                      <div className="flex items-center gap-2">
                        Storage
                        {sortField === 'usedStorage' && (
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
                {loading ? (
                  <tr>
                    <td colSpan="10" className="py-12 text-center text-muted-foreground">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-12 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => {
                    const userId = user._id || user.id
                    const status = user.isDisable ? 'disabled' : 'active'
                    const role = (user.role || '').toLowerCase()
                    const isTargetAdmin = ['admin'].includes(role)
                    const canEdit = isAdmin || !isTargetAdmin

                    const formatStorageSize = (bytes) => {
                      if (!bytes || bytes === 0) return '0 B'
                      const k = 1024
                      const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
                      const i = Math.floor(Math.log(bytes) / Math.log(k))
                      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
                    }

                    const usedFormatted = formatStorageSize(user.storageUsed || 0)
                    const limitGB = (user.maxStorageLimite / (1024 ** 3)).toFixed(2) + ' GB'
                    const pct = user.maxStorageLimite ? Math.min(((user.storageUsed || 0) / user.maxStorageLimite) * 100, 100) : 0

                    return (
                      <tr
                        key={userId}
                        className={cn(
                          'transition-colors duration-150 hover:bg-[#F8F9FA]',
                          index % 2 === 1 && 'bg-muted/30',
                          selectedUsers.has(userId) && 'bg-primary/5'
                        )}
                      >
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={selectedUsers.has(userId)}
                            onCheckedChange={(checked) =>
                              handleSelectUser(userId, checked)
                            }
                          />
                        </td>
                        {visibleColumns.user && (
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.picture} />
                                <AvatarFallback>
                                  {user.name?.split(' ').map((n) => n[0]).join('') || 'U'}
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
                          <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                            {String(userId).slice(-8)}
                          </td>
                        )}
                        {visibleColumns.storage && (
                          <td className="px-4 py-3">
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-foreground">
                                {usedFormatted} / {limitGB}
                              </div>
                              <Progress
                                value={pct}
                                className="h-1.5 w-20"
                              />
                            </div>
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={cn('font-medium capitalize', statusColors[status])}
                            >
                              {status === 'active' && (
                                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              )}
                              {status}
                            </Badge>
                          </td>
                        )}
                        {visibleColumns.role && (
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={cn('font-medium', roleColors[role] || roleColors['user'])}
                            >
                              {roleLabels[role] || role}
                            </Badge>
                          </td>
                        )}
                        {visibleColumns.createdAt && (
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
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
                                <DropdownMenuItem
                                  disabled={!canEdit}
                                  onClick={() => canEdit && handleEditUser(user)}
                                >
                                  <Pencil className="mr-2 h-3.5 w-3.5" />
                                  {canEdit ? 'Edit' : 'Edit (Admin Only)'}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleForceLogout(user)}
                                  className="text-amber-600"
                                >
                                  <LogOut className="mr-2 h-3.5 w-3.5" />
                                  Force Logout
                                </DropdownMenuItem>
                                {isAdmin && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteUser(user)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                                      Delete
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        )}
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
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
              <span className="text-sm text-muted-foreground">of {totalCount}</span>
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
          currentRole={currentRole}
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
