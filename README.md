# Climate Adaptation Frameworks Explorer

A tool to analyze and compare climate adaptation investment taxonomies.

## Features

- Explore multiple climate adaptation frameworks
- Compare frameworks across different criteria
- Filter frameworks by region, type, and ranking
- Multilingual support (English, Spanish, Portuguese)
- Detailed information on adaptation definitions, regulatory status, and technical requirements
- Sectoral criteria for energy storage, transport, buildings, water, and more

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- MySQL (v8 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/climate-frameworks-explorer.git
   cd climate-frameworks-explorer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create SVG icon files:
   ```
   npm run create-svgs
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory with the following content:
   ```
   # Database configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=climate_frameworks

   # Server configuration
   PORT=3001
   REACT_APP_API_URL=http://localhost:3001/api

   # JWT for authentication
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   ```

5. Initialize the database:
   ```
   npm run setup-db
   ```

### Running the Application

Start the application with both backend and frontend:
```
npm start
```

This will start:
- Backend API server on http://localhost:3001
- Frontend development server on http://localhost:3000

## Project Structure

- `/public`: Static assets
- `/src/components`: React components
- `/src/database`: Database schema and scripts
- `/src/scripts`: Utility scripts
- `/src/server.js`: Express backend API

## Administration

The application includes an admin interface with authentication. Default credentials:

- Username: admin
- Password: admin123

## License

This project is licensed under the MIT License - see the LICENSE file for details.
