'use client'

import { useSession, signOut } from 'next-auth/react'
import { Bell, User, LogOut } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export function Header() {
  const { data: session } = useSession()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  if (!session) return null

  return (
    <header className="bg-charcoal-900/80 backdrop-blur-sm shadow-2xl border-b border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-charcoal-400 hover:text-white">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}\            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-purple-500"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-charcoal-700 flex items-center justify-center">
                    <User className="h-5 w-5 text-charcoal-400" />
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium text-white">
                  {session.user.name}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-charcoal-800 rounded-md shadow-lg py-1">
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-charcoal-700 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}