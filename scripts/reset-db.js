const { Client } = require('pg');

async function dropAll() {
  const client = new Client({
    connectionString: "postgresql://postgres:CUmftfRebnvgiXTyQOKaRGwROGjahXKV@shortline.proxy.rlwy.net:14313/railway",
  });
  await client.connect();
  console.log("Connected to DB");
  try {
    await client.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
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
