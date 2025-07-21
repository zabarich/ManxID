'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Camera,
  FileText,
  User,
  CheckCircle,
  ArrowRight,
  Shield,
  Smartphone,
  Upload,
  Eye
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: any
  completed: boolean
}

export default function OnboardingFlow() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Manx ID',
      description: 'Set up your digital identity wallet',
      icon: Shield,
      completed: false
    },
    {
      id: 'document',
      title: 'Document Verification',
      description: 'Scan your passport or ID card',
      icon: FileText,
      completed: false
    },
    {
      id: 'biometric',
      title: 'Biometric Verification',
      description: 'Take a selfie for identity confirmation',
      icon: Camera,
      completed: false
    },
    {
      id: 'profile',
      title: 'Complete Profile',
      description: 'Verify your personal information',
      icon: User,
      completed: false
    }
  ]

  const handleStepComplete = async (stepId: string) => {
    setIsProcessing(true)
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mark step as completed
      steps[currentStep].completed = true
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        // Complete onboarding
        await completeOnboarding()
      }
    } catch (error) {
      console.error('Step completion error:', error)
    } finally {
      setIsProcessing(false)
    }
  }
  
  const completeOnboarding = async () => {
    try {
      // Update session to mark onboarding as completed
      await update({
        ...session,
        user: {
          ...session?.user,
          onboardingCompleted: true,
          dateOfBirth: '1995-06-15', // Mock data
          address: {
            line1: '123 Main Street',
            city: 'Douglas',
            postcode: 'IM1 2AB',
            country: 'Isle of Man'
          },
          phone: '+44 1624 123456',
          niNumber: 'AB123456C'
        }
      })
      
      router.push('/')
    } catch (error) {
      console.error('Onboarding completion error:', error)
    }
  }

  const renderStepContent = () => {
    const step = steps[currentStep]
    
    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-government-blue to-primary-600 rounded-2xl p-8 text-white">
              <Shield className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Welcome to Manx ID</h2>
              <p className="text-blue-100">
                Your secure digital identity wallet for Isle of Man government services
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-left">
                <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-2">
                  <Smartphone className="w-5 h-5 text-government-blue" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    One wallet, all services
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Access tax, vehicle, health, and education services with one login
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 text-left">
                <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-2">
                  <Shield className="w-5 h-5 text-government-blue" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Bank-level security
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your data is encrypted and stays within UK/EU borders
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleStepComplete('welcome')}
              disabled={isProcessing}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )
        
      case 'document':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="w-16 h-16 text-government-blue mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Document Verification
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Scan your passport or national ID card to verify your identity
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                In a real implementation, this would open your camera to scan documents
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Demo Mode:</strong> Document scanning is simulated for this demonstration
                </p>
              </div>
            </div>
            
            <button
              onClick={() => handleStepComplete('document')}
              disabled={isProcessing}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              <span>{isProcessing ? 'Processing Document...' : 'Simulate Document Scan'}</span>
            </button>
          </div>
        )
        
      case 'biometric':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Camera className="w-16 h-16 text-government-blue mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Biometric Verification
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Take a selfie to confirm your identity matches your documents
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center space-y-4">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center">
                <Eye className="w-12 h-12 text-gray-400" />
              </div>
              
              <div className="space-y-2">
                <p className="font-medium text-gray-900 dark:text-white">
                  Ready for biometric capture
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Look directly at the camera and ensure good lighting
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Demo Mode:</strong> Biometric capture is simulated for this demonstration
                </p>
              </div>
            </div>
            
            <button
              onClick={() => handleStepComplete('biometric')}
              disabled={isProcessing}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
              <span>{isProcessing ? 'Processing Biometrics...' : 'Capture Biometrics'}</span>
            </button>
          </div>
        )
        
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="w-16 h-16 text-government-blue mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Complete Your Profile
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Verify the information extracted from your documents
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Verified Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Name:</span>
                    <span className="text-gray-900 dark:text-white">
                      {session?.user?.name || 'John Smith'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Date of Birth:</span>
                    <span className="text-gray-900 dark:text-white">15/06/1995</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Address:</span>
                    <span className="text-gray-900 dark:text-white">123 Main Street, Douglas</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-800 dark:text-green-200">
                    All information has been verified successfully
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleStepComplete('profile')}
              disabled={isProcessing}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>{isProcessing ? 'Completing Setup...' : 'Complete Setup'}</span>
            </button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="mobile-container">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-government-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border">
          {renderStepContent()}
        </div>
        
        {/* Step Indicators */}
        <div className="mt-8">
          <div className="flex justify-center space-x-2">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.id}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index <= currentStep
                      ? 'bg-government-blue text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
} 