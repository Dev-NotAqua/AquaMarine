'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: { [key: string]: string } = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'Access denied. You do not have permission to sign in.',
    OAuthSignin: 'Error in constructing an authorization URL.',
    OAuthCallback: 'Error in handling the response from an OAuth provider.',
    OAuthCreateAccount: 'Could not create OAuth provider account.',
    EmailCreateAccount: 'Could not create email provider account.',
    Callback: 'Error in the OAuth callback handler.',
    OAuthAccountNotLinked: 'Your email is already linked to another account.',
    EmailSignin: 'Check your email address.',
    CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
    SessionRequired: 'Please sign in to access this page.',
    Default: 'Unable to sign in.'
  }

  const message = errorMessages[error || 'Default'] || errorMessages.Default

  return (
    <>
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-gradient-to-br from-royal-purple-600 to-royal-purple-800 rounded-2xl flex items-center justify-center shadow-lg">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          Authentication Error
        </h2>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-charcoal-900/80 backdrop-blur-sm py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-charcoal-800">
          <div className="text-center">
            <p className="text-sm text-charcoal-300 mb-6">{message}</p>
            <Link
              href="/auth/signin"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-royal-purple-600 to-royal-purple-800 hover:from-royal-purple-700 hover:to-royal-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-charcoal-900 focus:ring-royal-purple-500 transition-all duration-200 transform hover:scale-105"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default function AuthError() {
  return (
    <div className="min-h-screen bg-charcoal-950 relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Enhanced Grid Background */}
      <div className="pointer-events-none absolute inset-0 grid-bg-dense"></div>
      
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal-950 via-charcoal-950/95 to-charcoal-950"></div>

      <Suspense fallback={<div className="relative z-10 text-center text-white">Loading…</div>}>
        <AuthErrorContent />
      </Suspense>
    </div>
  )
}