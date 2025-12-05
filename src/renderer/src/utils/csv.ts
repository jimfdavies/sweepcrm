import { ReminderProperty } from '../../../shared/types'

/**
 * Convert data to CSV format
 */
export const convertToCSV = (data: ReminderProperty[]): string => {
  if (data.length === 0) return ''

  // Define CSV headers
  const headers = [
    'Customer Name',
    'Address',
    'Last Cleaned',
    'Months Since Last Clean',
    'Square Feet',
    'Number of Chimneys',
    'Notes'
  ]

  // Convert data rows
  const rows = data.map(prop => [
    escapeCSVValue(prop.customerName),
    escapeCSVValue(prop.address),
    prop.lastCleanedDate ? new Date(prop.lastCleanedDate).toLocaleDateString() : 'Never',
    Math.round(prop.monthsSinceLastClean).toString(),
    (prop.squareFeet || '').toString(),
    prop.chimneyCount.toString(),
    escapeCSVValue(prop.notes || '')
  ])

  // Combine headers and rows
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')

  return csv
}

/**
 * Escape CSV values that contain special characters
 */
const escapeCSVValue = (value: string): string => {
  if (!value) return '""'
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"` // Escape quotes by doubling them
  }
  return value
}

/**
 * Download CSV file
 */
export const downloadCSV = (csv: string, filename: string): void => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Export reminders data as CSV
 */
export const exportRemindersAsCSV = (properties: ReminderProperty[], monthLabel: string): void => {
  const csv = convertToCSV(properties)
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `reminders-${monthLabel}-${timestamp}.csv`

  downloadCSV(csv, filename)
}
