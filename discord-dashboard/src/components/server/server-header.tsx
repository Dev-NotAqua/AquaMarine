import { Server } from '@/types/server'

interface ServerHeaderProps {
  server: Server
}

export function ServerHeader({ server }: ServerHeaderProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center space-x-4">
          {server.icon && (
            <img
              src={server.icon}
              alt={server.name}
              className="h-16 w-16 rounded-lg"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{server.name}</h1>
            <p className="text-sm text-gray-500">
              {server.memberCount} members • Joined {new Date(server.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}