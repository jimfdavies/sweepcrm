import { Link } from 'react-router-dom'

export default function Dashboard(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">SweepCRM</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/customers"
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Manage Customers</h2>
              <p className="text-gray-600">View, add, and edit customer details and properties.</p>
            </Link>

            <Link
              to="/reminders"
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Monthly Reminders</h2>
              <p className="text-gray-600">View properties due for a sweep and export labels.</p>
            </Link>

            <Link
              to="/settings"
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Settings & Data</h2>
              <p className="text-gray-600">Backup and restore your database.</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
