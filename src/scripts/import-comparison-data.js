/**
 * Script to import framework comparison data from CSV files
 * 
 * This script reads CSV files containing framework comparison data
 * and imports them into the database. It handles multiple languages
 * and various comparison criteria.
 * 
 * Usage: node import-comparison-data.js --file=path/to/data.csv --language=en
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const csv = require('csv-parser');
require('dotenv').config();

// Parse command line arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.split('=');
  acc[key.replace('--', '')] = value;
  return acc;
}, {});

if (!args.file) {
  console.error('Please provide a CSV file path using --file=path/to/data.csv');
  process.exit(1);
}

const filePath = args.file;
const language = args.language || 'en';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'climate_frameworks',
  waitForConnections: true,
  connectionLimit: 10
};

// Map CSV columns to database criteria keys
const columnMapping = {
  'Adaptation Definition': 'adaptationDefinition',
  'Technical Specificity': 'technicalSpecificity',
  'Regulatory Status': 'regulatoryStatus',
  'Energy Storage Criteria': 'energyStorageCriteria',
  'Transport Criteria': 'transportCriteria',
  'Building Criteria': 'buildingCriteria',
  'Water Criteria': 'waterCriteria',
  'Implementation Requirements': 'implementationRequirements'
};

// Spanish column mappings
const esColumnMapping = {
  'Definición de Adaptación': 'adaptationDefinition',
  'Especificidad Técnica': 'technicalSpecificity',
  'Estado Regulatorio': 'regulatoryStatus',
  'Criterios de Almacenamiento de Energía': 'energyStorageCriteria',
  'Criterios de Transporte': 'transportCriteria',
  'Criterios de Edificios': 'buildingCriteria',
  'Criterios de Agua': 'waterCriteria',
  'Requisitos de Implementación': 'implementationRequirements'
};

// Portuguese column mappings
const ptColumnMapping = {
  'Definição de Adaptação': 'adaptationDefinition',
  'Especificidade Técnica': 'technicalSpecificity',
  'Status Regulatório': 'regulatoryStatus',
  'Critérios de Armazenamento de Energia': 'energyStorageCriteria',
  'Critérios de Transporte': 'transportCriteria',
  'Critérios de Edifícios': 'buildingCriteria',
  'Critérios de Água': 'waterCriteria',
  'Requisitos de Implementação': 'implementationRequirements'
};

// Select the appropriate column mapping based on language
const getColumnMapping = (lang) => {
  switch(lang) {
    case 'es': return esColumnMapping;
    case 'pt': return ptColumnMapping;
    default: return columnMapping;
  }
};

/**
 * Main import function
 */
async function importComparisonData() {
  const mapping = getColumnMapping(language);
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log(`Starting import for language: ${language}`);
    console.log(`Reading file: ${filePath}`);
    
    const results = [];
    
    // Read CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`Found ${results.length} rows of data`);
    
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
    }
    
    // Process each row
    for (const row of results) {
      const frameworkId = row['framework_id'] || row['Framework ID'];
      
      if (!frameworkId) {
        console.warn('Skipping row with no framework ID');
        continue;
      }
      
      // Check if framework exists
      const [frameworks] = await connection.query(`
        SELECT id FROM frameworks WHERE id = ?
      `, [frameworkId]);
      
      if (frameworks.length === 0) {
        console.warn(`Framework ${frameworkId} does not exist in the database. Skipping.`);
        continue;
      }
      
      console.log(`Processing framework: ${frameworkId}`);
      
      // Delete existing data for this framework and language
      await connection.query(`
        DELETE FROM framework_comparisons 
        WHERE framework_id = ? AND language_id = ?
      `, [frameworkId, language]);
      
      // Insert data for each criteria
      for (const [column, value] of Object.entries(row)) {
        if (column === 'framework_id' || column === 'Framework ID' || 
            column === 'framework_name' || column === 'Framework Name') {
          continue;
        }
        
        const criteriaKey = mapping[column];
        
        if (!criteriaKey) {
          console.warn(`No mapping found for column: ${column}`);
          continue;
        }
        
        if (value) {
          await connection.query(`
            INSERT INTO framework_comparisons 
            (framework_id, language_id, criteria_key, criteria_value)
            VALUES (?, ?, ?, ?)
          `, [frameworkId, language, criteriaKey, value]);
          
          console.log(`Imported ${criteriaKey} data for ${frameworkId}`);
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
  .then(() => console.log('Script completed'))
  .catch(err => console.error('Script failed:', err));