const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

const runMigrations = async () => {
  const migrationsDir = path.join(__dirname);
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  console.log('Found migration files:', files);

  for (const file of files) {
    console.log(`Running migration: ${file}`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    try {
      await pool.query(sql);
      console.log(`Successfully completed migration: ${file}`);
    } catch (err) {
      console.error(`Error running migration ${file}:`, err);
      // We don't exit here to allow other migrations to run if one fails due to existing tables
    }
  }

  process.exit(0);
};

runMigrations().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
