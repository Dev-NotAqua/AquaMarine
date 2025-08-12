'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red'
  loading?: boolean
}

const colorClasses = {
  blue: 'bg-royal-purple-900/20 text-royal-purple-400',
  green: 'bg-royal-purple-900/20 text-royal-purple-400',
  purple: 'bg-royal-purple-900/20 text-royal-purple-400',
  yellow: 'bg-royal-purple-900/20 text-royal-purple-400',
  red: 'bg-royal-purple-900/20 text-royal-purple-400'
}

export function StatsCard({ title, value, icon: Icon, color, loading }: StatsCardProps) {
  return (
    <div className="bg-charcoal-900/80 backdrop-blur-sm overflow-hidden shadow-2xl rounded-xl border border-charcoal-800">
      <div className="p-5">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 p-3 rounded-md", colorClasses[color])}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-charcoal-400 truncate">{title}</dt>
              <dd className="text-lg font-medium text-white">
                {loading ? (
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  value.toLocaleString()
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}