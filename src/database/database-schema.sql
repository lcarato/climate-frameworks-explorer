-- Database schema for Climate Adaptation Frameworks Explorer

-- Languages table
CREATE TABLE languages (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE
);

-- Frameworks table
CREATE TABLE frameworks (
    id VARCHAR(50) PRIMARY KEY,
    ranking VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL,
    region VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Framework translations
CREATE TABLE framework_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    framework_id VARCHAR(50) NOT NULL,
    language_id VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    adaptation_definition TEXT,
    regulatory_status TEXT,
    FOREIGN KEY (framework_id) REFERENCES frameworks(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
    UNIQUE KEY (framework_id, language_id)
);

-- Framework key features
CREATE TABLE framework_key_features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    framework_id VARCHAR(50) NOT NULL,
    language_id VARCHAR(10) NOT NULL,
    feature_text TEXT NOT NULL,
    display_order INT NOT NULL,
    FOREIGN KEY (framework_id) REFERENCES frameworks(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);

-- Framework sources
CREATE TABLE framework_sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    framework_id VARCHAR(50) NOT NULL,
    language_id VARCHAR(10) NOT NULL,
    source_text TEXT NOT NULL,
    source_url VARCHAR(255),
    display_order INT NOT NULL,
    FOREIGN KEY (framework_id) REFERENCES frameworks(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);

-- Sectors table
CREATE TABLE sectors (
    id VARCHAR(50) PRIMARY KEY,
    display_order INT NOT NULL
);

-- Sector translations
CREATE TABLE sector_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sector_id VARCHAR(50) NOT NULL,
    language_id VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
    UNIQUE KEY (sector_id, language_id)
);

-- Criteria categories
CREATE TABLE criteria_categories (
    id VARCHAR(50) PRIMARY KEY
);

-- Criteria category translations
CREATE TABLE criteria_category_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id VARCHAR(50) NOT NULL,
    language_id VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES criteria_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
    UNIQUE KEY (category_id, language_id)
);

-- Framework criteria for sectors
CREATE TABLE framework_sector_criteria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    framework_id VARCHAR(50) NOT NULL,
    sector_id VARCHAR(50) NOT NULL,
    category_id VARCHAR(50) NOT NULL,
    language_id VARCHAR(10) NOT NULL,
    requirements TEXT NOT NULL,
    source_text TEXT,
    source_url VARCHAR(255),
    FOREIGN KEY (framework_id) REFERENCES frameworks(id) ON DELETE CASCADE,
    FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES criteria_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);

-- News items
CREATE TABLE news (
    id VARCHAR(50) PRIMARY KEY,
    image_url VARCHAR(255),
    link_url VARCHAR(255),
    publication_date DATE,
    display_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- News translations
CREATE TABLE news_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    news_id VARCHAR(50) NOT NULL,
    language_id VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
    UNIQUE KEY (news_id, language_id)
);

-- Resources
CREATE TABLE resources (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    link_url VARCHAR(255),
    display_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Resource translations
CREATE TABLE resource_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource_id VARCHAR(50) NOT NULL,
    language_id VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
    UNIQUE KEY (resource_id, language_id)
);

-- Users for admin backend
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('admin', 'editor', 'viewer') NOT NULL DEFAULT 'viewer',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Audit log for tracking changes
CREATE TABLE audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    changes TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS framework_comparisons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  framework_id VARCHAR(50) NOT NULL,
  language_id VARCHAR(10) NOT NULL,
  criteria_key VARCHAR(50) NOT NULL,
  criteria_value TEXT,
  FOREIGN KEY (framework_id) REFERENCES frameworks(id) ON DELETE CASCADE,
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
  UNIQUE KEY (framework_id, language_id, criteria_key)
);

-- Insert default languages
INSERT INTO languages (id, name, is_default) VALUES 
('en', 'English', TRUE),
('es', 'Español', FALSE),
('pt', 'Português', FALSE);

-- Insert sample frameworks
INSERT INTO frameworks (id, ranking, type, region) VALUES
('eu', 'High', 'Regulatory', 'Europe'),
('mdb', 'High', 'Voluntary', 'Global'),
('tcfd', 'High', 'Voluntary', 'Global'),
('cbi', 'High', 'Voluntary', 'Global'),
('asean', 'Low-Medium', 'Voluntary', 'Asia');

-- Insert sample sectors
INSERT INTO sectors (id, display_order) VALUES
('energy-storage', 1),
('energy-generation', 2),
('energy-transmission', 3),
('transport', 4),
('buildings', 5),
('water', 6);

-- Insert sample criteria categories
INSERT INTO criteria_categories (id) VALUES
('climate-risk-assessment'),
('technical-resilience'),
('technologies'),
('adaptation-metrics'),
('implementation');

-- Insert sample admin user (password: admin123)
INSERT INTO users (username, password_hash, name, email, role) VALUES
('admin', '$2b$10$MJLMFeujPhEWyB0mZlB6C.j5jNCEPiGmLiQdWwzeCgkihEGOPADfu', 'Admin User', 'admin@example.com', 'admin');
