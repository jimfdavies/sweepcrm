import React, { useState, useEffect } from 'react'
import { Job, Property } from '../types'

interface JobsModalProps {
  property: Property
  onClose: () => void
}

export default function JobsModal({ property, onClose }: JobsModalProps): React.ReactElement {
  const [jobs, setJobs] = useState<Job[]>([])
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    if (property.id) {
      loadJobs(property.id)
    }
  }, [property.id])

  const loadJobs = async (propertyId: number): Promise<void> => {
    const data = await window.api.getJobs(propertyId)
    setJobs(data)
  }

  const handleAddNew = (): void => {
    setEditingJob({
      property_id: property.id!,
      date_completed: new Date().toISOString().split('T')[0],
      cost: 0,
      certificate_number: '',
      notes: ''
    })
    setIsFormOpen(true)
  }

  const handleEdit = (job: Job): void => {
    setEditingJob(job)
    setIsFormOpen(true)
  }

  const handleDelete = async (jobId: number): Promise<void> => {
    if (confirm('Delete this job?')) {
      await window.api.deleteJob(jobId)
      if (property.id) loadJobs(property.id)
    }
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!editingJob) return

    if (editingJob.id) {
      await window.api.updateJob(editingJob)
    } else {
      await window.api.createJob(editingJob)
    }

    setIsFormOpen(false)
    setEditingJob(null)
    if (property.id) loadJobs(property.id)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Jobs History</h2>
            <p className="text-gray-600 text-sm">
              {property.address_line_1}, {property.town}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {!isFormOpen ? (
          <div className="space-y-4">
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
            >
              Add New Job
            </button>

            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cert #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.date_completed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        £{job.cost}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.certificate_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {job.notes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(job)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => job.id && handleDelete(job.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {jobs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500 italic">
                        No jobs recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded border">
            <h3 className="font-bold text-lg">{editingJob?.id ? 'Edit Job' : 'New Job'}</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date Completed</label>
                <input
                  type="date"
                  required
                  value={editingJob?.date_completed}
                  onChange={(e) =>
                    setEditingJob((prev) =>
                      prev ? { ...prev, date_completed: e.target.value } : null
                    )
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cost (£)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={editingJob?.cost}
                  onChange={(e) =>
                    setEditingJob((prev) =>
                      prev ? { ...prev, cost: parseFloat(e.target.value) } : null
                    )
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Certificate Number</label>
              <input
                type="text"
                value={editingJob?.certificate_number}
                onChange={(e) =>
                  setEditingJob((prev) =>
                    prev ? { ...prev, certificate_number: e.target.value } : null
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={editingJob?.notes}
                onChange={(e) =>
                  setEditingJob((prev) => (prev ? { ...prev, notes: e.target.value } : null))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Job
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
