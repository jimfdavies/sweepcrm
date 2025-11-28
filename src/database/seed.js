const { initDatabase, getDb } = require('./db');

function seedDatabase() {
  console.log('Seeding database...');
  initDatabase();
  const db = getDb();

  // Check if data already exists
  const customerCount = db.prepare('SELECT count(*) as count FROM customers').get().count;
  if (customerCount > 0) {
    console.log('Database already seeded. Skipping.');
    return;
  }

  const insertCustomer = db.prepare(`
    INSERT INTO customers (title, first_name, last_name, phone, email)
    VALUES (@title, @first_name, @last_name, @phone, @email)
  `);

  const insertProperty = db.prepare(`
    INSERT INTO properties (customer_id, address_line_1, address_line_2, town, postcode, notes)
    VALUES (@customer_id, @address_line_1, @address_line_2, @town, @postcode, @notes)
  `);

  const insertJob = db.prepare(`
    INSERT INTO jobs (property_id, date_completed, cost, certificate_number, notes)
    VALUES (@property_id, @date_completed, @cost, @certificate_number, @notes)
  `);

  const transaction = db.transaction(() => {
    // Customer 1
    const info1 = insertCustomer.run({
      title: 'Mr',
      first_name: 'Sherlock',
      last_name: 'Holmes',
      phone: '020 7224 3688',
      email: 'sherlock@holmes.com'
    });
    
    const prop1 = insertProperty.run({
      customer_id: info1.lastInsertRowid,
      address_line_1: '221B Baker Street',
      address_line_2: '',
      town: 'London',
      postcode: 'NW1 6XE',
      notes: 'Knock loudly'
    });

    insertJob.run({
      property_id: prop1.lastInsertRowid,
      date_completed: '2023-10-15',
      cost: 65,
      certificate_number: 'CERT001',
      notes: 'Sooty chimney'
    });

    // Customer 2
    const info2 = insertCustomer.run({
      title: 'Mrs',
      first_name: 'Hudson',
      last_name: 'Landlady',
      phone: '020 7224 3689',
      email: 'hudson@bakerst.com'
    });

    const prop2 = insertProperty.run({
      customer_id: info2.lastInsertRowid,
      address_line_1: '221A Baker Street',
      address_line_2: 'Basement Flat',
      town: 'London',
      postcode: 'NW1 6XE',
      notes: 'Watch out for the dog'
    });

    insertJob.run({
      property_id: prop2.lastInsertRowid,
      date_completed: '2023-11-01',
      cost: 50,
      certificate_number: 'CERT002',
      notes: 'Routine sweep'
    });
  });

  transaction();
  console.log('Database seeded successfully.');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
