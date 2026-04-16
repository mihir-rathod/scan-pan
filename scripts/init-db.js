const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error("❌ Error: DATABASE_URL is not set in .env.local");
        process.exit(1);
    }

    console.log("🛠️  Initializing Database...");

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Users Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("✅ Users table ensured.");

        // 2. Pantry Items Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS pantry_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        quantity TEXT,
        expiry TEXT,
        category TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("✅ Pantry Items table ensured.");

        // 3. Saved Recipes Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS saved_recipes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        instructions TEXT,
        ingredients JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("✅ Saved Recipes table ensured.");

        // 4. Add category column if it doesn't exist (migration for existing DBs)
        await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'pantry_items' AND column_name = 'category'
        ) THEN
          ALTER TABLE pantry_items ADD COLUMN category TEXT;
        END IF;
      END $$;
    `);
        console.log("✅ Category column ensured.");

        await client.query('COMMIT');
        console.log("🚀 Database setup complete!");
    } catch (e) {
        await client.query('ROLLBACK');
        console.error("❌ Database setup failed:", e);
    } finally {
        client.release();
        pool.end();
    }
}

main();
