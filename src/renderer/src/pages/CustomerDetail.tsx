import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Customer, Property } from '../types'
import JobsModal from '../components/JobsModal'

export default function CustomerDetail(): React.ReactElement {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [customer, setCustomer] = useState<Customer>({
    title: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: ''
  })

  const [properties, setProperties] = useState<Property[]>([])
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false)
  const [activePropertyForJobs, setActivePropertyForJobs] = useState<Property | null>(null)

  useEffect(() => {
    if (!isNew && id) {
      loadCustomer(parseInt(id))
      loadProperties(parseInt(id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadCustomer = async (customerId: number): Promise<void> => {
    const data = await window.api.getCustomer(customerId)
    if (data) setCustomer(data)
  }

  const loadProperties = async (customerId: number): Promise<void> => {
    const data = await window.api.getProperties(customerId)
    setProperties(data)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (isNew) {
      const newId = await window.api.createCustomer(customer)
      navigate(`/customers/${newId}`)
    } else {
      await window.api.updateCustomer(customer)
      navigate('/customers')
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (confirm('Are you sure you want to delete this customer?')) {
      if (customer.id) {
        await window.api.deleteCustomer(customer.id)
        navigate('/customers')
      }
    }
  }

  const handlePropertySubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!editingProperty || !customer.id) return

    const propertyData = { ...editingProperty, customer_id: customer.id }

    if (editingProperty.id) {
      await window.api.updateProperty(propertyData)
    } else {
      await window.api.createProperty(propertyData)
    }

    setIsPropertyModalOpen(false)
    loadProperties(customer.id)
  }

  const handleEditProperty = (property: Property): void => {
    setEditingProperty(property)
    setIsPropertyModalOpen(true)
  }

  const handleNewProperty = (): void => {
    setEditingProperty({
      customer_id: customer.id || 0,
      address_line_1: '',
      address_line_2: '',
      town: '',
      postcode: '',
      notes: ''
    })
    setIsPropertyModalOpen(true)
  }

  const handleDeleteProperty = async (propertyId: number): Promise<void> => {
    if (confirm('Delete this property?')) {
      await window.api.deleteProperty(propertyId)
      if (customer.id) loadProperties(customer.id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Customer Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">{isNew ? 'New Customer' : 'Edit Customer'}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  id="title"
                  type="text"
                  value={customer.title}
                  onChange={(e) => setCustomer({ ...customer, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                />
              </div>
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  id="first_name"
                  type="text"
                  required
                  value={customer.first_name}
                  onChange={(e) => setCustomer({ ...customer, first_name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  id="last_name"
                  type="text"
                  required
                  value={customer.last_name}
                  onChange={(e) => setCustomer({ ...customer, last_name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                id="phone"
                type="text"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              />
            </div>
            <div className="flex justify-between pt-4">
              {!isNew && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete Customer
                </button>
              )}
              <div className="flex-1 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/customers')}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Customer
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Properties Section */}
        {!isNew && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Properties</h2>
              <button
                onClick={handleNewProperty}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
              >
                Add Property
              </button>
            </div>
            <div className="space-y-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="border rounded p-4 flex justify-between items-start hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{property.address_line_1}</p>
                    {property.address_line_2 && <p>{property.address_line_2}</p>}
                    <p>
                      {property.town}, {property.postcode}
                    </p>
                    {property.notes && (
                      <p className="text-sm text-gray-500 mt-1">{property.notes}</p>
                    )}
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => setActivePropertyForJobs(property)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Jobs
                    </button>
                    <button
                      onClick={() => handleEditProperty(property)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => property.id && handleDeleteProperty(property.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {properties.length === 0 && (
                <p className="text-gray-500 italic">No properties found.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Property Modal */}
      {isPropertyModalOpen && editingProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingProperty.id ? 'Edit Property' : 'New Property'}
            </h2>
            <form onSubmit={handlePropertySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                <input
                  type="text"
                  required
                  value={editingProperty.address_line_1}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, address_line_1: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                <input
                  type="text"
                  value={editingProperty.address_line_2}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, address_line_2: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Town</label>
                  <input
                    type="text"
                    required
                    value={editingProperty.town}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, town: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Postcode</label>
                  <input
                    type="text"
                    required
                    value={editingProperty.postcode}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, postcode: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={editingProperty.notes}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, notes: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPropertyModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jobs Modal */}
      {activePropertyForJobs && (
        <JobsModal
          property={activePropertyForJobs}
          onClose={() => setActivePropertyForJobs(null)}
        />
      )}
    </div>
  )
}
