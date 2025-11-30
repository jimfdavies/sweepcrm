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
