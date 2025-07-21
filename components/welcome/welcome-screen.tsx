'use client'

import { signIn } from 'next-auth/react'
import { Shield, Smartphone, Clock, CheckCircle } from 'lucide-react'
import Image from 'next/image'

export default function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-manx-blue to-government-blue">
      {/* Header */}
      <header className="pt-8 pb-6">
        <div className="mobile-container">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
              <Shield className="w-6 h-6 text-manx-blue" />
            </div>
            <h1 className="text-2xl font-bold text-white">Manx ID</h1>
          </div>
          <p className="text-center text-blue-100 text-sm">
            Your secure digital identity wallet
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4">
        <div className="max-w-md mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">
                Welcome to the Future of Government Services
              </h2>
                        <p className="text-blue-100 text-sm leading-relaxed">
            One secure login, one profile update, access to tax records, vehicle licensing, benefits, healthcare, and more Isle of Man government services.
          </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 rounded-full p-2 mt-0.5">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Mobile First</h3>
                <p className="text-blue-100 text-xs">
                  Designed for your smartphone with offline capabilities
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-white/20 rounded-full p-2 mt-0.5">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Secure & Private</h3>
                            <p className="text-blue-100 text-xs">
              Bank-level security with your data staying in the Isle of Man/EU
            </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-white/20 rounded-full p-2 mt-0.5">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Tell Us Once</h3>
                <p className="text-blue-100 text-xs">
                  Update your address once and all departments are notified
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-white/20 rounded-full p-2 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Proof of Age</h3>
                <p className="text-blue-100 text-xs">
                  Digital credentials you can use anywhere on the island
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <button
              onClick={() => signIn('demo', { callbackUrl: '/' })}
              className="w-full bg-white text-government-blue font-semibold py-3 px-6 rounded-xl 
                       hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-white/30 
                       transition-all duration-200 shadow-lg"
            >
              Get Started with Manx ID
            </button>
            
            <p className="text-center text-xs text-blue-100">
              Demo login - any credentials work for testing
            </p>
          </div>

          {/* Demo Notice */}
          <div className="mt-8 bg-manx-gold/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <div className="bg-manx-gold/30 rounded-full p-1">
                <svg className="w-3 h-3 text-manx-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-manx-gold font-medium mb-1">Demo Version</p>
                <p className="text-xs text-blue-100 leading-relaxed">
                  This is a demonstration version. No real personal data is stored or processed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-8">
        <div className="mobile-container">
          <div className="text-center">
                      <p className="text-xs text-blue-200">
            © 2025 Isle of Man Government • Digital Identity Demo
          </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 