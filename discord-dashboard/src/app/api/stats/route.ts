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

    // Get total servers where bot is present
    const totalServers = await prisma.guild.count()

    // Get total unique users across all guilds
    const totalUsers = await prisma.guild.aggregate({
      _sum: {
        memberCount: true
      }
    })

    // Get active users (last 24 hours)
    const activeUsers = await prisma.log.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      select: {
        userId: true
      },
      distinct: ['userId']
    }).then(users => users.length)

    // Get total songs played
    const totalSongsPlayed = await prisma.guildStats.aggregate({
      _sum: {
        value: true
      },
      where: {
        type: 'MUSIC'
      }
    })

    // Get total moderation actions
    const moderationActions = await prisma.log.count({
      where: {
        type: 'MODERATION'
      }
    })

    return NextResponse.json({
      totalServers,
      totalUsers: totalUsers._sum.memberCount || 0,
      activeUsers,
      totalSongsPlayed: totalSongsPlayed._sum.value || 0,
      moderationActions
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}