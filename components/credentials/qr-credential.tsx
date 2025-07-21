'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import QRCode from 'react-qr-code'
import {
  QrCode,
  Download,
  Share2,
  RefreshCw,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface ProofOfAgeCredential {
  id: string
  userId: string
  credentialType: 'proof-of-age'
  issuedAt: string
  expiresAt: string
  isOver18: boolean
  isOver21: boolean
  validationCode: string
  issuer: 'Isle of Man Government'
  signature: string
}

export default function QRCredential() {
  const { data: session } = useSession()
  const [credential, setCredential] = useState<ProofOfAgeCredential | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  useEffect(() => {
    if (session?.user) {
      generateCredential()
    }
  }, [session])

  useEffect(() => {
    if (credential) {
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const expiry = new Date(credential.expiresAt).getTime()
        const difference = expiry - now

        if (difference > 0) {
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
        } else {
          setTimeRemaining('Expired')
          clearInterval(timer)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [credential])

  const generateCredential = async () => {
    if (!session?.user) return

    setIsGenerating(true)
    
    try {
      // Calculate age from date of birth
      const dateOfBirth = new Date(session.user.dateOfBirth || '2000-01-01')
      const today = new Date()
      const age = today.getFullYear() - dateOfBirth.getFullYear()
      const monthDiff = today.getMonth() - dateOfBirth.getMonth()
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate()) 
        ? age - 1 : age

      const response = await fetch('/api/credentials/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: session.user.id,
          credentialType: 'proof-of-age',
          age: actualAge
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate credential')
      }

      const newCredential = await response.json()
      setCredential(newCredential)
    } catch (error) {
      console.error('Failed to generate credential:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const refreshCredential = () => {
    generateCredential()
  }

  const shareCredential = async () => {
    if (!credential) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Manx ID - Proof of Age',
          text: `Validation Code: ${credential.validationCode}`,
          url: `${window.location.origin}/verify/${credential.validationCode}`
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/verify/${credential.validationCode}`)
    }
  }

  const downloadQR = () => {
    if (!credential) return

    const svg = document.getElementById('qr-code-svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = 'manx-id-proof-of-age.png'
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  if (!session?.user) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Please sign in to view your credentials
        </p>
      </div>
    )
  }

  if (isGenerating && !credential) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="w-8 h-8 text-government-blue mx-auto mb-4 animate-spin" />
        <p className="text-gray-600 dark:text-gray-400">
          Generating your proof of age credential...
        </p>
      </div>
    )
  }

  if (!credential) {
    return (
      <div className="text-center py-8">
        <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No credential available
        </p>
        <button onClick={generateCredential} className="btn-primary">
          Generate Proof of Age
        </button>
      </div>
    )
  }

  const qrData = JSON.stringify({
    id: credential.id,
    type: credential.credentialType,
    validationCode: credential.validationCode,
    isOver18: credential.isOver18,
    isOver21: credential.isOver21,
    issuer: credential.issuer,
    issuedAt: credential.issuedAt,
    expiresAt: credential.expiresAt,
    verifyUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${credential.validationCode}`
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Shield className="w-6 h-6 text-government-blue" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Proof of Age
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Show this QR code to verify your age
        </p>
      </div>

      {/* QR Code Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border shadow-sm">
        <div className="text-center mb-4">
          <div className="qr-container inline-block">
            <QRCode
              id="qr-code-svg"
              value={qrData}
              size={200}
              level="H"
              style={{ background: 'white', padding: '20px' }}
            />
          </div>
        </div>

        {/* Status and Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Valid Credential
            </span>
          </div>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Expires in: {timeRemaining}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={refreshCredential}
              disabled={isGenerating}
              className="flex items-center justify-center space-x-1 p-2 text-sm text-gray-600 dark:text-gray-400 
                       hover:text-government-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 
                       rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={shareCredential}
              className="flex items-center justify-center space-x-1 p-2 text-sm text-gray-600 dark:text-gray-400 
                       hover:text-government-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 
                       rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button
              onClick={downloadQR}
              className="flex items-center justify-center space-x-1 p-2 text-sm text-gray-600 dark:text-gray-400 
                       hover:text-government-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 
                       rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Age Verification Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg border ${
          credential.isOver18 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              credential.isOver18 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
            }`}>
              18+
            </div>
            <div className={`text-sm ${
              credential.isOver18 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {credential.isOver18 ? 'Verified' : 'Not verified'}
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          credential.isOver21 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              credential.isOver21 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
            }`}>
              21+
            </div>
            <div className={`text-sm ${
              credential.isOver21 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {credential.isOver21 ? 'Verified' : 'Not verified'}
            </div>
          </div>
        </div>
      </div>

      {/* Credential Details */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900 dark:text-white">
            Credential Details
          </span>
          <div className={`transform transition-transform ${showDetails ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {showDetails && (
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Validation Code:</span>
              <span className="font-mono text-gray-900 dark:text-white">{credential.validationCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Issued:</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(credential.issuedAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Expires:</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(credential.expiresAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Issuer:</span>
              <span className="text-gray-900 dark:text-white">{credential.issuer}</span>
            </div>
          </div>
        )}
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          How to use this credential
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Show the QR code to verify your age instantly</li>
          <li>• Staff can scan with any QR code reader</li>
          <li>• No personal information is shared</li>
          <li>• Valid across all Isle of Man establishments</li>
        </ul>
      </div>
    </div>
  )
} 