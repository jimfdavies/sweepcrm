import { ElectronAPI } from '@electron-toolkit/preload'
import { Customer, CreateCustomerDTO } from '../shared/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      createCustomer: (
        customer: CreateCustomerDTO
      ) => Promise<{ success: boolean; id?: number; error?: string }>
      getCustomerById: (id: number) => Promise<Customer | null>
      updateCustomer: (
        customer: Customer
      ) => Promise<{ success: boolean; changes?: number; error?: string }>
      // Add other IPC methods here as they are implemented
    }
  }
}
