'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function OnboardingCompletionHandler() {
  const router = useRouter()
  const { data: session, update } = useSession()

  useEffect(() => {
    const completeOnboardingAndRedirect = async () => {
      console.log('OnboardingCompletionHandler: Starting completion process')
      
      try {
        // Update the session
        await update({
          ...session,
          user: {
            ...session?.user,
            onboardingCompleted: true
          }
        })
        
        console.log('OnboardingCompletionHandler: Session updated, redirecting...')
        
        // Small delay to ensure session is updated
        setTimeout(() => {
          window.location.replace('/')
        }, 500)
        
      } catch (error) {
        console.error('OnboardingCompletionHandler: Error:', error)
        // Fallback redirect
        router.push('/')
      }
    }

    completeOnboardingAndRedirect()
  }, [session, update, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-manx-blue to-government-blue">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-white text-xl font-medium">Completing setup...</h2>
        <p className="text-blue-100 text-sm mt-2">Taking you to your dashboard</p>
      </div>
    </div>
  )
} 