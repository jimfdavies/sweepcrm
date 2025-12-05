import { useState, useEffect } from 'react'
import { readRecord, updateRecord } from '../services/db'
import { validateAndFormatPostcode } from '../utils/postcodeValidator'

interface Property {
  id: string
  customerId: string
  address: string
  squareFeet?: number
  chimneyCount: number
  lastCleanedDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface PropertyEditFormProps {
  propertyId: string
  onSave: () => void
  onCancel: () => void
}

export default function PropertyEditForm({ propertyId, onSave, onCancel }: PropertyEditFormProps) {
  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    town: '',
    postcode: '',
    notes: ''
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [postcodeError, setPostcodeError] = useState<string | null>(null)
  const [saveLoading, setSaveLoading] = useState(false)

  useEffect(() => {
    loadProperty()
  }, [propertyId])

  const loadProperty = async () => {
    try {
      setLoading(true)
      setError(null)
      const property = await readRecord<Property>('properties', propertyId)

      // Parse address into components
      const addressParts = property.address.split(', ')
      const parsedData = {
        addressLine1: '',
        addressLine2: '',
        town: '',
        postcode: ''
      }

      if (addressParts.length >= 3) {
        // Try to detect postcode (UK format) from the last part
        const lastPart = addressParts[addressParts.length - 1]
        const postcodeRegex = /^([A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}|BFPO\s?\d{1,4}|GIR\s?0AA)$/
        if (postcodeRegex.test(lastPart.toUpperCase())) {
          parsedData.postcode = lastPart
          addressParts.pop()
        }

        // Last remaining part is town
        parsedData.town = addressParts.pop() || ''

        // Second part is address line 2 if we have more than 1 remaining
        if (addressParts.length > 1) {
          parsedData.addressLine2 = addressParts.pop() || ''
        }

        // First part is address line 1
        parsedData.addressLine1 = addressParts[0] || ''
      } else if (addressParts.length === 2) {
        parsedData.addressLine1 = addressParts[0]
        parsedData.town = addressParts[1]
      } else {
        parsedData.addressLine1 = property.address
      }

      setFormData({
        ...parsedData,
        notes: property.notes || ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load property')
      console.error('Error loading property:', err)
    } finally {
      setLoading(false)
    }
  }

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
      setSaveLoading(true)
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

      // Create property object for update
      const updatedProperty: Record<string, unknown> & { id: string } = {
        id: propertyId,
        address,
        updatedAt: new Date().toISOString()
      }

      // Add optional fields only if they have values
      if (formData.notes?.trim()) updatedProperty.notes = formData.notes

      await updateRecord('properties', updatedProperty)
      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save property')
      console.error('Error saving property:', err)
    } finally {
      setSaveLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Property</h3>

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
              disabled={saveLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
