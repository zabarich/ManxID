'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.object({
    line1: z.string().min(5, 'Address line 1 is required'),
    line2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    postcode: z.string().regex(/^[A-Z]{2}\d{1,2} \d[A-Z]{2}$/i, 'Invalid postcode format'),
    country: z.string().default('Isle of Man')
  }),
  niNumber: z.string().regex(/^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/i, 'Invalid NI number format').optional()
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function UserProfile() {
  const { data: session, update } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: session?.user?.name?.split(' ')[0] || '',
      lastName: session?.user?.name?.split(' ')[1] || '',
      email: session?.user?.email || '',
      dateOfBirth: session?.user?.dateOfBirth || '',
      phone: session?.user?.phone || '',
      address: {
        line1: session?.user?.address?.line1 || '',
        line2: session?.user?.address?.line2 || '',
        city: session?.user?.address?.city || '',
        postcode: session?.user?.address?.postcode || '',
        country: session?.user?.address?.country || 'Isle of Man'
      },
      niNumber: session?.user?.niNumber || ''
    }
  })

  const onSubmit = async (data: ProfileFormData) => {
    setUpdateStatus('loading')
    
    try {
      // Simulate API call to update profile and propagate to government services
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          propagateToServices: true // Tell Us Once functionality
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const result = await response.json()
      
      // Update session with new data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          dateOfBirth: data.dateOfBirth,
          phone: data.phone,
          address: data.address,
          niNumber: data.niNumber
        }
      })

      setUpdateStatus('success')
      setLastUpdated(new Date())
      setIsEditing(false)
      
      // Show success for 3 seconds
      setTimeout(() => setUpdateStatus('idle'), 3000)
      
    } catch (error) {
      console.error('Profile update failed:', error)
      setUpdateStatus('error')
      setTimeout(() => setUpdateStatus('idle'), 3000)
    }
  }

  const services = [
    { name: 'Tax Records', updated: true },
    { name: 'Vehicle Registration', updated: true },
    { name: 'Benefits', updated: true },
    { name: 'Health Records', updated: true },
    { name: 'Education', updated: false }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Your Profile
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Tell Us Once - update your details everywhere
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary text-sm"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Status Messages */}
      {updateStatus === 'success' && (
        <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-800 dark:text-green-200">
            Profile updated successfully and propagated to all government services
          </span>
        </div>
      )}

      {updateStatus === 'error' && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <span className="text-sm text-red-800 dark:text-red-200">
            Failed to update profile. Please try again.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-government-blue" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Personal Information
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                First Name *
              </label>
              <input
                type="text"
                {...register('firstName')}
                disabled={!isEditing}
                className="form-input"
              />
              {errors.firstName && (
                <p className="form-error">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                Last Name *
              </label>
              <input
                type="text"
                {...register('lastName')}
                disabled={!isEditing}
                className="form-input"
              />
              {errors.lastName && (
                <p className="form-error">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                Date of Birth *
              </label>
              <input
                type="date"
                {...register('dateOfBirth')}
                disabled={!isEditing}
                className="form-input"
              />
              {errors.dateOfBirth && (
                <p className="form-error">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                National Insurance Number
              </label>
              <input
                type="text"
                {...register('niNumber')}
                disabled={!isEditing}
                className="form-input"
                placeholder="AB123456C"
              />
              {errors.niNumber && (
                <p className="form-error">{errors.niNumber.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="w-5 h-5 text-government-blue" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Contact Information
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="form-label">
                Email Address *
              </label>
              <input
                type="email"
                {...register('email')}
                disabled={!isEditing}
                className="form-input"
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                Phone Number *
              </label>
              <input
                type="tel"
                {...register('phone')}
                disabled={!isEditing}
                className="form-input"
                placeholder="+44 1624 123456"
              />
              {errors.phone && (
                <p className="form-error">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-5 h-5 text-government-blue" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Address
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="form-label">
                Address Line 1 *
              </label>
              <input
                type="text"
                {...register('address.line1')}
                disabled={!isEditing}
                className="form-input"
                placeholder="House number and street name"
              />
              {errors.address?.line1 && (
                <p className="form-error">{errors.address.line1.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                Address Line 2
              </label>
              <input
                type="text"
                {...register('address.line2')}
                disabled={!isEditing}
                className="form-input"
                placeholder="Apartment, suite, etc. (optional)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">
                  City/Town *
                </label>
                <input
                  type="text"
                  {...register('address.city')}
                  disabled={!isEditing}
                  className="form-input"
                />
                {errors.address?.city && (
                  <p className="form-error">{errors.address.city.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  Postcode *
                </label>
                <input
                  type="text"
                  {...register('address.postcode')}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder="IM1 2AB"
                />
                {errors.address?.postcode && (
                  <p className="form-error">{errors.address.postcode.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  Country
                </label>
                <input
                  type="text"
                  {...register('address.country')}
                  disabled={true}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        {isEditing && (
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  reset()
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isDirty || updateStatus === 'loading'}
                className="btn-primary flex items-center space-x-2"
              >
                {updateStatus === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Changes</span>
              </button>
            </div>
            
            {isDirty && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Changes will be applied to all government services
              </p>
            )}
          </div>
        )}
      </form>

      {/* Service Propagation Status */}
      {lastUpdated && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Tell Us Once - Service Updates
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {services.map((service) => (
              <div key={service.name} className="flex items-center space-x-2">
                {service.updated ? (
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
                )}
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  {service.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 