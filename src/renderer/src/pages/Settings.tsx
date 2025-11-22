import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Settings(): React.ReactElement {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleBackup = async (): Promise<void> => {
    setLoading(true)
    setMessage(null)
    try {
      const success = await window.api.backup()
      if (success) {
        setMessage({ type: 'success', text: 'Backup created successfully.' })
      } else {
        // User cancelled or failed
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Backup failed.' })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (): Promise<void> => {
    if (
      !confirm(
        'WARNING: This will overwrite the current database with the selected backup. This action cannot be undone. Are you sure?'
      )
    ) {
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      const success = await window.api.restore()
      if (success) {
        setMessage({
          type: 'success',
          text: 'Restore successful. Please close and restart the application to use the restored database.'
        })
      }
      setLoading(false)
    } catch (error) {
      setMessage({ type: 'error', text: 'Restore failed.' })
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
            ← Back to Dashboard
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings & Data</h1>

        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Backup Database</h2>
            <p className="text-gray-600 mb-4">Save a copy of your database to a secure location.</p>
            <button
              onClick={handleBackup}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Processing...' : 'Create Backup'}
            </button>
          </div>

          <hr />

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Restore Database</h2>
            <p className="text-gray-600 mb-4">
              Restore your data from a previous backup file.{' '}
              <strong className="text-red-600">Warning: This will replace all current data.</strong>
            </p>
            <button
              onClick={handleRestore}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-red-300"
            >
              {loading ? 'Processing...' : 'Restore from Backup'}
            </button>
          </div>

          {message && (
            <div
              className={`p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
