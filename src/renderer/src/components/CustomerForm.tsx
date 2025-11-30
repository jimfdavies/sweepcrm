import React, { useState } from 'react'
import { CreateCustomerDTO } from '../../../shared/types'

function CustomerForm(): React.JSX.Element {
  const [formData, setFormData] = useState<CreateCustomerDTO>({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  const [status, setStatus] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setStatus('Submitting...')
    try {
      // @ts-ignore (window.api not typed yet)
      const result = await window.api.createCustomer(formData)
      if (result.success) {
        setStatus('Customer created successfully!')
        setFormData({ name: '', email: '', phone: '', address: '' })
      } else {
        setStatus(`Error: ${result.error}`)
      }
    } catch (error) {
      setStatus(`Error: ${(error as Error).message}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <h2>Add New Customer</h2>
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Phone:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Address:</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Create Customer</button>
      {status && <p className="status-message">{status}</p>}
    </form>
  )
}

export default CustomerForm
