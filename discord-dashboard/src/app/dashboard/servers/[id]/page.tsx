'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ServerHeader } from '@/components/server/server-header'
import { ServerStats } from '@/components/server/server-stats'
import { ServerSettings } from '@/components/server/server-settings'
import { ServerModeration } from '@/components/server/server-moderation'
import { ServerMusic } from '@/components/server/server-music'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Server {
  id: string
  name: string
  icon: string | null
  memberCount: number
  ownerId: string
  createdAt: string
  joinedAt: string
}

interface ServerStatsData {
  songsPlayed: number
  moderationActions: number
  messagesReceived: number
  commandsUsed: number
  activeUsers: number
}

export default function ServerPage() {
  const params = useParams()
  const serverId = params.id as string
  
  const [server, setServer] = useState<Server | null>(null)
  const [stats, setStats] = useState<ServerStatsData>({
    songsPlayed: 0,
    moderationActions: 0,
    messagesReceived: 0,
    commandsUsed: 0,
    activeUsers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (serverId) {
      fetchServerData()
    }
  }, [serverId])

  const fetchServerData = async () => {
    try {
      const [serverResponse, statsResponse] = await Promise.all([
        fetch(`/api/servers/${serverId}`),
        fetch(`/api/servers/${serverId}/stats`)
      ])
      
      if (serverResponse.ok && statsResponse.ok) {
        const serverData = await serverResponse.json()
        const statsData = await statsResponse.json()
        
        setServer(serverData)
        setStats(statsData)
      }
    } catch (error) {
      console.error('Error fetching server data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!server) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Server Not Found</h1>
          <p className="text-gray-600">The requested server could not be found.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ServerHeader server={server} />
        <ServerStats stats={stats} />
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ServerSettings serverId={serverId} />
              <ServerModeration serverId={serverId} />
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <ServerSettings serverId={serverId} />
          </TabsContent>
          
          <TabsContent value="moderation">
            <ServerModeration serverId={serverId} />
          </TabsContent>
          
          <TabsContent value="music">
            <ServerMusic serverId={serverId} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}