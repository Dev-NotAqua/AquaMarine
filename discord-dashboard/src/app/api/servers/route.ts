import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const servers = await prisma.guild.findMany({
      include: {
        stats: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedServers = servers.map(server => {
      const musicStats = server.stats?.find(s => s.type === 'music')
      const moderationStats = server.stats?.find(s => s.type === 'commands')
      
      return {
        id: server.id,
        name: server.name,
        icon: server.icon,
        memberCount: server.memberCount,
        musicQueue: musicStats?.value || 0,
        moderationActions: moderationStats?.value || 0,
        joinedAt: server.createdAt
      }
    })

    return NextResponse.json(formattedServers)
  } catch (error) {
    console.error('Error fetching servers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}