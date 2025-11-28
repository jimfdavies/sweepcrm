const { initDatabase, getDb } = require('../src/database/db');
const { seedDatabase } = require('../src/database/seed');
const fs = require('fs');
const path = require('path');

// Clean up previous db
const dbPath = path.join(__dirname, '../sweepcrm.db');
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

console.log('Running Database Verification...');

try {
  // 1. Initialize and Seed
  seedDatabase();

  const db = getDb();

  // 2. Verify Customers
  const customers = db.prepare('SELECT * FROM customers').all();
  console.log('Customers:', customers.length);
  if (customers.length !== 2) throw new Error('Expected 2 customers');
  if (customers[0].last_name !== 'Holmes') throw new Error('Expected Holmes');

  // 3. Verify Properties
  const properties = db.prepare('SELECT * FROM properties').all();
  console.log('Properties:', properties.length);
  if (properties.length !== 2) throw new Error('Expected 2 properties');

  // 4. Verify Jobs
  const jobs = db.prepare('SELECT * FROM jobs').all();
  console.log('Jobs:', jobs.length);
  if (jobs.length !== 2) throw new Error('Expected 2 jobs');

  // 5. Verify Relationships
  const jobWithDetails = db.prepare(`
    SELECT j.cost, p.address_line_1, c.last_name 
    FROM jobs j
    JOIN properties p ON j.property_id = p.id
    JOIN customers c ON p.customer_id = c.id
    WHERE j.id = 1
  `).get();

  console.log('Job 1 Details:', jobWithDetails);
  if (jobWithDetails.last_name !== 'Holmes') throw new Error('Relationship query failed');

  console.log('VERIFICATION PASSED');

} catch (err) {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
}
