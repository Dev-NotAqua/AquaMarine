interface ServerStatsData {
  songsPlayed: number
  moderationActions: number
  messagesReceived: number
  commandsUsed: number
  activeUsers: number
}

interface ServerStatsProps {
  stats: ServerStatsData
}

export function ServerStats({ stats }: ServerStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="bg-white shadow rounded-lg p-4">
        <div className="text-sm font-medium text-gray-500">Songs Played</div>
        <div className="text-2xl font-bold text-gray-900">{stats.songsPlayed}</div>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <div className="text-sm font-medium text-gray-500">Moderation Actions</div>
        <div className="text-2xl font-bold text-gray-900">{stats.moderationActions}</div>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <div className="text-sm font-medium text-gray-500">Messages</div>
        <div className="text-2xl font-bold text-gray-900">{stats.messagesReceived}</div>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <div className="text-sm font-medium text-gray-500">Commands</div>
        <div className="text-2xl font-bold text-gray-900">{stats.commandsUsed}</div>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <div className="text-sm font-medium text-gray-500">Active Users</div>
        <div className="text-2xl font-bold text-gray-900">{stats.activeUsers}</div>
      </div>
    </div>
  )
}