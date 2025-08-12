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

    const logs = await prisma.log.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    const activities = logs.map(log => {
      let type: 'moderation' | 'music' | 'join' | 'leave' = 'moderation'
      let action = 'performed an action'
      let details = ''

      switch (log.type) {
        case 'MODERATION':
          type = 'moderation'
          action = log.action || 'performed an action'
          details = log.reason || log.metadata || 'No details provided'
          break
        case 'MUSIC':
          type = 'music'
          action = log.action || 'played'
          details = log.metadata || 'Unknown song'
          break
        case 'SYSTEM':
          if (log.action?.includes('JOIN')) {
            type = 'join'
            action = 'joined'
            details = 'Welcome to the server!'
          } else if (log.action?.includes('LEAVE')) {
            type = 'leave'
            action = 'left'
            details = 'Goodbye!'
          } else {
            type = 'moderation'
            action = log.action || 'performed an action'
            details = log.reason || log.metadata || ''
          }
          break
        case 'SECURITY':
          type = 'moderation'
          action = log.action || 'security action'
          details = log.reason || log.metadata || ''
          break
        default:
          type = 'moderation'
          action = log.action || 'performed an action'
          details = log.reason || log.metadata || ''
      }

      return {
        id: log.id,
        type,
        action,
        user: {
          name: log.userName || 'Unknown User',
          avatar: null
        },
        guild: {
          name: 'Server'
        },
        timestamp: log.createdAt,
        details
      }
    })

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}