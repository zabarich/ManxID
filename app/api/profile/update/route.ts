import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface UpdateProfileRequest {
  firstName: string
  lastName: string
  dateOfBirth: string
  email: string
  phone: string
  address: {
    line1: string
    line2?: string
    city: string
    postcode: string
    country: string
  }
  niNumber?: string
  propagateToServices: boolean
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data: UpdateProfileRequest = await request.json()
    
    // Simulate database update
    console.log('Updating profile for user:', session.user.id)
    console.log('Profile data:', data)
    
    // Simulate Tell Us Once - propagate to government services
    const serviceUpdates = []
    
    if (data.propagateToServices) {
      const services = [
        'tax-code-service',
        'vehicle-tax-service',
        'driving-licence-service',
        'benefits-service',
        'gp-registration-service',
        'electoral-register-service',
        'payments-service',
        'education-service'
      ]
      
      for (const service of services) {
        // Simulate API calls to each government service
        console.log(`Updating ${service} with new profile data...`)
        
        // Mock success response for demo
        serviceUpdates.push({
          service,
          status: 'success',
          updatedAt: new Date().toISOString()
        })
        
        // Add a small delay to simulate real API calls
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      serviceUpdates,
      updatedAt: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
} 