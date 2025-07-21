'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import {
  User,
  Settings,
  QrCode,
  FileText,
  Car,
  CreditCard,
  Heart,
  GraduationCap,
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-react'
import ServiceCard from './service-card'
import UserProfile from './user-profile'
import QRCredential from '../credentials/qr-credential'

interface ServiceData {
  [key: string]: string
}

interface Service {
  id: string
  title: string
  description: string
  icon: any
  status: 'active' | 'expiring' | 'attention' | 'inactive'
  lastUpdated: string
  action: string
  color: string
  data: ServiceData
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'qr'>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const services: Service[] = [
    {
      id: 'tax',
      title: 'Tax Records',
      description: 'View tax returns and payments',
      icon: FileText,
      status: 'active',
      lastUpdated: '2 days ago',
      action: 'View Details',
      color: 'bg-green-50 text-green-700',
      data: {
        taxYear: '2024/25',
        statusText: 'Up to date',
        nextReturn: '31 Jan 2025'
      }
    },
    {
      id: 'vehicle',
      title: 'Vehicle Licence',
      description: 'Manage vehicle registration',
      icon: Car,
      status: 'expiring',
      lastUpdated: '1 week ago',
      action: 'Renew Now',
      color: 'bg-amber-50 text-amber-700',
      data: {
        registration: 'MN65 ABC',
        expires: '15 Feb 2025',
        taxDue: '£150'
      }
    },
    {
      id: 'benefits',
      title: 'Benefits',
      description: 'View benefit payments',
      icon: CreditCard,
      status: 'active',
      lastUpdated: '3 days ago',
      action: 'View Payments',
      color: 'bg-blue-50 text-blue-700',
      data: {
        nextPayment: '28 Jan 2025',
        amount: '£320',
        type: 'Housing Benefit'
      }
    },
    {
      id: 'health',
      title: 'Health Records',
      description: 'NHS number and appointments',
      icon: Heart,
      status: 'active',
      lastUpdated: '5 days ago',
      action: 'View Records',
      color: 'bg-red-50 text-red-700',
      data: {
        nhsNumber: '***-***-1234',
        gp: 'Douglas Medical Centre',
        lastAppointment: '15 Jan 2025'
      }
    },
    {
      id: 'education',
      title: 'Education',
      description: 'Qualifications and grants',
      icon: GraduationCap,
      status: 'active',
      lastUpdated: '1 month ago',
      action: 'View Details',
      color: 'bg-purple-50 text-purple-700',
      data: {
        institution: 'Isle of Man College',
        grant: 'Higher Education Grant',
        statusText: 'Approved'
      }
    }
  ]

  const renderContent = () => {
    switch (activeView) {
      case 'profile':
        return <UserProfile />
      case 'qr':
        return <QRCredential />
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-government-blue to-primary-600 rounded-xl p-6 text-white">
              <h2 className="text-xl font-semibold mb-2">
                Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}
              </h2>
              <p className="text-blue-100 text-sm">
                You have 1 service requiring attention
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setActiveView('qr')}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border 
                         hover:shadow-md transition-shadow text-left"
              >
                <QrCode className="w-5 h-5 text-government-blue mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Proof of Age
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Show QR code
                </p>
              </button>

              <button
                onClick={() => setActiveView('profile')}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border 
                         hover:shadow-md transition-shadow text-left"
              >
                <Settings className="w-5 h-5 text-government-blue mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Tell Us Once
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Update details
                </p>
              </button>
            </div>

            {/* Service Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Services
              </h3>
              <div className="space-y-3">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="mobile-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-government-blue rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                Manx ID
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <nav className="mobile-container py-4 space-y-2">
              <button
                onClick={() => {
                  setActiveView('dashboard')
                  setMobileMenuOpen(false)
                }}
                className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-lg 
                  ${activeView === 'dashboard' 
                    ? 'bg-government-blue text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <FileText className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => {
                  setActiveView('profile')
                  setMobileMenuOpen(false)
                }}
                className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-lg 
                  ${activeView === 'profile' 
                    ? 'bg-government-blue text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  setActiveView('qr')
                  setMobileMenuOpen(false)
                }}
                className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-lg 
                  ${activeView === 'qr' 
                    ? 'bg-government-blue text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <QrCode className="w-5 h-5" />
                <span>Proof of Age</span>
              </button>
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-lg 
                         text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="mobile-container py-6">
        {renderContent()}
      </main>
    </div>
  )
} 