/**
 * Script to set up the Climate Frameworks Explorer database
 * 
 * This script:
 * 1. Creates the database if it doesn't exist
 * 2. Runs the schema creation script
 * 3. Populates initial data
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  console.log('Setting up Climate Frameworks Explorer database...');
  
  // Connect without database specified first
  let connection;
  
  try {
    // Create connection to MySQL without specifying a database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'climate_frameworks';
    console.log(`Creating database ${dbName} if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    
    // Use the database
    await connection.query(`USE ${dbName}`);
    
    // Read and execute database schema
    console.log('Creating database schema...');
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'src/database/database-schema.sql'), 
      'utf8'
    );
    
    // Split into separate statements
    const statements = schemaSQL.split(';')
      .filter(statement => statement.trim() !== '');
    
    for (const statement of statements) {
      try {
        await connection.query(statement);
      } catch (err) {
        console.error(`Error executing statement: ${statement.substring(0, 100)}...`);
        throw err;
      }
    }
    
    // Populate comparison data
    console.log('Populating framework comparison data...');
    const comparisonSQL = fs.readFileSync(
      path.join(__dirname, 'src/database/populate-comparison-data.sql'), 
      'utf8'
    );
    
    const comparisonStatements = comparisonSQL.split(';')
      .filter(statement => statement.trim() !== '');
    
    for (const statement of comparisonStatements) {
      try {
        await connection.query(statement);
      } catch (err) {
        console.error(`Error populating comparison data: ${statement.substring(0, 100)}...`);
        throw err;
      }
    }
    
    console.log('Database setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log('Database setup script completed.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Database setup failed:', err);
    process.exit(1);
  });
