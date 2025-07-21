import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Dashboard from '@/components/dashboard/dashboard'
import WelcomeScreen from '@/components/welcome/welcome-screen'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return <WelcomeScreen />
  }

  // Check if user needs to complete onboarding
  if (!session.user.onboardingCompleted) {
    redirect('/onboarding')
  }

  return <Dashboard />
} 