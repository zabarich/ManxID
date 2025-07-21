'use client'

import { AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { ComponentType } from 'react'

interface ServiceData {
  [key: string]: string
}

interface Service {
  id: string
  title: string
  description: string
  icon: ComponentType<any>
  status: 'active' | 'expiring' | 'attention' | 'inactive'
  lastUpdated: string
  action: string
  color: string
  data: ServiceData
}

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { title, description, icon: Icon, status, lastUpdated, action, color, data } = service

  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'expiring':
        return <AlertCircle className="w-4 h-4 text-amber-500" />
      case 'attention':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'expiring':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
      case 'attention':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <div className="service-card group">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {title}
              </h3>
              {getStatusIcon()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {description}
            </p>
            
            {/* Service specific data */}
            <div className="space-y-1">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge()}`}>
            {status === 'active' ? 'Up to date' : 
             status === 'expiring' ? 'Expiring soon' : 
             status === 'attention' ? 'Needs attention' : 'Inactive'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {lastUpdated}
          </span>
        </div>
        
        <button 
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors 
            ${status === 'expiring' || status === 'attention' 
              ? 'bg-government-blue text-white hover:bg-opacity-90' 
              : 'text-government-blue hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
        >
          {action}
        </button>
      </div>
    </div>
  )
} 