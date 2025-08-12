export interface Server {
  id: string
  name: string
  icon: string | null
  memberCount: number
  ownerId: string
  createdAt: string
  joinedAt: string
}

export interface ServerStatsData {
  songsPlayed: number
  moderationActions: number
  messagesReceived: number
  commandsUsed: number
  activeUsers: number
}