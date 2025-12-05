import { useState } from 'react'
import { createRecord } from '../services/db'
import { validateAndFormatPostcode } from '../utils/postcodeValidator'

// Simple UUID v4 generator (minimal implementation)
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

interface PropertyFormProps {
  customerId: string
  onSave: () => void
  onCancel: () => void
}

export default function PropertyForm({ customerId, onSave, onCancel }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    town: '',
    postcode: '',
    notes: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [postcodeError, setPostcodeError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    // Clear postcode error when user starts typing
    if (name === 'postcode') {
      setPostcodeError(null)
    }
  }

  const handlePostcodeBlur = () => {
    if (formData.postcode.trim()) {
      const validation = validateAndFormatPostcode(formData.postcode)
      if (!validation.isValid) {
        setPostcodeError(validation.error || 'Invalid postcode')
      } else {
        // Format the postcode
        setFormData((prev) => ({
          ...prev,
          postcode: validation.formatted || ''
        }))
        setPostcodeError(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.addressLine1.trim()) {
      setError('Address line 1 is required')
      return
    }

    if (!formData.town.trim()) {
      setError('Town is required')
      return
    }

    // Validate postcode if provided
    if (formData.postcode.trim()) {
      const validation = validateAndFormatPostcode(formData.postcode)
      if (!validation.isValid) {
        setPostcodeError(validation.error || 'Invalid postcode')
        return
      }
    }

    try {
      setLoading(true)
      setError(null)

      // Build address string from components
      const addressParts = [formData.addressLine1]
      if (formData.addressLine2.trim()) {
        addressParts.push(formData.addressLine2)
      }
      addressParts.push(formData.town)
      if (formData.postcode.trim()) {
        addressParts.push(formData.postcode)
      }
      const address = addressParts.join(', ')

      // Create property object
      const propertyId = generateUUID()
      const newProperty: Record<string, unknown> & { id: string } = {
        id: propertyId,
        customerId,
        address,
        chimneyCount: 0, // Default value
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Add optional fields only if they have values
      if (formData.notes?.trim()) newProperty.notes = formData.notes

      await createRecord('properties', newProperty)
      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save property')
      console.error('Error saving property:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Property</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Address Line 1 */}
          <div>
            <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 1 *
            </label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="123 Main Street"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              placeholder="Apartment, suite, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Town */}
          <div>
            <label htmlFor="town" className="block text-sm font-medium text-gray-700 mb-1">
              Town *
            </label>
            <input
              type="text"
              id="town"
              name="town"
              value={formData.town}
              onChange={handleChange}
              placeholder="London"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Postcode */}
          <div>
            <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">
              Postcode (Optional)
            </label>
            <input
              type="text"
              id="postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              onBlur={handlePostcodeBlur}
              placeholder="SW1A 1AA"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                postcodeError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {postcodeError && <p className="mt-1 text-sm text-red-600">{postcodeError}</p>}
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
              placeholder="Add any notes about this property"
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
              {loading ? 'Saving...' : 'Save Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
