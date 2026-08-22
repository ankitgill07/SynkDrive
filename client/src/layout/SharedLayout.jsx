
import { ShareStats } from "@/Pages/share/share-stats";
import { SharedByMe } from "@/Pages/share/shared-by-me";
import { SharedWithMe } from "@/Pages/share/shared-with-me";
import { getSharedFileDashboardApi } from "@/api/shareApi";
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Share2, Download, Bell, Settings } from 'lucide-react'
import { useEffect, useState } from "react";
import { toast } from "sonner";

function SharedLayout() {
  const [shareWithMe, setShareWithMe] = useState([])
  const [shareByMe, setShareByMe] = useState([])
  const [stats, setStats] = useState({
    shareWithMe: 0,
    shareByMe: 0
  })
  useEffect(() => {
    handleToloadShareDashboardInfo()
  }, [])

  const handleToloadShareDashboardInfo = async () => {
    try {
      const result = await getSharedFileDashboardApi()
      console.log(result);
      setShareByMe(result.data.sharedByMe)
      setShareWithMe(result.data.sharedWithMe)
      setStats({
        shareWithMe: result?.data?.count?.totalSharedWithFiles,
        shareByMe: result?.data?.count?.totalSharedByMeFiles
      })
    } catch (error) {
      toast.error(error?.message)
    }
  }
console.log(stats);

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
          <ShareStats statsCount={stats}/>
        </section>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-6">
  
          <TabsContent value="overview" className="space-y-6">
            <SharedByMe shareByMe={shareByMe}/>
            <SharedWithMe shareWithMe={shareWithMe}/>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default SharedLayout