import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

interface Reminder {
  title: string
  first_name: string
  last_name: string
  phone: string
  email: string
  address_line_1: string
  address_line_2: string
  town: string
  postcode: string
  last_sweep_date: string
  job_id: number
  last_reminder_date?: string
  property_id: number // We need this for recording
}

export default function Reminders(): React.ReactElement {
  const today = new Date()
  // Default to next month
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)

  const [month, setMonth] = useState(nextMonth.getMonth() + 1) // 1-12
  const [year, setYear] = useState(nextMonth.getFullYear())
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(false)

  const loadReminders = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const data = await window.api.getReminders({ month, year })
      setReminders(data)
    } catch (error) {
      console.error('Failed to load reminders:', error)
    } finally {
      setLoading(false)
    }
  }, [month, year])

  useEffect(() => {
    loadReminders()
  }, [loadReminders])

  const handleExport = (): void => {
    if (reminders.length === 0) return

    // CSV Header
    const headers = [
      'Title',
      'First Name',
      'Last Name',
      'Address 1',
      'Address 2',
      'Town',
      'Postcode',
      'Last Sweep Date'
    ]

    // CSV Rows
    const rows = reminders.map((r) =>
      [
        r.title,
        r.first_name,
        r.last_name,
        r.address_line_1,
        r.address_line_2,
        r.town,
        r.postcode,
        r.last_sweep_date
      ]
        .map((field) => `"${(field || '').toString().replace(/"/g, '""')}"`)
        .join(',')
    )

    const csvContent = [headers.join(','), ...rows].join('\n')

    const filename = `reminders_${year}_${month.toString().padStart(2, '0')}.csv`

    // Use IPC to save file
    window.api.exportReminders({ content: csvContent, filename }).then(async (success) => {
      if (success) {
        // Record reminders
        if (confirm('Export successful. Mark these reminders as sent?')) {
          const propertyIds = reminders.map((r) => r.property_id)
          await window.api.recordReminders({ propertyIds, method: 'mail_merge' })
          loadReminders()
        }
      }
    })
  }

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
            ← Back to Dashboard
          </Link>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Monthly Reminders</h1>
          <div className="flex space-x-4">
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            >
              {months.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            >
              {Array.from({ length: 5 }, (_, i) => today.getFullYear() - 1 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <button
              onClick={handleExport}
              disabled={reminders.length === 0}
              className={`px-4 py-2 rounded text-white ${
                reminders.length > 0
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Export to CSV
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <p className="text-gray-600">
              Showing properties last swept in{' '}
              <strong>
                {months[month - 1]} {year}
              </strong>
              . These are due for a sweep in{' '}
              <strong>
                {months[month - 1]} {year + 1}
              </strong>{' '}
              (approx).
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Sweep
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Reminder
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reminders.map((reminder, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {reminder.title} {reminder.first_name} {reminder.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{reminder.address_line_1}</div>
                      <div className="text-sm text-gray-500">
                        {reminder.address_line_2 ? `${reminder.address_line_2}, ` : ''}
                        {reminder.town}, {reminder.postcode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reminder.last_sweep_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reminder.last_reminder_date
                        ? reminder.last_reminder_date.split(' ')[0]
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{reminder.phone}</div>
                      <div>{reminder.email}</div>
                    </td>
                  </tr>
                ))}
                {reminders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">
                      No reminders found for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
