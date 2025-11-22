import { ElectronAPI } from '@electron-toolkit/preload'
import type { Customer, Property, Job } from '../types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getDbPath: () => Promise<string>
      login: (password: string) => Promise<boolean>
      getCustomers: (search: string) => Promise<Customer[]>
      createCustomer: (customer: Omit<Customer, 'id'>) => Promise<number>
      updateCustomer: (customer: Customer) => Promise<number>
      deleteCustomer: (id: number) => Promise<number>
      getCustomer: (id: number) => Promise<Customer>
      getProperties: (customerId: number) => Promise<Property[]>
      createProperty: (property: Omit<Property, 'id'>) => Promise<number>
      updateProperty: (property: Property) => Promise<number>
      deleteProperty: (id: number) => Promise<number>
      getJobs: (propertyId: number) => Promise<Job[]>
      createJob: (job: Omit<Job, 'id'>) => Promise<number>
      updateJob: (job: Job) => Promise<number>
      deleteJob: (id: number) => Promise<number>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getReminders: (params: { month: number; year: number }) => Promise<any[]>
      recordReminders: (params: { propertyIds: number[]; method: string }) => Promise<number>
      backup: () => Promise<boolean>
      restore: () => Promise<boolean>
      exportReminders: (params: { content: string; filename: string }) => Promise<boolean>
    }
  }
}
