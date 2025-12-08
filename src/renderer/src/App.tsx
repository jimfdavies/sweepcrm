import { useState } from 'react'
import Home from './components/Home'
import Reminders from './components/Reminders'
import Customers from './components/Customers'
import Properties from './components/Properties'
import Jobs from './components/Jobs'

type View = 'home' | 'reminders' | 'customers' | 'properties' | 'jobs'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home')

  const navItems: { id: View; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'reminders', label: 'Reminders' },
    { id: 'customers', label: 'Customers' },
    { id: 'properties', label: 'Properties' },
    { id: 'jobs', label: 'Jobs' }
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
            <div className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={() => setCurrentView('jobs')}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
              >
                + Add Job Details
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl">
            {currentView === 'home' && <Home />}
            {currentView === 'reminders' && <Reminders />}
            {currentView === 'customers' && <Customers />}
            {currentView === 'properties' && <Properties />}
            {currentView === 'jobs' && <Jobs />}
          </div>
        </main>
      </div>
    </div>
  )
}
