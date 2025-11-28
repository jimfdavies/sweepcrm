const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

// In development, store db in project root. In production, use userData.
const isDev = process.env.NODE_ENV === 'development';
const dbPath = isDev 
  ? path.join(__dirname, '../../sweepcrm.db')
  : path.join(app.getPath('userData'), 'sweepcrm.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(dbPath, { verbose: console.log });
    db.pragma('journal_mode = WAL');
  }
  return db;
}

module.exports = { getDb };
