import { useState, useEffect } from 'react'
import { listRecords } from '../services/db'
import JobForm from './JobForm'
import JobEditForm from './JobEditForm'

interface Customer {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
}

interface Property {
  id: string
  customerId: string
  address: string
  squareFeet?: number
  chimneyCount?: number
  lastCleanedDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface ServiceLog {
  id: string
  propertyId: string
  serviceType: string
  serviceDate: string
  cost?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function Jobs() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [jobs, setJobs] = useState<ServiceLog[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [customerSearchQuery, setCustomerSearchQuery] = useState('')
  const [showJobForm, setShowJobForm] = useState(false)
  const [editingJobId, setEditingJobId] = useState<string | null>(null)

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    if (selectedCustomerId) {
      loadProperties()
    }
  }, [selectedCustomerId])

  useEffect(() => {
    if (selectedPropertyId) {
      loadJobs()
    }
  }, [selectedPropertyId])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await listRecords<Customer>('customers')
      setCustomers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers')
      console.error('Error loading customers:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadProperties = async () => {
    if (!selectedCustomerId) {
      setProperties([])
      return
    }

    try {
      setError(null)
      const data = await listRecords<Property>('properties', { customerId: selectedCustomerId })
      setProperties(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties')
      console.error('Error loading properties:', err)
    }
  }

  const loadJobs = async () => {
    if (!selectedPropertyId) {
      setJobs([])
      return
    }

    try {
      setError(null)
      const data = await listRecords<ServiceLog>('serviceLogs', { propertyId: selectedPropertyId })
      // Sort by date descending (most recent first)
      data.sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime())
      setJobs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs')
      console.error('Error loading jobs:', err)
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const query = customerSearchQuery.toLowerCase()
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase()
    return fullName.includes(query) || customer.email?.toLowerCase().includes(query) || customer.phone?.toLowerCase().includes(query)
  })

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId)
  const selectedProperty = properties.find((p) => p.id === selectedPropertyId)

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Jobs</h2>
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Jobs</h2>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-700">Error: {error}</p>
          <button
            onClick={loadCustomers}
            className="mt-2 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Customer Selection Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a Customer</h3>

        {customers.length === 0 ? (
          <p className="text-gray-600">No customers found. Add a customer first.</p>
        ) : (
          <>
            {/* Search */}
            {customers.length > 0 && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search customers by name, email, or phone..."
                  value={customerSearchQuery}
                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Customer List */}
            <div className="space-y-2">
              {filteredCustomers.length === 0 ? (
                <p className="text-gray-500 text-sm">No customers match your search</p>
              ) : (
                filteredCustomers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => {
                      setSelectedCustomerId(customer.id)
                      setSelectedPropertyId(null)
                    }}
                    className={`w-full text-left px-4 py-3 border rounded-lg transition-colors ${
                      selectedCustomerId === customer.id
                        ? 'bg-blue-50 border-blue-300 border-2'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </div>
                    {customer.email && <div className="text-sm text-gray-600">{customer.email}</div>}
                    {customer.phone && <div className="text-sm text-gray-600">{customer.phone}</div>}
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Property Selection Panel */}
      {selectedCustomer && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Properties for {selectedCustomer.firstName} {selectedCustomer.lastName}
          </h3>

          {properties.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">No properties found</p>
              <p className="text-gray-500 text-sm mt-2">Add a property for this customer first</p>
            </div>
          ) : (
            <div className="space-y-2">
              {properties.map((property) => (
                <button
                  key={property.id}
                  onClick={() => setSelectedPropertyId(property.id)}
                  className={`w-full text-left px-4 py-3 border rounded-lg transition-colors ${
                    selectedPropertyId === property.id
                      ? 'bg-blue-50 border-blue-300 border-2'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-900">{property.address}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Jobs Panel */}
      {selectedProperty && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Jobs for {selectedProperty.address}
            </h3>
            <button
              onClick={() => setShowJobForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Add Job
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">No jobs found</p>
              <p className="text-gray-500 text-sm mt-2">Add a job for this property</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Cost</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Notes</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {new Date(job.serviceDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{job.serviceType}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {job.cost ? `£${job.cost.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{job.notes || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => setEditingJobId(job.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                        >
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Job Form Modal */}
      {showJobForm && selectedPropertyId && (
        <JobForm
          propertyId={selectedPropertyId}
          onSave={() => {
            setShowJobForm(false)
            loadJobs()
          }}
          onCancel={() => setShowJobForm(false)}
        />
      )}

      {/* Job Edit Form Modal */}
      {editingJobId && (
        <JobEditForm
          jobId={editingJobId}
          onSave={() => {
            setEditingJobId(null)
            loadJobs()
          }}
          onCancel={() => setEditingJobId(null)}
        />
      )}
    </div>
  )
}
