import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  Calendar, 
  CreditCard, 
  Target,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/lancamentos', icon: PlusCircle, label: 'Lançamentos' },
  { path: '/painel', icon: BarChart3, label: 'Painel' },
  { path: '/calendario', icon: Calendar, label: 'Calendário' },
  { path: '/parcelamentos', icon: CreditCard, label: 'Parcelamentos' },
  { path: '/metas', icon: Target, label: 'Metas e Objetivos' },
]

export default function Sidebar({ open, setOpen }) {
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transition-all duration-300 ease-in-out
        ${open ? 'w-64' : 'w-16'}
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className={`transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Ultra Finanças
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(!open)}
            className="lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-3 py-2 rounded-lg transition-colors duration-200
                  ${isActive 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }
                  ${!open ? 'justify-center' : ''}
                `}
                onClick={() => setOpen(false)} // Close sidebar on mobile after click
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className={`
                  ml-3 transition-opacity duration-300
                  ${open ? 'opacity-100' : 'opacity-0 lg:opacity-0'}
                  ${!open ? 'hidden lg:hidden' : ''}
                `}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Logo compacto quando fechado */}
        {!open && (
          <div className="hidden lg:flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UF</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

