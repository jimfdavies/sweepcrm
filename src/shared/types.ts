// Shared type definitions

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Property {
  id: string
  customerId: string
  address: string
  squareFeet?: number
  chimneyCount: number
  lastCleanedDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ServiceLog {
  id: string
  propertyId: string
  serviceType: string
  serviceDate: string
  cost?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ReminderProperty extends Property {
  customerName: string
  monthsSinceLastClean: number
}
