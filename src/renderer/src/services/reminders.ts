import { Property, ReminderProperty } from '../../../shared/types'
import { listRecords } from './db'

/**
 * Calculate months since a given date
 */
const monthsSinceDate = (dateStr: string | undefined): number => {
  if (!dateStr) return Infinity // Never cleaned
  const date = new Date(dateStr)
  const now = new Date()
  const months =
    (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth())
  return months
}

/**
 * Get properties due for reminder based on months since last cleaning
 * Returns properties last cleaned 11-12 months ago
 */
export const getPropertiesDueForReminder = async (
  minMonths: number = 11,
  maxMonths: number = 12
): Promise<ReminderProperty[]> => {
  const properties = await listRecords<Property & { customerFirstName: string; customerLastName: string }>(
    'properties'
  )

  const dueProperties: ReminderProperty[] = []

  for (const prop of properties) {
    const monthsSince = monthsSinceDate(prop.lastCleanedDate)

    if (monthsSince >= minMonths && monthsSince <= maxMonths) {
      dueProperties.push({
        ...prop,
        customerName: `${prop.customerFirstName} ${prop.customerLastName}`,
        monthsSinceLastClean: monthsSince
      })
    }
  }

  return dueProperties.sort((a, b) => b.monthsSinceLastClean - a.monthsSinceLastClean)
}

/**
 * Get properties due for reminder by month offset
 * For example, month = 0 returns properties due in the current month (11-12 months)
 * month = 1 returns properties due in next month (12-13 months), etc.
 */
export const getPropertiesDueByMonth = async (month: number = 0): Promise<ReminderProperty[]> => {
  const minMonths = 11 + month
  const maxMonths = 12 + month
  return getPropertiesDueForReminder(minMonths, maxMonths)
}

/**
 * Get all unique months that have properties due for reminder
 */
export const getAvailableReminderMonths = async (): Promise<number[]> => {
  const properties = await listRecords<Property>('properties')
  const months = new Set<number>()

  for (const prop of properties) {
    const monthsSince = monthsSinceDate(prop.lastCleanedDate)
    if (monthsSince >= 11) {
      const monthOffset = Math.floor(monthsSince - 11)
      months.add(monthOffset)
    }
  }

  return Array.from(months).sort((a, b) => a - b)
}
