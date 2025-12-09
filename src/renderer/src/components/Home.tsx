import { useState, useEffect } from 'react'
import { listRecords } from '../services/db'

interface EntityCounts {
  customers: number
  properties: number
  jobs: number
}

type View = 'customers' | 'properties' | 'jobs'

interface HomeProps {
  onNavigate: (view: View) => void
}

export default function Home({ onNavigate }: HomeProps) {
  const [counts, setCounts] = useState<EntityCounts>({
    customers: 0,
    properties: 0,
    jobs: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCounts()
  }, [])

  const loadCounts = async () => {
    try {
      setLoading(true)
      setError(null)

      const [customers, properties, jobs] = await Promise.all([
        listRecords('customers'),
        listRecords('properties'),
        listRecords('serviceLogs')
      ])

      setCounts({
        customers: customers.length,
        properties: properties.length,
        jobs: jobs.length
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load counts')
      console.error('Error loading counts:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">System Summary</h2>
          <p className="text-gray-600">Overview of your sweep operation data</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-700">Error: {error}</p>
            <button
              onClick={loadCounts}
              className="mt-2 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customers Card */}
            <button
              onClick={() => onNavigate('customers')}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 hover:shadow-lg hover:from-blue-100 hover:to-blue-150 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                    Total Customers
                  </p>
                  <p className="text-4xl font-bold text-blue-900 mt-2">{counts.customers}</p>
                </div>
                <div className="text-5xl text-blue-300 opacity-50">👥</div>
              </div>
            </button>

            {/* Properties Card */}
            <button
              onClick={() => onNavigate('properties')}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200 hover:shadow-lg hover:from-green-100 hover:to-green-150 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 uppercase tracking-wide">
                    Total Properties
                  </p>
                  <p className="text-4xl font-bold text-green-900 mt-2">{counts.properties}</p>
                </div>
                <div className="text-5xl text-green-300 opacity-50">🏠</div>
              </div>
            </button>

            {/* Jobs Card */}
            <button
              onClick={() => onNavigate('jobs')}
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200 hover:shadow-lg hover:from-purple-100 hover:to-purple-150 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">
                    Total Jobs
                  </p>
                  <p className="text-4xl font-bold text-purple-900 mt-2">{counts.jobs}</p>
                </div>
                <div className="text-5xl text-purple-300 opacity-50">📋</div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <p className="text-sm text-gray-600">
            Use the navigation menu to browse customers, properties, jobs, and reminders.
          </p>
          <p className="text-sm text-gray-600">
            Click "Add Job Details" to enter new job information from your paper sheets.
          </p>
        </div>
      </div>
    </div>
  )
}
