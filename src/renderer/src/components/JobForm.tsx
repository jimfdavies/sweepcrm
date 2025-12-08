import { useState } from 'react'
import { createRecord } from '../services/db'

// Simple UUID v4 generator (minimal implementation)
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

interface JobFormProps {
  propertyId: string
  onSave: () => void
  onCancel: () => void
}

export default function JobForm({ propertyId, onSave, onCancel }: JobFormProps) {
  const [formData, setFormData] = useState({
    serviceDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    serviceType: 'Chimney Sweep',
    cost: '',
    notes: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.serviceDate.trim()) {
      setError('Service date is required')
      return
    }

    if (!formData.serviceType.trim()) {
      setError('Service type is required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Create job object
      const jobId = generateUUID()
      const newJob: Record<string, unknown> & { id: string } = {
        id: jobId,
        propertyId,
        serviceDate: formData.serviceDate,
        serviceType: formData.serviceType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Add optional fields only if they have values
      if (formData.cost?.trim()) {
        const costValue = parseFloat(formData.cost)
        if (!isNaN(costValue)) {
          newJob.cost = costValue
        }
      }
      if (formData.notes?.trim()) newJob.notes = formData.notes

      await createRecord('serviceLogs', newJob)
      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save job')
      console.error('Error saving job:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Job</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Date */}
          <div>
            <label htmlFor="serviceDate" className="block text-sm font-medium text-gray-700 mb-1">
              Service Date *
            </label>
            <input
              type="date"
              id="serviceDate"
              name="serviceDate"
              value={formData.serviceDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Service Type */}
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
              Service Type *
            </label>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a service type...</option>
              <option value="Chimney Sweep">Chimney Sweep</option>
              <option value="Chimney Inspection">Chimney Inspection</option>
              <option value="Chimney Repair">Chimney Repair</option>
              <option value="Bird Guard Installation">Bird Guard Installation</option>
              <option value="Cap Replacement">Cap Replacement</option>
              <option value="Damper Service">Damper Service</option>
              <option value="Triage">Triage</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Cost */}
          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
              Cost (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">£</span>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about this job"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
