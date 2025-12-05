import { useState } from 'react'
import Reminders from './components/Reminders'
import Customers from './components/Customers'
import Properties from './components/Properties'

type View = 'reminders' | 'customers' | 'properties'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('reminders')

  const navItems: { id: View; label: string }[] = [
    { id: 'reminders', label: 'Reminders' },
    { id: 'customers', label: 'Customers' },
    { id: 'properties', label: 'Properties' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">SweepCRM</h1>
          <p className="text-gray-600">Chimney Sweep Customer Management System</p>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow">
          <nav className="p-6 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl">
            {currentView === 'reminders' && <Reminders />}
            {currentView === 'customers' && <Customers />}
            {currentView === 'properties' && <Properties />}
          </div>
        </main>
      </div>
    </div>
  )
}
