import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database', 'database.sqlite');
const db = new Database(dbPath);

// Création de la table urls avec le champ secret
db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_url TEXT UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    visit INTEGER DEFAULT 0,
    secret TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;