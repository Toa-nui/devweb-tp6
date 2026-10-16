import Database from 'better-sqlite3';
import { DB_FILE } from '../config.js';

const db = new Database(DB_FILE);

// Création de la table si elle n'existe pas
db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_url TEXT UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    visit INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;