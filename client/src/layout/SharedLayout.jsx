import { ActivityFeed } from "@/Pages/share/activity-feed";
import { Collaborators } from "@/Pages/share/collaborators";
import { ShareAnalytics } from "@/Pages/share/share-analytics";
import { ShareStats } from "@/Pages/share/share-stats";
import { SharedByMe } from "@/Pages/share/shared-by-me";
import { SharedWithMe } from "@/Pages/share/shared-with-me";
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Share2, Download, Bell, Settings } from 'lucide-react'

 function SharedLayout() {
  return (
    <div className="min-h-screen bg-background">   
        <div className="mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground font-plusjakartaSans">Share Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1 font-inter ">Manage and track all your file sharing activities</p>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <main className="mx-auto pr-6 font-inter  py-8">
        {/* Stats */}
        <section className="mb-8">
          <ShareStats />
        </section>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <SharedByMe />
            <SharedWithMe />
            <Collaborators />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <ShareAnalytics />
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <ActivityFeed />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default SharedLayout