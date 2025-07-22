import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      onboardingCompleted?: boolean
      dateOfBirth?: string
      address?: {
        line1: string
        line2?: string
        city: string
        postcode: string
        country: string
      }
      phone?: string
      niNumber?: string
      passportNumber?: string
    }
  }

  interface User {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
    onboardingCompleted?: boolean
    dateOfBirth?: string
    address?: {
      line1: string
      line2?: string
      city: string
      postcode: string
      country: string
    }
    phone?: string
    niNumber?: string
    passportNumber?: string
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'manx-id-demo-secret-minimum-32-chars-long-for-nextauth-security',
  providers: [
    CredentialsProvider({
      id: 'demo',
      name: 'Demo Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'demo@gov.im' },
        password: { label: 'Password', type: 'password', placeholder: 'demo' }
      },
      async authorize(credentials) {
        console.log('Authorize called with:', { email: credentials?.email, password: credentials?.password })
        
        // Simple demo authentication - fixed user for consistent experience
        console.log('Demo credentials - allowing login')
        return {
          id: 'demo-user-123',
          name: 'Emily Johnson',
          email: 'demo@gov.im',
          onboardingCompleted: false,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Initial login
      if (account && user) {
        return {
          ...token,
          id: user.id,
          onboardingCompleted: user.onboardingCompleted || false,
        }
      }
      
      // Session update (when update() is called)
      if (trigger === 'update' && session) {
        return {
          ...token,
          ...session,
        }
      }
      
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          onboardingCompleted: token.onboardingCompleted as boolean,
          // Include other profile fields if they exist
          dateOfBirth: token.dateOfBirth as string,
          address: token.address as any,
          phone: token.phone as string,
          niNumber: token.niNumber as string,
        },
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: 'manx-id-session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
} 