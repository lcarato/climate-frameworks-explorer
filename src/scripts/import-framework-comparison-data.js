/**
 * Script to import framework comparison data into the database
 * 
 * This script reads the framework comparison data from the framework-comparison-data.js file
 * and imports it into the framework_comparisons table in the database.
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Import the framework comparison data
const { frameworkComparisonData } = require('./framework-comparison-data');

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'climate_frameworks',
  waitForConnections: true,
  connectionLimit: 10
};

/**
 * Import the comparison data to the database
 */
async function importComparisonData() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('Starting import of framework comparison data');
    
    // Check if the framework_comparisons table exists
    const [tables] = await connection.query(`
      SHOW TABLES LIKE 'framework_comparisons'
    `);
    
    if (tables.length === 0) {
      console.log('Creating framework_comparisons table');
      await connection.query(`
        CREATE TABLE framework_comparisons (
          id INT AUTO_INCREMENT PRIMARY KEY,
          framework_id VARCHAR(50) NOT NULL,
          language_id VARCHAR(10) NOT NULL,
          criteria_key VARCHAR(50) NOT NULL,
          criteria_value TEXT,
          FOREIGN KEY (framework_id) REFERENCES frameworks(id) ON DELETE CASCADE,
          FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
          UNIQUE KEY (framework_id, language_id, criteria_key)
        )
      `);
    } else {
      // Clear existing data
      console.log('Clearing existing framework comparison data');
      await connection.query(`DELETE FROM framework_comparisons`);
    }
    
    // Import framework comparison data
    console.log('Importing framework comparison data');
    
    const criteriaKeys = [
      'adaptationDefinition',
      'technicalSpecificity',
      'regulatoryStatus',
      'energyStorageCriteria',
      'transportCriteria',
      'buildingCriteria',
      'waterCriteria',
      'implementationRequirements'
    ];
    
    const languages = ['en', 'es', 'pt'];
    
    for (const [frameworkId, frameworkData] of Object.entries(frameworkComparisonData)) {
      console.log(`Processing framework: ${frameworkId}`);
      
      for (const language of languages) {
        if (frameworkData[language]) {
          for (const criteriaKey of criteriaKeys) {
            const criteriaValue = frameworkData[language][criteriaKey];
            
            if (criteriaValue) {
              await connection.query(`
                INSERT INTO framework_comparisons 
                (framework_id, language_id, criteria_key, criteria_value)
                VALUES (?, ?, ?, ?)
              `, [frameworkId, language, criteriaKey, criteriaValue]);
              
              console.log(`Imported ${criteriaKey} for ${frameworkId} in ${language}`);
            }
          }
        }
      }
    }
    
    console.log('Import completed successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await connection.end();
  }
}

// Run the import
importComparisonData()
  .then(() => console.log('Import script completed'))
  .catch(err => console.error('Import script failed:', err));
