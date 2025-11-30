import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import React, { useState, useEffect } from 'react'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [dbStatus, setDbStatus] = useState('Checking DB connection...')

  useEffect(() => {
    // Check DB status after component mounts
    const status = window.api.db.ping()
    console.log('DB Ping Status:', status) // Added for debugging
    setDbStatus(status)
  }, [])

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
          DB Status: {dbStatus}
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
