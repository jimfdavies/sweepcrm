// Shared types for the application

export interface Customer {
  id?: number
  title: string
  first_name: string
  last_name: string
  phone: string
  email: string
}

export interface Property {
  id?: number
  customer_id: number
  address_line_1: string
  address_line_2: string
  town: string
  postcode: string
  notes: string
}

export interface Job {
  id?: number
  property_id: number
  date_completed: string
  cost: number
  certificate_number: string
  notes: string
}
