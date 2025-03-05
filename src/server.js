// src/server.js - Express.js backend for Climate Adaptation Frameworks Explorer

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'climate_frameworks',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Check for admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  next();
};

// API Routes

// Authentication
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );
    
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Public API Routes

// Get all frameworks
app.get('/api/frameworks', async (req, res) => {
  try {
    const language = req.query.lang || 'en';
    
    const [frameworks] = await pool.query(`
      SELECT f.id, f.ranking, f.type, f.region, 
             ft.name, ft.description
      FROM frameworks f
      JOIN framework_translations ft ON f.id = ft.framework_id
      WHERE ft.language_id = ?
      ORDER BY ft.name
    `, [language]);
    
    res.json(frameworks);
  } catch (error) {
    console.error('Error fetching frameworks:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get framework details
app.get('/api/frameworks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const language = req.query.lang || 'en';
    
    // Get framework details
    const [frameworks] = await pool.query(`
      SELECT f.id, f.ranking, f.type, f.region, 
             ft.name, ft.description, ft.adaptation_definition, ft.regulatory_status
      FROM frameworks f
      JOIN framework_translations ft ON f.id = ft.framework_id
      WHERE f.id = ? AND ft.language_id = ?
    `, [id, language]);
    
    if (frameworks.length === 0) {
      return res.status(404).json({ error: 'Framework not found' });
    }
    
    const framework = frameworks[0];
    
    // Get key features
    const [keyFeatures] = await pool.query(`
      SELECT feature_text
      FROM framework_key_features
      WHERE framework_id = ? AND language_id = ?
      ORDER BY display_order
    `, [id, language]);
    
    // Get sources
    const [sources] = await pool.query(`
      SELECT source_text, source_url
      FROM framework_sources
      WHERE framework_id = ? AND language_id = ?
      ORDER BY display_order
    `, [id, language]);
    
    // Combine all data
    const frameworkDetails = {
      ...framework,
      keyFeatures: keyFeatures.map(f => f.feature_text),
      sources: sources.map(s => ({
        text: s.source_text,
        url: s.source_url
      }))
    };
    
    res.json(frameworkDetails);
  } catch (error) {
    console.error('Error fetching framework details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// API endpoint to get framework comparison data
app.get('/api/frameworks/:id/comparison', async (req, res) => {
  try {
    const { id } = req.params;
    const language = req.query.lang || 'en';
    
    // Get comparison data from the framework_comparisons table
    const [comparisons] = await pool.query(`
      SELECT criteria_key, criteria_value
      FROM framework_comparisons
      WHERE framework_id = ? AND language_id = ?
    `, [id, language]);
    
    if (comparisons.length === 0) {
      // If no comparison data exists, generate basic comparison data from existing framework details
      const [framework] = await pool.query(`
        SELECT ft.adaptation_definition, ft.regulatory_status
        FROM frameworks f
        JOIN framework_translations ft ON f.id = ft.framework_id
        WHERE f.id = ? AND ft.language_id = ?
      `, [id, language]);
      
      if (framework.length === 0) {
        return res.status(404).json({ error: 'Framework not found' });
      }
      
      // Create basic comparison data
      const comparisonData = {
        adaptationDefinition: framework[0].adaptation_definition || '',
        regulatoryStatus: framework[0].regulatory_status || '',
        technicalSpecificity: '',
        energyStorageCriteria: '',
        transportCriteria: '',
        buildingCriteria: '',
        waterCriteria: '',
        implementationRequirements: ''
      };
      
      // Try to get sector-specific criteria to generate technical specificity rating
      const [sectorCounts] = await pool.query(`
        SELECT COUNT(*) AS criteria_count
        FROM framework_sector_criteria
        WHERE framework_id = ? AND language_id = ?
      `, [id, language]);
      
      if (sectorCounts[0].criteria_count > 10) {
        comparisonData.technicalSpecificity = language === 'en' ? 
          'Detailed technical screening criteria with specific thresholds for different hazards.' :
          language === 'es' ?
          'Criterios técnicos detallados con umbrales específicos para diferentes peligros.' :
          'Critérios técnicos detalhados com limites específicos para diferentes perigos.';
      } else if (sectorCounts[0].criteria_count > 5) {
        comparisonData.technicalSpecificity = language === 'en' ?
          'Moderate technical criteria with some specific requirements.' :
          language === 'es' ?
          'Criterios técnicos moderados con algunos requisitos específicos.' :
          'Critérios técnicos moderados com alguns requisitos específicos.';
      } else {
        comparisonData.technicalSpecificity = language === 'en' ?
          'General principles without standardized technical thresholds; context-specific approach.' :
          language === 'es' ?
          'Principios generales sin umbrales técnicos estandarizados; enfoque específico del contexto.' :
          'Princípios gerais sem limites técnicos padronizados; abordagem específica do contexto.';
      }
      
      // Get energy storage criteria if available
      const [energyCriteria] = await pool.query(`
        SELECT fsc.requirements
        FROM framework_sector_criteria fsc
        WHERE fsc.framework_id = ? 
          AND fsc.sector_id = 'energy-storage'
          AND fsc.language_id = ?
        LIMIT 1
      `, [id, language]);
      
      if (energyCriteria.length > 0) {
        comparisonData.energyStorageCriteria = energyCriteria[0].requirements.substring(0, 200) + '...';
      }
      
      return res.json(comparisonData);
    }
    
    // Format comparison data as object with criteria as keys
    const comparisonData = {};
    comparisons.forEach(row => {
      comparisonData[row.criteria_key] = row.criteria_value;
    });
    
    return res.json(comparisonData);
  } catch (error) {
    console.error('Error fetching comparison data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * API endpoint to compare multiple frameworks
 */
app.get('/api/frameworks/compare', async (req, res) => {
  try {
    const { ids } = req.query;
    const language = req.query.lang || 'en';
    
    if (!ids) {
      return res.status(400).json({ error: 'No framework IDs provided' });
    }
    
    const frameworkIds = ids.split(',');
    const results = {};
    
    // Get comparison data for each framework
    for (const id of frameworkIds) {
      // Get comparison data from the framework_comparisons table
      const [comparisons] = await pool.query(`
        SELECT criteria_key, criteria_value
        FROM framework_comparisons
        WHERE framework_id = ? AND language_id = ?
      `, [id, language]);
      
      if (comparisons.length > 0) {
        const frameworkData = {};
        comparisons.forEach(row => {
          frameworkData[row.criteria_key] = row.criteria_value;
        });
        results[id] = frameworkData;
      } else {
        // If no comparison data exists, generate basic comparison data
        const [framework] = await pool.query(`
          SELECT ft.adaptation_definition, ft.regulatory_status
          FROM frameworks f
          JOIN framework_translations ft ON f.id = ft.framework_id
          WHERE f.id = ? AND ft.language_id = ?
        `, [id, language]);
        
        if (framework.length > 0) {
          results[id] = {
            adaptationDefinition: framework[0].adaptation_definition || '',
            regulatoryStatus: framework[0].regulatory_status || '',
            technicalSpecificity: 'No detailed information available',
            energyStorageCriteria: 'No detailed information available',
            transportCriteria: 'No detailed information available',
            buildingCriteria: 'No detailed information available',
            waterCriteria: 'No detailed information available',
            implementationRequirements: 'No detailed information available'
          };
        } else {
          results[id] = {
            adaptationDefinition: 'No information available',
            regulatoryStatus: 'No information available',
            technicalSpecificity: 'No information available',
            energyStorageCriteria: 'No information available',
            transportCriteria: 'No information available',
            buildingCriteria: 'No information available',
            waterCriteria: 'No information available',
            implementationRequirements: 'No information available'
          };
        }
      }
    }
    
    return res.json(results);
  } catch (error) {
    console.error('Error comparing frameworks:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get framework criteria for a specific sector
app.get('/api/frameworks/:id/sectors/:sectorId', async (req, res) => {
  try {
    const { id, sectorId } = req.params;
    const language = req.query.lang || 'en';
    
    const [criteria] = await pool.query(`
      SELECT 
        cct.name as criteria, 
        fsc.requirements, 
        fsc.source_text as source
      FROM framework_sector_criteria fsc
      JOIN criteria_categories cc ON fsc.category_id = cc.id
      JOIN criteria_category_translations cct ON cc.id = cct.category_id AND cct.language_id = ?
      WHERE fsc.framework_id = ? 
        AND fsc.sector_id = ? 
        AND fsc.language_id = ?
    `, [language, id, sectorId, language]);
    
    res.json(criteria);
  } catch (error) {
    console.error('Error fetching sector criteria:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all sectors
app.get('/api/sectors', async (req, res) => {
  try {
    const language = req.query.lang || 'en';
    
    const [sectors] = await pool.query(`
      SELECT s.id, st.name
      FROM sectors s
      JOIN sector_translations st ON s.id = st.sector_id
      WHERE st.language_id = ?
      ORDER BY s.display_order
    `, [language]);
    
    res.json(sectors);
  } catch (error) {
    console.error('Error fetching sectors:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get news items
app.get('/api/news', async (req, res) => {
  try {
    const language = req.query.lang || 'en';
    
    const [news] = await pool.query(`
      SELECT n.id, nt.title, n.image_url, n.link_url
      FROM news n
      JOIN news_translations nt ON n.id = nt.news_id
      WHERE nt.language_id = ?
      ORDER BY n.display_order, n.publication_date DESC
    `, [language]);
    
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get resources
app.get('/api/resources', async (req, res) => {
  try {
    const language = req.query.lang || 'en';
    const category = req.query.category;
    
    let query = `
      SELECT r.id, rt.title, r.link_url, r.category
      FROM resources r
      JOIN resource_translations rt ON r.id = rt.resource_id
      WHERE rt.language_id = ?
    `;
    
    const params = [language];
    
    if (category) {
      query += ' AND r.category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY r.display_order';
    
    const [resources] = await pool.query(query, params);
    
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin API Routes (protected)

// Create a new framework
app.post('/api/admin/frameworks', authenticateToken, async (req, res) => {
  try {
    const { id, ranking, type, region, translations } = req.body;
    
    // Begin transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert framework
      await connection.query(
        'INSERT INTO frameworks (id, ranking, type, region) VALUES (?, ?, ?, ?)',
        [id, ranking, type, region]
      );
      
      // Insert translations
      for (const lang in translations) {
        const { name, description, adaptationDefinition, regulatoryStatus, keyFeatures, sources } = translations[lang];
        
        // Insert framework translation
        await connection.query(
          `INSERT INTO framework_translations 
           (framework_id, language_id, name, description, adaptation_definition, regulatory_status) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id, lang, name, description, adaptationDefinition, regulatoryStatus]
        );
        
        // Insert key features
        if (keyFeatures && keyFeatures.length) {
          for (let i = 0; i < keyFeatures.length; i++) {
            await connection.query(
              `INSERT INTO framework_key_features
               (framework_id, language_id, feature_text, display_order)
               VALUES (?, ?, ?, ?)`,
              [id, lang, keyFeatures[i], i]
            );
          }
        }
        
        // Insert sources
        if (sources && sources.length) {
          for (let i = 0; i < sources.length; i++) {
            await connection.query(
              `INSERT INTO framework_sources
               (framework_id, language_id, source_text, source_url, display_order)
               VALUES (?, ?, ?, ?, ?)`,
              [id, lang, sources[i].text, sources[i].url, i]
            );
          }
        }
      }
      
      // Add audit log entry
      await connection.query(
        `INSERT INTO audit_log (user_id, action, entity_type, entity_id, changes)
         VALUES (?, 'create', 'framework', ?, ?)`,
        [req.user.id, id, JSON.stringify(req.body)]
      );
      
      await connection.commit();
      res.status(201).json({ id });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating framework:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a framework
app.put('/api/admin/frameworks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { ranking, type, region, translations } = req.body;
    
    // Begin transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Update framework
      await connection.query(
        'UPDATE frameworks SET ranking = ?, type = ?, region = ? WHERE id = ?',
        [ranking, type, region, id]
      );
      
      // Update translations
      for (const lang in translations) {
        const { name, description, adaptationDefinition, regulatoryStatus, keyFeatures, sources } = translations[lang];
        
        // Check if translation exists
        const [existingTranslations] = await connection.query(
          'SELECT id FROM framework_translations WHERE framework_id = ? AND language_id = ?',
          [id, lang]
        );
        
        if (existingTranslations.length > 0) {
          // Update existing translation
          await connection.query(
            `UPDATE framework_translations 
             SET name = ?, description = ?, adaptation_definition = ?, regulatory_status = ? 
             WHERE framework_id = ? AND language_id = ?`,
            [name, description, adaptationDefinition, regulatoryStatus, id, lang]
          );
        } else {
          // Insert new translation
          await connection.query(
            `INSERT INTO framework_translations 
             (framework_id, language_id, name, description, adaptation_definition, regulatory_status) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id, lang, name, description, adaptationDefinition, regulatoryStatus]
          );
        }
        
        // Handle key features - first delete existing ones
        await connection.query(
          'DELETE FROM framework_key_features WHERE framework_id = ? AND language_id = ?',
          [id, lang]
        );
        
        // Insert key features
        if (keyFeatures && keyFeatures.length) {
          for (let i = 0; i < keyFeatures.length; i++) {
            await connection.query(
              `INSERT INTO framework_key_features
               (framework_id, language_id, feature_text, display_order)
               VALUES (?, ?, ?, ?)`,
              [id, lang, keyFeatures[i], i]
            );
          }
        }
        
        // Handle sources - first delete existing ones
        await connection.query(
          'DELETE FROM framework_sources WHERE framework_id = ? AND language_id = ?',
          [id, lang]
        );
        
        // Insert sources
        if (sources && sources.length) {
          for (let i = 0; i < sources.length; i++) {
            await connection.query(
              `INSERT INTO framework_sources
               (framework_id, language_id, source_text, source_url, display_order)
               VALUES (?, ?, ?, ?, ?)`,
              [id, lang, sources[i].text, sources[i].url, i]
            );
          }
        }
      }
      
      // Add audit log entry
      await connection.query(
        `INSERT INTO audit_log (user_id, action, entity_type, entity_id, changes)
         VALUES (?, 'update', 'framework', ?, ?)`,
        [req.user.id, id, JSON.stringify(req.body)]
      );
      
      await connection.commit();
      res.json({ id });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating framework:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a framework
app.delete('/api/admin/frameworks/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM frameworks WHERE id = ?', [id]);
    
    // Add audit log entry
    await pool.query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id)
       VALUES (?, 'delete', 'framework', ?)`,
      [req.user.id, id]
    );
    
    res.json({ message: 'Framework deleted successfully' });
  } catch (error) {
    console.error('Error deleting framework:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update framework criteria for a sector
app.put('/api/admin/frameworks/:id/sectors/:sectorId', authenticateToken, async (req, res) => {
  try {
    const { id, sectorId } = req.params;
    const { criteria, language } = req.body;
    
    // Begin transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Delete existing criteria
      await connection.query(
        'DELETE FROM framework_sector_criteria WHERE framework_id = ? AND sector_id = ? AND language_id = ?',
        [id, sectorId, language]
      );
      
      // Insert new criteria
      for (const item of criteria) {
        await connection.query(
          `INSERT INTO framework_sector_criteria
           (framework_id, sector_id, category_id, language_id, requirements, source_text, source_url)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, sectorId, item.categoryId, language, item.requirements, item.source, item.sourceUrl]
        );
      }
      
      // Add audit log entry
      await connection.query(
        `INSERT INTO audit_log (user_id, action, entity_type, entity_id, changes)
         VALUES (?, 'update', 'sector_criteria', ?, ?)`,
        [req.user.id, `${id}_${sectorId}`, JSON.stringify(req.body)]
      );
      
      await connection.commit();
      res.json({ message: 'Criteria updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating sector criteria:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User management (admin only)
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, name, email, role, last_login, created_at FROM users'
    );
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, password, name, email, role } = req.body;
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    await pool.query(
      'INSERT INTO users (username, password_hash, name, email, role) VALUES (?, ?, ?, ?, ?)',
      [username, passwordHash, name, email, role]
    );
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    
    if (password) {
      // Update with new password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      await pool.query(
        'UPDATE users SET name = ?, email = ?, role = ?, password_hash = ? WHERE id = ?',
        [name, email, role, passwordHash, id]
      );
    } else {
      // Update without changing password
      await pool.query(
        'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
        [name, email, role, id]
      );
    }
    
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// News management
app.post('/api/admin/news', authenticateToken, async (req, res) => {
  try {
    const { id, image_url, link_url, publication_date, translations, display_order } = req.body;
    
    // Begin transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert news item
      await connection.query(
        'INSERT INTO news (id, image_url, link_url, publication_date, display_order) VALUES (?, ?, ?, ?, ?)',
        [id, image_url, link_url, publication_date, display_order]
      );
      
      // Insert translations
      for (const lang in translations) {
        const { title, summary } = translations[lang];
        
        await connection.query(
          'INSERT INTO news_translations (news_id, language_id, title, summary) VALUES (?, ?, ?, ?)',
          [id, lang, title, summary]
        );
      }
      
      await connection.commit();
      res.status(201).json({ id });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating news item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Resource management
app.post('/api/admin/resources', authenticateToken, async (req, res) => {
  try {
    const { id, category, link_url, translations, display_order } = req.body;
    
    // Begin transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert resource
      await connection.query(
        'INSERT INTO resources (id, category, link_url, display_order) VALUES (?, ?, ?, ?)',
        [id, category, link_url, display_order]
      );
      
      // Insert translations
      for (const lang in translations) {
        const { title, description } = translations[lang];
        
        await connection.query(
          'INSERT INTO resource_translations (resource_id, language_id, title, description) VALUES (?, ?, ?, ?)',
          [id, lang, title, description]
        );
      }
      
      await connection.commit();
      res.status(201).json({ id });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app; // For testing purposes
