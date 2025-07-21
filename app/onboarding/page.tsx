import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import OnboardingFlow from '@/components/onboarding/onboarding-flow'

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  // If user has already completed onboarding, redirect to dashboard
  if (session.user.onboardingCompleted) {
    redirect('/')
  }

  return <OnboardingFlow />
} 