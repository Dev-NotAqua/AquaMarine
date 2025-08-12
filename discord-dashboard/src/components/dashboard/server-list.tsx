'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Users, Music, Shield } from 'lucide-react'

interface Server {
  id: string
  name: string
  icon: string | null
  memberCount: number
  musicQueue: number
  moderationActions: number
  joinedAt: string
}

export function ServerList() {
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServers()
  }, [])

  const fetchServers = async () => {
    try {
      const response = await fetch('/api/servers')
      const data = await response.json()
      setServers(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch servers:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-charcoal-900/80 backdrop-blur-sm shadow-2xl rounded-xl border border-charcoal-800">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-white mb-4">
            Connected Servers
          </h3>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/6"></div>
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
          Connected Servers ({servers.length})
        </h3>
        
        <div className="space-y-4">
          {servers.map((server) => (
            <div
              key={server.id}
              className="flex items-center justify-between p-4 bg-charcoal-800 rounded-lg hover:bg-charcoal-700 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {server.icon ? (
                  <Image
                    src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`}
                    alt={server.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-12 w-12 bg-charcoal-700 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-charcoal-400">
                      {server.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                <div>
                  <Link
                    href={`/dashboard/servers/${server.id}`}
                    className="text-sm font-medium text-white hover:text-royal-purple-400"
                  >
                    {server.name}
                  </Link>
                  <p className="text-xs text-charcoal-400">
                    Joined {new Date(server.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-charcoal-400">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{server.memberCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Music className="h-4 w-4" />
                  <span>{server.musicQueue}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>{server.moderationActions}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}