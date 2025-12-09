import { Property, ReminderProperty } from '../../../shared/types'
import { listRecords } from './db'

interface Customer {
  id: string
  firstName: string
  lastName: string
}

interface ServiceLog {
  id: string
  propertyId: string
  serviceDate: string
}

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
 * Returns properties last cleaned within a specific month range
 */
export const getPropertiesDueForReminder = async (
  minMonths: number = 11,
  maxMonths: number = 12
): Promise<ReminderProperty[]> => {
  const properties = await listRecords<Property>('properties')
  const customers = await listRecords<Customer>('customers')
  const serviceLogs = await listRecords<ServiceLog>('serviceLogs')

  // Build a map of customerId -> customer for quick lookup
  const customerMap = new Map(customers.map(c => [c.id, c]))

  // Build a map of propertyId -> most recent serviceDate
  const lastCleanedMap = new Map<string, string>()
  for (const log of serviceLogs) {
    const currentDate = lastCleanedMap.get(log.propertyId)
    if (!currentDate || new Date(log.serviceDate) > new Date(currentDate)) {
      lastCleanedMap.set(log.propertyId, log.serviceDate)
    }
  }

  const dueProperties: ReminderProperty[] = []

  for (const prop of properties) {
    const customer = customerMap.get(prop.customerId)
    if (!customer) continue // Skip if customer not found

    const lastCleanedDate = lastCleanedMap.get(prop.id)
    const monthsSince = monthsSinceDate(lastCleanedDate)

    if (monthsSince >= minMonths && monthsSince <= maxMonths) {
      dueProperties.push({
        ...prop,
        lastCleanedDate,
        customerName: `${customer.firstName} ${customer.lastName}`,
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
