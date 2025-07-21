import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import crypto from 'crypto'

interface GenerateCredentialRequest {
  userId: string
  credentialType: 'proof-of-age'
  age: number
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data: GenerateCredentialRequest = await request.json()
    
    // Generate a unique validation code
    const validationCode = crypto.randomBytes(16).toString('hex').toUpperCase()
    
    // Set expiry to 4 hours from now
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 4)
    
    // Create digital signature (simplified for demo)
    const signatureData = {
      userId: data.userId,
      credentialType: data.credentialType,
      age: data.age,
      issuedAt: new Date().toISOString(),
      validationCode
    }
    
    const signature = crypto
      .createHmac('sha256', process.env.NEXTAUTH_SECRET || 'demo-secret')
      .update(JSON.stringify(signatureData))
      .digest('hex')
    
    const credential = {
      id: crypto.randomUUID(),
      userId: data.userId,
      credentialType: data.credentialType,
      issuedAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      isOver18: data.age >= 18,
      isOver21: data.age >= 21,
      validationCode,
      issuer: 'Isle of Man Government' as const,
      signature
    }
    
    // In a real application, you would store this in a database
    console.log('Generated credential:', credential)
    
    return NextResponse.json(credential)
    
  } catch (error) {
    console.error('Credential generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate credential' },
      { status: 500 }
    )
  }
} 