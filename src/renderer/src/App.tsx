import { useState } from 'react'
import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import AddCustomerPage from './pages/AddCustomerPage'
import EditCustomerPage from './pages/EditCustomerPage'

function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<string>('home')
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null)

  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const handleBackToHome = (): void => {
    setCurrentPage('home')
    setEditingCustomerId(null)
  }

  if (currentPage === 'add-customer') {
    return <AddCustomerPage onBack={handleBackToHome} />
  }

  if (currentPage === 'edit-customer' && editingCustomerId !== null) {
    return <EditCustomerPage customerId={editingCustomerId} onBack={handleBackToHome} />
  }

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
        <div className="action">
          <button onClick={() => setCurrentPage('add-customer')}>Add Customer</button>
        </div>
        <div className="action">
          <button
            onClick={() => {
              setCurrentPage('edit-customer')
              setEditingCustomerId(1) // Hardcoded ID for testing
            }}
          >
            Edit Customer (ID 1)
          </button>
        </div>
      </div>

      <Versions></Versions>
    </>
  )
}

export default App
