import React, { useEffect, useState } from 'react'
import CustomerForm from '../components/CustomerForm'
import { Customer } from '../../../shared/types'

interface EditCustomerPageProps {
  customerId: number | null
  onBack: () => void
}

function EditCustomerPage({ customerId, onBack }: EditCustomerPageProps): React.JSX.Element {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCustomer(): Promise<void> {
      if (!customerId) {
        setError('Customer ID is missing.')
        setLoading(false)
        return
      }
      try {
        // @ts-ignore (window.api not typed yet)
        const fetchedCustomer = await window.api.getCustomerById(customerId)
        if (fetchedCustomer) {
          setCustomer(fetchedCustomer)
        } else {
          setError('Customer not found.')
        }
      } catch (err) {
        setError(`Failed to fetch customer: ${(err as Error).message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [customerId])

  if (loading) {
    return <div className="page-container">Loading customer...</div>
  }

  if (error) {
    return <div className="page-container error-message">{error}</div>
  }

  if (!customer) {
    return <div className="page-container error-message">No customer data available.</div>
  }

  return (
    <div className="page-container">
      <button onClick={onBack} className="back-button">
        &larr; Back
      </button>
      <CustomerForm initialData={customer} onSuccess={onBack} />
    </div>
  )
}

export default EditCustomerPage
