import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL || '';

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const client = postgres(connectionString);

async function migrate() {
  try {
    console.log('Creating database tables...');
    
    // Create tables using raw SQL to ensure they exist
    await client`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        "riddleIndex" INTEGER NOT NULL DEFAULT 1,
        timestamp TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    await client`
      CREATE TABLE IF NOT EXISTS checkpoints (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        hash TEXT NOT NULL,
        riddle TEXT NOT NULL
      );
    `;

    await client`
      CREATE TABLE IF NOT EXISTS teampath (
        id SERIAL PRIMARY KEY,
        "teamID" INTEGER NOT NULL REFERENCES teams(id),
        "checkpointID" INTEGER NOT NULL REFERENCES checkpoints(id),
        solved INTEGER NOT NULL DEFAULT 0,
        "solvedTime" TIMESTAMP DEFAULT NOW() NOT NULL,
        "orderNum" INTEGER NOT NULL
      );
    `;

    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    await client.end();
  }
}

migrate();
