import { useState, useEffect } from 'react'
import { ReminderProperty } from '../../../shared/types'
import { getPropertiesDueByMonth, getAvailableReminderMonths } from '../services/reminders'
import { exportRemindersAsCSV } from '../utils/csv'

export default function Reminders() {
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [properties, setProperties] = useState<ReminderProperty[]>([])
  const [availableMonths, setAvailableMonths] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load available months on mount
  useEffect(() => {
    const loadMonths = async () => {
      try {
        const months = await getAvailableReminderMonths()
        setAvailableMonths(months)
        if (months.length > 0) {
          setSelectedMonth(months[0])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load months')
      }
    }
    loadMonths()
  }, [])

  // Load properties when selected month changes
  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getPropertiesDueByMonth(selectedMonth)
        setProperties(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load properties')
      } finally {
        setLoading(false)
      }
    }
    loadProperties()
  }, [selectedMonth])

  const getMonthLabel = (monthOffset: number): string => {
    const date = new Date()
    date.setMonth(date.getMonth() + monthOffset)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reminders</h2>
        <p className="text-gray-600 mb-6">Properties due for cleaning in the next 12 months</p>
      </div>

      {/* Month Filter */}
      {availableMonths.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Month:</label>
          <div className="flex flex-wrap gap-2">
            {availableMonths.map(month => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedMonth === month
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {getMonthLabel(month)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Loading properties...</p>
        </div>
      )}

      {/* Properties Table */}
      {!loading && properties.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {properties.length} Properties Due
            </h3>
            <button
              onClick={() => exportRemindersAsCSV(properties, getMonthLabel(selectedMonth))}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Export CSV
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Last Cleaned
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Months Since
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Chimneys
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {properties.map(prop => (
                <tr key={prop.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{prop.customerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{prop.address}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {prop.lastCleanedDate
                      ? new Date(prop.lastCleanedDate).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    {Math.round(prop.monthsSinceLastClean)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{prop.chimneyCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && properties.length === 0 && availableMonths.length > 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No properties due for cleaning in {getMonthLabel(selectedMonth)}</p>
        </div>
      )}

      {/* No Reminders State */}
      {!loading && availableMonths.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No reminders scheduled. Add properties to get started.</p>
        </div>
      )}
    </div>
  )
}
