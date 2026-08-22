'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Checkbox } from '@/components/ui/checkbox'

export default function EditUserModal({
  open = false,
  user = null,
  currentRole = 'manager',
  onOpenChange = () => {},
  onSave = () => {},
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', role: 'user', isDisable: false, storageGB: 1 })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user && open) {
      setFormData({
        name: user.name,
        email: user.email,
        role: (user.role || 'user').toLowerCase(),
        isDisable: user.isDisable || false,
        storageGB: user.maxStorageLimite ? user.maxStorageLimite / (1024 ** 3) : 1
      });
    } else {
      setFormData({ name: '', email: '', role: 'user', isDisable: false, storageGB: 1 });
    }
    setErrors({});
  }, [user, open]);

  const isAdmin = ['admin'].includes(currentRole);

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Invalid email address'
    }
    if (formData.storageGB <= 0) newErrors.storageGB = 'Storage must be positive'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true)
      const updates = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        isDisable: formData.isDisable,
        maxStorageLimite: formData.storageGB * (1024 ** 3)
      }
      await onSave(updates)
      setIsLoading(false)
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl border-0 shadow-lg sm:max-w-md sm:rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className={`rounded-lg transition-all duration-200 focus-visible:ring-primary ${
                errors.name ? 'border-destructive' : ''
              }`}
              placeholder="Enter user name"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className={`rounded-lg transition-all duration-200 focus-visible:ring-primary ${
                errors.email ? 'border-destructive' : ''
              }`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger id="role" className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                {isAdmin && <SelectItem value="admin">Admin</SelectItem>}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="storageGB" className="text-sm font-medium">
              Max Storage (GB)
            </label>
            <Input
              id="storageGB"
              type="number"
              value={formData.storageGB}
              onChange={(e) => setFormData((prev) => ({ ...prev, storageGB: parseFloat(e.target.value) || 0 }))}
              className={`rounded-lg transition-all duration-200 focus-visible:ring-primary ${
                errors.storageGB ? 'border-destructive' : ''
              }`}
            />
            {errors.storageGB && (
              <p className="text-xs text-destructive">{errors.storageGB}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="isDisable" 
              checked={formData.isDisable}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isDisable: checked }))}
            />
            <label
              htmlFor="isDisable"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Disable Account
            </label>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-lg transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-lg transition-all duration-200 hover:scale-[1.02]"
            >
              {isLoading && <Spinner className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
