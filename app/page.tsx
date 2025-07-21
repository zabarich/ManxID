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
  // TEMPORARY: Skip onboarding for demo-user-123 after first completion
  if (!session.user.onboardingCompleted && session.user.id !== 'demo-user-123-completed') {
    redirect('/onboarding')
  }

  return <Dashboard />
} 