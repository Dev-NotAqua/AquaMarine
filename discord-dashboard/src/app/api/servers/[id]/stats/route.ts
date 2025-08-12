import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get music stats
    const musicStats = await prisma.guildStats.findFirst({
      where: { 
        guildId: id,
        type: 'music'
      }
    })

    // Get moderation stats
    const moderationStats = await prisma.guildStats.findFirst({
      where: { 
        guildId: id,
        type: 'commands'
      }
    })

    // Get message stats
    const messageStats = await prisma.guildStats.findFirst({
      where: { 
        guildId: id,
        type: 'messages'
      }
    })

    // Get moderation actions count
    const moderationActions = await prisma.log.count({
      where: {
        guildId: id,
        type: 'MODERATION'
      }
    })

    // Get active users (last 24 hours)
    const activeUsers = await prisma.log.findMany({
      where: {
        guildId: id,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      select: {
        userId: true
      },
      distinct: ['userId']
    }).then(users => users.length)

    return NextResponse.json({
      songsPlayed: musicStats?.value || 0,
      moderationActions,
      messagesReceived: messageStats?.value || 0,
      commandsUsed: moderationStats?.value || 0,
      activeUsers
    })
  } catch (error) {
    console.error('Error fetching server stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}