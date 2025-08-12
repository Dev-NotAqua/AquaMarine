'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ServerList } from '@/components/dashboard/server-list'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { Activity, Server, Users, Music, Shield } from 'lucide-react'

interface StatsData {
  totalServers: number
  totalUsers: number
  activeUsers: number
  totalSongsPlayed: number
  moderationActions: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData>({
    totalServers: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalSongsPlayed: 0,
    moderationActions: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="mt-2 text-sm text-charcoal-400">
            Real-time overview of your Discord bot&rsquo;s performance and activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <StatsCard
            title="Total Servers"
            value={stats.totalServers}
            icon={Server}
            color="blue"
            loading={loading}
          />
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="green"
            loading={loading}
          />
          <StatsCard
            title="Active Users"
            value={stats.activeUsers}
            icon={Activity}
            color="purple"
            loading={loading}
          />
          <StatsCard
            title="Songs Played"
            value={stats.totalSongsPlayed}
            icon={Music}
            color="yellow"
            loading={loading}
          />
          <StatsCard
            title="Mod Actions"
            value={stats.moderationActions}
            icon={Shield}
            color="red"
            loading={loading}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ServerList />
          </div>
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}