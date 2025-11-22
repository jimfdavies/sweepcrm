import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login(): React.ReactElement {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [dbPath, setDbPath] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDbPath = async (): Promise<void> => {
      try {
        const path = await window.api.getDbPath()
        setDbPath(path)
      } catch {
        setDbPath('')
      }
    }
    fetchDbPath()
  }, [])

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    try {
      const success = await window.api.login(password)
      if (success) {
        navigate('/dashboard')
      } else {
        setError('Invalid password or database error')
      }
    } catch {
      setError('Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">SweepCRM Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Master Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        {dbPath && (
          <p className="mt-4 text-xs text-gray-400 text-center break-all" title={dbPath}>
            Database: {dbPath}
          </p>
        )}
      </div>
    </div>
  )
}
