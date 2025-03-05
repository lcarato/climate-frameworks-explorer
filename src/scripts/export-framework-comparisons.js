/**
 * Script to export framework comparison data from Climate Adaptation Frameworks Explorer
 * 
 * This script extracts comparison data for all frameworks in the system, including:
 * - Adaptation definitions
 * - Technical specifications
 * - Regulatory status
 * - Sectoral criteria (energy storage, infrastructure, etc.)
 * 
 * The data is exported as JSON that can be used to populate the database
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'climate_frameworks',
  waitForConnections: true,
  connectionLimit: 10
};

// Supported languages
const languages = ['en', 'es', 'pt'];

// Main criteria categories for comparison
const comparisonCriteria = [
  'adaptationDefinition', 
  'technicalSpecificity', 
  'regulatoryStatus', 
  'energyStorageCriteria',
  'transportCriteria',
  'buildingCriteria',
  'waterCriteria',
  'implementationRequirements'
];

/**
 * Get all frameworks from the database
 */
async function getFrameworks(connection) {
  const [rows] = await connection.query(`
    SELECT f.id, ft.language_id, ft.name
    FROM frameworks f
    JOIN framework_translations ft ON f.id = ft.framework_id
    ORDER BY f.id, ft.language_id
  `);
  
  // Group by framework ID
  const frameworks = {};
  rows.forEach(row => {
    if (!frameworks[row.id]) {
      frameworks[row.id] = { id: row.id, names: {} };
    }
    frameworks[row.id].names[row.language_id] = row.name;
  });
  
  return Object.values(frameworks);
}

/**
 * Get comparison data for each framework and criteria
 */
async function getComparisonData(connection, frameworks) {
  const result = {};
  
  for (const framework of frameworks) {
    result[framework.id] = {
      id: framework.id,
      names: framework.names,
      criteria: {}
    };
    
    // Get basic framework details for each language
    for (const lang of languages) {
      const [details] = await connection.query(`
        SELECT 
          ft.adaptation_definition,
          ft.regulatory_status
        FROM framework_translations ft
        WHERE ft.framework_id = ? AND ft.language_id = ?
      `, [framework.id, lang]);
      
      if (details.length > 0) {
        result[framework.id].criteria[lang] = {
          adaptationDefinition: details[0].adaptation_definition || '',
          regulatoryStatus: details[0].regulatory_status || '',
          technicalSpecificity: '', // Will be populated from sectors data
          energyStorageCriteria: '', // Will be populated from sectors data
          transportCriteria: '',
          buildingCriteria: '',
          waterCriteria: '',
          implementationRequirements: ''
        };
      }
    }
    
    // Get sector-specific criteria
    const sectors = ['energy-storage', 'transport', 'buildings', 'water'];
    for (const sector of sectors) {
      for (const lang of languages) {
        const criteriaField = sector === 'energy-storage' ? 'energyStorageCriteria' :
                             sector === 'transport' ? 'transportCriteria' :
                             sector === 'buildings' ? 'buildingCriteria' : 'waterCriteria';
        
        const [criteria] = await connection.query(`
          SELECT 
            fsc.requirements,
            cc.id AS category_id
          FROM framework_sector_criteria fsc
          JOIN criteria_categories cc ON fsc.category_id = cc.id
          WHERE fsc.framework_id = ? 
            AND fsc.sector_id = ? 
            AND fsc.language_id = ?
        `, [framework.id, sector, lang]);
        
        if (criteria.length > 0) {
          // Combine all criteria for this sector
          const criteriaText = criteria.map(c => {
            return `${c.category_id}: ${c.requirements}`;
          }).join('\n\n');
          
          if (result[framework.id].criteria[lang]) {
            result[framework.id].criteria[lang][criteriaField] = criteriaText;
          }
        }
      }
    }
    
    // Get technical specificity from criteria categories
    for (const lang of languages) {
      const [techSpecs] = await connection.query(`
        SELECT COUNT(*) AS count, 
               SUM(CHAR_LENGTH(fsc.requirements)) AS total_length
        FROM framework_sector_criteria fsc
        WHERE fsc.framework_id = ? 
          AND fsc.language_id = ?
      `, [framework.id, lang]);
      
      if (techSpecs.length > 0 && techSpecs[0].count > 0) {
        const averageLength = techSpecs[0].total_length / techSpecs[0].count;
        let technicalLevel = '';
        
        if (averageLength > 500) {
          technicalLevel = lang === 'en' ? 'Detailed technical screening criteria with specific thresholds for different hazards.' :
                          lang === 'es' ? 'Criterios técnicos detallados con umbrales específicos para diferentes peligros.' :
                          'Critérios técnicos detalhados com limites específicos para diferentes perigos.';
        } else if (averageLength > 200) {
          technicalLevel = lang === 'en' ? 'Moderate technical criteria with some specific requirements.' :
                          lang === 'es' ? 'Criterios técnicos moderados con algunos requisitos específicos.' :
                          'Critérios técnicos moderados com alguns requisitos específicos.';
        } else {
          technicalLevel = lang === 'en' ? 'General principles without standardized technical thresholds; context-specific approach.' :
                          lang === 'es' ? 'Principios generales sin umbrales técnicos estandarizados; enfoque específico del contexto.' :
                          'Princípios gerais sem limites técnicos padronizados; abordagem específica do contexto.';
        }
        
        if (result[framework.id].criteria[lang]) {
          result[framework.id].criteria[lang].technicalSpecificity = technicalLevel;
        }
      }
    }
    
    // Get implementation requirements
    for (const lang of languages) {
      const [implementation] = await connection.query(`
        SELECT feature_text
        FROM framework_key_features
        WHERE framework_id = ? 
          AND language_id = ?
          AND feature_text LIKE '%implement%'
      `, [framework.id, lang]);
      
      if (implementation.length > 0) {
        const implementationText = implementation.map(i => i.feature_text).join('\n\n');
        
        if (result[framework.id].criteria[lang]) {
          result[framework.id].criteria[lang].implementationRequirements = implementationText;
        }
      }
    }
  }
  
  return result;
}

/**
 * Generate SQL statements to update the comparison table
 */
function generateSqlStatements(comparisonData) {
  let sql = '-- SQL to populate framework comparison data\n\n';
  
  // Create comparison table if it doesn't exist
  sql += `
CREATE TABLE IF NOT EXISTS framework_comparisons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  framework_id VARCHAR(50) NOT NULL,
  language_id VARCHAR(10) NOT NULL,
  criteria_key VARCHAR(50) NOT NULL,
  criteria_value TEXT,
  FOREIGN KEY (framework_id) REFERENCES frameworks(id) ON DELETE CASCADE,
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
  UNIQUE KEY (framework_id, language_id, criteria_key)
);\n\n`;
  
  // Generate INSERT statements
  sql += '-- Clear existing data\n';
  sql += 'DELETE FROM framework_comparisons;\n\n';
  
  sql += '-- Insert comparison data\n';
  Object.values(comparisonData).forEach(framework => {
    Object.entries(framework.criteria).forEach(([lang, criteria]) => {
      Object.entries(criteria).forEach(([criteriaKey, criteriaValue]) => {
        if (criteriaValue) {
          const escapedValue = criteriaValue.replace(/'/g, "''");
          sql += `INSERT INTO framework_comparisons (framework_id, language_id, criteria_key, criteria_value) VALUES ('${framework.id}', '${lang}', '${criteriaKey}', '${escapedValue}');\n`;
        }
      });
    });
    sql += '\n';
  });
  
  return sql;
}

/**
 * Main function to export comparison data
 */
async function exportComparisonData() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Fetching frameworks...');
    const frameworks = await getFrameworks(connection);
    console.log(`Found ${frameworks.length} frameworks`);
    
    console.log('Gathering comparison data...');
    const comparisonData = await getComparisonData(connection, frameworks);
    
    // Export as JSON
    const jsonOutput = JSON.stringify(comparisonData, null, 2);
    fs.writeFileSync(path.join(__dirname, 'framework_comparisons.json'), jsonOutput);
    console.log('JSON data exported to framework_comparisons.json');
    
    // Generate SQL statements
    const sqlStatements = generateSqlStatements(comparisonData);
    fs.writeFileSync(path.join(__dirname, 'framework_comparisons.sql'), sqlStatements);
    console.log('SQL statements exported to framework_comparisons.sql');
    
    // Export as CSV for each language
    languages.forEach(lang => {
      let csv = `framework_id,framework_name,${comparisonCriteria.join(',')}\n`;
      
      Object.values(comparisonData).forEach(framework => {
        if (framework.criteria[lang]) {
          const frameworkName = framework.names[lang] || framework.names['en'] || framework.id;
          const criteriaValues = comparisonCriteria.map(key => {
            const value = framework.criteria[lang][key] || '';
            // Escape CSV values
            return `"${value.replace(/"/g, '""')}"`;
          });
          
          csv += `${framework.id},"${frameworkName}",${criteriaValues.join(',')}\n`;
        }
      });
      
      fs.writeFileSync(path.join(__dirname, `framework_comparisons_${lang}.csv`), csv);
      console.log(`CSV data for ${lang} exported to framework_comparisons_${lang}.csv`);
    });
    
  } catch (error) {
    console.error('Error exporting comparison data:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the export
exportComparisonData()
  .then(() => console.log('Export completed successfully'))
  .catch(err => console.error('Export failed:', err));
