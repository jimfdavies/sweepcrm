import { CreateCustomerDTO } from '../../shared/types'

export interface IElectronAPI {
  loadPreferences: () => Promise<void>
  ipcRenderer: {
    send: (channel: string, ...args: unknown[]) => void
  }
  process: {
    versions: Record<string, string>
  }
}

export interface IApi {
  db: {
    ping: () => string
  }
  createCustomer: (
    customer: CreateCustomerDTO
  ) => Promise<{ success: boolean; id?: number; error?: string }>
}

declare global {
  interface Window {
    electron: IElectronAPI
    api: IApi
  }
}
