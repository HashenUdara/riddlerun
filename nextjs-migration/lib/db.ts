import Database from 'better-sqlite3';
import path from 'path';

// Create or connect to SQLite database
const dbPath = path.join(process.cwd(), 'riddle.db');
const db = new Database(dbPath);

// Initialize database schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      riddleIndex INTEGER NOT NULL DEFAULT 1,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS checkpoints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      hash TEXT NOT NULL,
      riddle TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS teampath (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teamID INTEGER NOT NULL,
      checkpointID INTEGER NOT NULL,
      solved INTEGER DEFAULT 0,
      solvedTime DATETIME DEFAULT CURRENT_TIMESTAMP,
      orderNum INTEGER NOT NULL,
      FOREIGN KEY (teamID) REFERENCES teams(id),
      FOREIGN KEY (checkpointID) REFERENCES checkpoints(id)
    );
  `);
}

// Initialize on import
initDatabase();

export default db;
