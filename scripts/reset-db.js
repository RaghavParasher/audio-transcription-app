require('dotenv').config();
const { Client } = require('pg');

async function dropAll() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("No DATABASE_URL found in environment!");
    process.exit(1);
  }
  const client = new Client({
    connectionString,
  });
  await client.connect();
  console.log("Connected to DB");
  try {
    await client.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO public;
    `);
    console.log("All tables dropped and public schema recreated.");
  } catch (err) {
    console.error("Error dropping tables:", err);
  } finally {
    await client.end();
  }
}

dropAll();
