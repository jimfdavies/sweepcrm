import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { Customer, Property, Job } from '../types'

// Custom APIs for renderer
const api = {
  getDbPath: () => ipcRenderer.invoke('db:getPath'),
  login: (password: string) => ipcRenderer.invoke('db:login', password),
  getCustomers: (search: string) => ipcRenderer.invoke('db:getCustomers', search),
  createCustomer: (customer: Omit<Customer, 'id'>) =>
    ipcRenderer.invoke('db:createCustomer', customer),
  updateCustomer: (customer: Customer) => ipcRenderer.invoke('db:updateCustomer', customer),
  deleteCustomer: (id: number) => ipcRenderer.invoke('db:deleteCustomer', id),
  getCustomer: (id: number) => ipcRenderer.invoke('db:getCustomer', id),
  getProperties: (customerId: number) => ipcRenderer.invoke('db:getProperties', customerId),
  createProperty: (property: Omit<Property, 'id'>) =>
    ipcRenderer.invoke('db:createProperty', property),
  updateProperty: (property: Property) => ipcRenderer.invoke('db:updateProperty', property),
  deleteProperty: (id: number) => ipcRenderer.invoke('db:deleteProperty', id),
  getJobs: (propertyId: number) => ipcRenderer.invoke('db:getJobs', propertyId),
  createJob: (job: Omit<Job, 'id'>) => ipcRenderer.invoke('db:createJob', job),
  updateJob: (job: Job) => ipcRenderer.invoke('db:updateJob', job),
  deleteJob: (id: number) => ipcRenderer.invoke('db:deleteJob', id),
  getReminders: (params: { month: number; year: number }) =>
    ipcRenderer.invoke('db:getReminders', params),
  recordReminders: (params: { propertyIds: number[]; method: string }) =>
    ipcRenderer.invoke('db:recordReminders', params),
  backup: () => ipcRenderer.invoke('db:backup'),
  restore: () => ipcRenderer.invoke('db:restore'),
  exportReminders: (params: { content: string; filename: string }) =>
    ipcRenderer.invoke('db:exportReminders', params)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
