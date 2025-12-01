export interface Customer {
  id?: number
  name: string
  email: string
  phone: string
  address: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCustomerDTO {
  name: string
  email: string
  phone: string
  address: string
}

export interface CustomerDBRow {
  id: number
  title: string
  first_name: string
  last_name: string
  phone: string
  email: string
  notes: string
  created_at: string
  updated_at: string
}
