import React from 'react'
import CustomerForm from '../components/CustomerForm'

function AddCustomerPage({ onBack }: { onBack: () => void }): React.JSX.Element {
  return (
    <div className="page-container">
      <button onClick={onBack} className="back-button">
        &larr; Back
      </button>
      <CustomerForm onSuccess={onBack} />
    </div>
  )
}

export default AddCustomerPage
