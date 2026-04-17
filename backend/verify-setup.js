#!/usr/bin/env node

/**
 * Strength Tracker - Setup Verification Script
 * Checks all dependencies and database connection
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = require('./src/config/database');

async function verify() {
  console.log('\n=== Strength Tracker Setup Verification ===\n');

  // Check 1: Environment file
  console.log('✓ Checking environment configuration...');
  try {
    if (!fs.existsSync(path.join(__dirname, '.env'))) {
      console.error('✗ .env file not found. Run: cp .env.example .env');
      process.exit(1);
    }
    console.log('✓ .env file exists');
  } catch (error) {
    console.error('✗ Error checking .env:', error.message);
    process.exit(1);
  }

  // Check 2: Required packages
  console.log('\n✓ Checking required packages...');
  const packages = [
    'express',
    'pg',
    'cors',
    'dotenv',
    'jsonwebtoken',
    'passport',
    'passport-google-oauth20',
    'passport-github2',
    'bcryptjs',
  ];

  for (const pkg of packages) {
    try {
      require.resolve(pkg);
      console.log(`  ✓ ${pkg}`);
    } catch {
      console.error(`  ✗ ${pkg} not installed. Run: npm install`);
      process.exit(1);
    }
  }

  // Check 3: Database connection
  console.log('\n✓ Checking database connection...');
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connected successfully');
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    console.error('\nMake sure PostgreSQL is running:');
    console.error('  - Mac: brew services start postgresql');
    console.error('  - Linux: sudo service postgresql start');
    console.error('\nOr check your .env database credentials');
    process.exit(1);
  }

  // Check 4: Database schema
  console.log('\n✓ Checking database tables...');
  try {
    const tables = ['users', 'workouts', 'friends', 'exercises', 'leaderboard'];
    const result = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const existingTables = result.rows.map(r => r.table_name);
    let allTablesExist = true;
    
    for (const table of tables) {
      if (existingTables.includes(table)) {
        console.log(`  ✓ ${table} table exists`);
      } else {
        console.error(`  ✗ ${table} table not found`);
        allTablesExist = false;
      }
    }

    if (!allTablesExist) {
      console.error('\nRun migrations:');
      console.error('  psql strength_tracker < src/migrations/init.sql');
      console.error('  psql strength_tracker < src/migrations/seedExercises.sql');
      process.exit(1);
    }
  } catch (error) {
    console.error('✗ Error checking tables:', error.message);
    process.exit(1);
  }

  // Check 5: OAuth configuration
  console.log('\n✓ Checking OAuth configuration...');
  const oauthVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'];
  let allOAuthConfigured = true;

  for (const variable of oauthVars) {
    if (process.env[variable]) {
      console.log(`  ✓ ${variable} configured`);
    } else {
      console.error(`  ✗ ${variable} not set (optional for local development)`);
      allOAuthConfigured = false;
    }
  }

  if (!allOAuthConfigured) {
    console.error('\nNote: OAuth optional for local dev, required for production');
    console.error('See DEVELOPMENT.md for setup instructions');
  }

  // Check 6: Required environment variables
  console.log('\n✓ Checking required environment variables...');
  const requiredVars = ['JWT_SECRET', 'PORT', 'NODE_ENV'];
  
  for (const variable of requiredVars) {
    if (process.env[variable]) {
      console.log(`  ✓ ${variable} = ${process.env[variable]}`);
    } else {
      console.error(`  ✗ ${variable} not set`);
    }
  }

  console.log('\n=== Setup Verification Complete ===');
  console.log('\nAll systems go! Run: npm run dev\n');
  
  process.exit(0);
}

verify().catch(error => {
  console.error('Verification failed:', error);
  process.exit(1);
});
