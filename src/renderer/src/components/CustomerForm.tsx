import React, { useState, useEffect } from 'react'
import { CreateCustomerDTO, Customer } from '../../../shared/types'

interface CustomerFormProps {
  initialData?: Customer
  onSuccess?: () => void
}

function CustomerForm({ initialData, onSuccess }: CustomerFormProps): React.JSX.Element {
  const [formData, setFormData] = useState<CreateCustomerDTO>(
    initialData || {
      name: '',
      email: '',
      phone: '',
      address: ''
    }
  )
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {

      e.preventDefault()

      setStatus('Submitting...')

      try {

        let result

        if (initialData?.id) {

          // Update existing customer

          // @ts-ignore (window.api not typed yet)

          result = await window.api.updateCustomer({ ...formData, id: initialData.id })

        } else {

          // Create new customer

          // @ts-ignore (window.api not typed yet)

          result = await window.api.createCustomer(formData)

        }

  

        if (result.success) {

          setStatus(initialData?.id ? 'Customer updated successfully!' : 'Customer created successfully!')

          if (!initialData?.id) {

            setFormData({ name: '', email: '', phone: '', address: '' }) // Clear form for new customer

          }

          onSuccess?.()

        } else {

          setStatus(`Error: ${result.error}`)

        }

      } catch (error) {

        console.error('Error in handleSubmit:', error)

        setStatus(`Error: ${(error as Error).message}`)

      }

    }

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <h2>{initialData?.id ? 'Edit Customer' : 'Add New Customer'}</h2>
      <div className="form-group">
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Phone:</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Address:</label>
        <textarea name="address" value={formData.address} onChange={handleChange} required />
      </div>
      <button type="submit">{initialData?.id ? 'Save Changes' : 'Create Customer'}</button>
      {status && <p className="status-message">{status}</p>}
    </form>
  )
}

export default CustomerForm
