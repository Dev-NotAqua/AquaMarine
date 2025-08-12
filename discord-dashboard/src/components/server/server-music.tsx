interface ServerMusicProps {
  serverId: string
}

export function ServerMusic({ serverId }: ServerMusicProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Music Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Volume
            </label>
            <input
              type="number"
              min="1"
              max="100"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              defaultValue="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Queue Size
            </label>
            <input
              type="number"
              min="1"
              max="100"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              defaultValue="50"
            />
          </div>
          <div className="flex items-center">
            <input
              id="enableMusic"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              defaultChecked
            />
            <label htmlFor="enableMusic" className="ml-2 block text-sm text-gray-900">
              Enable music features
            </label>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Music Settings
          </button>
        </div>
      </div>
    </div>
  )
}