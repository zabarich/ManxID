import { notFound } from 'next/navigation'
import { Shield, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'

interface VerificationPageProps {
  params: {
    code: string
  }
}

// Mock verification function - in reality this would check against a database
async function verifyCredential(validationCode: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Mock verification logic
  const mockCredentials = [
    {
      validationCode: 'A1B2C3D4E5F6G7H8',
      isValid: true,
      isOver18: true,
      isOver21: false,
      issuer: 'Isle of Man Government',
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4 hours from now
    }
  ]
  
  // For demo purposes, generate a mock result based on the code
  const isValid = validationCode.length === 32 && /^[A-F0-9]+$/i.test(validationCode)
  
  if (!isValid) {
    return null
  }
  
  return {
    validationCode,
    isValid: true,
    isOver18: true,
    isOver21: validationCode.charAt(0) > 'M', // Simple logic for demo
    issuer: 'Isle of Man Government',
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    verifiedAt: new Date().toISOString()
  }
}

export default async function VerificationPage({ params }: VerificationPageProps) {
  const { code } = params
  
  if (!code || code.length !== 32) {
    notFound()
  }
  
  const credential = await verifyCredential(code)
  
  if (!credential) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="mobile-container">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Invalid Credential
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This validation code is not recognized or has expired.
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">
                Please ensure the QR code is valid and has not expired.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  const isExpired = new Date(credential.expiresAt) < new Date()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="mobile-container">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-8 h-8 text-government-blue" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Manx ID Verification
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Digital Identity Verification System
          </p>
        </div>
        
        {/* Verification Result */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border">
          <div className="text-center mb-6">
            {!isExpired ? (
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            ) : (
              <Clock className="w-20 h-20 text-amber-500 mx-auto mb-4" />
            )}
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {!isExpired ? 'Credential Verified' : 'Credential Expired'}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400">
              {!isExpired 
                ? 'This is a valid government-issued digital credential'
                : 'This credential has expired and is no longer valid'
              }
            </p>
          </div>
          
          {/* Age Verification */}
          {!isExpired && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`p-6 rounded-xl border text-center ${
                credential.isOver18 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <div className={`text-4xl font-bold mb-2 ${
                  credential.isOver18 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  18+
                </div>
                <div className={`text-lg font-medium ${
                  credential.isOver18 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {credential.isOver18 ? '✓ Verified' : '✗ Not verified'}
                </div>
              </div>
              
              <div className={`p-6 rounded-xl border text-center ${
                credential.isOver21 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <div className={`text-4xl font-bold mb-2 ${
                  credential.isOver21 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  21+
                </div>
                <div className={`text-lg font-medium ${
                  credential.isOver21 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {credential.isOver21 ? '✓ Verified' : '✗ Not verified'}
                </div>
              </div>
            </div>
          )}
          
          {/* Credential Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Verification Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Issuer:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {credential.issuer}
                </p>
              </div>
              
              <div>
                <span className="text-gray-500 dark:text-gray-400">Verified At:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(credential.verifiedAt).toLocaleString()}
                </p>
              </div>
              
              <div>
                <span className="text-gray-500 dark:text-gray-400">Status:</span>
                <p className={`font-medium ${
                  !isExpired ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {!isExpired ? 'Valid' : 'Expired'}
                </p>
              </div>
              
              <div>
                <span className="text-gray-500 dark:text-gray-400">Expires:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(credential.expiresAt).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Validation Code:</span>
              <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                {credential.validationCode}
              </p>
            </div>
          </div>
          
          {/* Security Notice */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-2">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Security Notice
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  This verification is cryptographically signed by the Isle of Man Government. 
                  No personal information is shared during this verification process.
                </p>
              </div>
            </div>
          </div>
          
          {/* Expired Warning */}
          {isExpired && (
            <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                    Credential Expired
                  </h4>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    This credential has expired and should not be accepted as valid proof of age. 
                    Please request a new credential from the user.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by Manx ID • Isle of Man Government Digital Identity System
          </p>
        </div>
      </div>
    </div>
  )
} 