'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function SettingsView() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    storageAlerts: true,
    weeklyReports: false,
    twoFactorAuth: true,
  })

  const handleToggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
    toast.success({
      title: 'Setting Updated',
      description: `${key.replace(/([A-Z])/g, ' $1')} has been updated`,
    })
  }

  const handleSaveSettings = () => {
    toast.success({
      title: 'Settings Saved',
      description: 'Your preferences have been saved successfully',
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure platform settings and preferences.
        </p>
      </div>

      {/* Notification Settings */}
      <Card className="rounded-xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              key: 'emailNotifications',
              label: 'Email Notifications',
              description: 'Receive email updates about your account',
            },
            {
              key: 'storageAlerts',
              label: 'Storage Alerts',
              description: 'Get notified when storage usage reaches 80%',
            },
            {
              key: 'weeklyReports',
              label: 'Weekly Reports',
              description: 'Receive weekly usage reports',
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-lg border border-border/50 p-3"
            >
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Switch
                checked={settings[item.key]}
                onCheckedChange={() => handleToggleSetting(item.key)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="rounded-xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Enabled
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Two-factor authentication is currently enabled
              </p>
            </div>
            <Switch checked={settings.twoFactorAuth} onCheckedChange={() => handleToggleSetting('twoFactorAuth')} />
          </div>

          <div className="rounded-lg border border-border/50 p-3">
            <p className="font-medium text-foreground">API Keys</p>
            <p className="text-sm text-muted-foreground">Manage your API keys and access tokens</p>
            <Button variant="outline" size="sm" className="mt-3 rounded-lg">
              Manage API Keys
            </Button>
          </div>

          <div className="rounded-lg border border-border/50 p-3">
            <p className="font-medium text-foreground">Change Password</p>
            <p className="text-sm text-muted-foreground">Update your account password</p>
            <Button variant="outline" size="sm" className="mt-3 rounded-lg">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Storage Configuration */}
      <Card className="rounded-xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Storage Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-xs text-muted-foreground">Default User Storage</p>
              <p className="mt-1 text-2xl font-bold text-foreground">100 GB</p>
            </div>
            <div className="rounded-lg border border-border/50 p-3">
              <p className="text-xs text-muted-foreground">Max Upload Size</p>
              <p className="mt-1 text-2xl font-bold text-foreground">5 GB</p>
            </div>
          </div>

          <Button onClick={handleSaveSettings} className="w-full rounded-lg transition-all duration-200 hover:scale-[1.02]">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
