'use client'

import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Shield, Music, UserPlus, UserMinus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Activity {
  id: string
  type: 'moderation' | 'music' | 'join' | 'leave'
  action: string
  user: {
    name: string
    avatar: string | null
  }
  guild: {
    name: string
  }
  timestamp: string
  details: string
}

const activityIcons = {
  moderation: Shield,
  music: Music,
  join: UserPlus,
  leave: UserMinus
}

const activityColors = {
  moderation: 'text-red-400 bg-royal-purple-900/20',
  music: 'text-royal-purple-400 bg-royal-purple-900/20',
  join: 'text-green-400 bg-royal-purple-900/20',
  leave: 'text-charcoal-400 bg-royal-purple-900/20'
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
    const interval = setInterval(fetchActivities, 10000) // Update every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities')
      const data = await response.json()
      setActivities(data.slice(0, 10)) // Get latest 10 activities
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch activities:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-charcoal-900/80 backdrop-blur-sm shadow-2xl rounded-xl border border-charcoal-800">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-3">
                  <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Recent Activity
        </h3>
        
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type]
            const colorClass = activityColors[activity.type]
            
            return (
              <div key={activity.id} className="flex space-x-3">
                <div className={cn("flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center", colorClass)}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    <span className="font-medium">{activity.user.name}</span>
                    <span className="text-gray-500"> {activity.action} </span>
                    <span className="font-medium">{activity.guild.name}</span>
                  </p>
                  <p className="text-xs text-charcoal-400">
                    {activity.details}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            )
          })}
          
          {activities.length === 0 && (
            <p className="text-sm text-charcoal-400 text-center py-8">
              No recent activity
            </p>
          )}
        </div>
      </div>
    </div>
  )
}