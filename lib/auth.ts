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
        // Demo authentication - in production this would verify against real credentials
        if (credentials?.email === 'demo@gov.im' && credentials?.password === 'demo') {
          return {
            id: 'demo-user-123',
            name: 'Emily Johnson',
            email: 'demo@gov.im',
            onboardingCompleted: false,
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          id: user.id,
          onboardingCompleted: user.onboardingCompleted || false,
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