/**
 * Test data fixtures for E2E tests
 */

export const testCustomers = [
  {
    title: 'Mr',
    first_name: 'John',
    last_name: 'Smith',
    phone: '555-1001',
    email: 'john.smith@example.com'
  },
  {
    title: 'Mrs',
    first_name: 'Sarah',
    last_name: 'Johnson',
    phone: '555-1002',
    email: 'sarah.johnson@example.com'
  },
  {
    title: 'Dr',
    first_name: 'Michael',
    last_name: 'Brown',
    phone: '555-1003',
    email: 'michael.brown@example.com'
  }
]

export const testProperties = [
  {
    address_line_1: '123 Main Street',
    address_line_2: '',
    town: 'Springfield',
    postcode: 'SP1 1AA',
    notes: 'Large Victorian house'
  },
  {
    address_line_1: '456 Oak Avenue',
    address_line_2: 'Apartment 2B',
    town: 'Riverside',
    postcode: 'RV2 3BB',
    notes: 'Modern apartment building'
  }
]

export const testJobs = [
  {
    date_completed: '2024-01-15',
    cost: 150.0,
    certificate_number: 'CERT-2024-001',
    notes: 'Annual chimney sweep and inspection'
  },
  {
    date_completed: '2024-02-20',
    cost: 175.5,
    certificate_number: 'CERT-2024-002',
    notes: 'Chimney repair and cleaning'
  }
]

/**
 * Default test password for the application
 * Can be overridden with SWEEPCRM_TEST_PASSWORD environment variable
 *
 * Usage:
 *   SWEEPCRM_TEST_PASSWORD=your-real-password npm run test:e2e
 */
export const TEST_PASSWORD = process.env.SWEEPCRM_TEST_PASSWORD || 'test123'

/**
 * Get a unique customer for testing (avoids conflicts)
 */
export function getUniqueCustomer() {
  const timestamp = Date.now()
  return {
    title: 'Mr',
    first_name: `Test${timestamp}`,
    last_name: `User${timestamp}`,
    phone: `555-${timestamp.toString().slice(-4)}`,
    email: `test${timestamp}@example.com`
  }
}
