# Climate Adaptation Frameworks Explorer - Installation Guide

This guide will walk you through the steps to get the Climate Adaptation Frameworks Explorer up and running on your system.

## Step 1: Set Up Development Environment

First, ensure you have the following installed on your system:
- Node.js (version 14 or later)
- MySQL (version 8 or later)
- Git

## Step 2: Clone the Repository

```bash
git clone https://github.com/yourusername/climate-frameworks-explorer.git
cd climate-frameworks-explorer
```

## Step 3: Install Dependencies

Install all required NPM packages:

```bash
npm install
```

This will install all dependencies defined in the `package.json` file.

## Step 4: Set Up Environment Variables

Create a `.env` file in the root directory of the project with the following content, modifying values as needed for your environment:

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

## Step 5: Create SVG Icon Files

Generate the required SVG icon files:

```bash
npm run create-svgs
```

## Step 6: Set Up the Database

Initialize the database with the schema and sample data:

```bash
npm run setup-db
```

This script will:
1. Create the database if it doesn't exist
2. Create all necessary tables
3. Populate the database with initial framework data

## Step 7: Start the Application

Start both the backend server and the frontend development server:

```bash
npm start
```

This will run:
- Backend API server on http://localhost:3001
- Frontend development server on http://localhost:3000

## Step 8: Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

You should now see the Climate Adaptation Frameworks Explorer interface.

## Step 9: Admin Access (Optional)

To access the admin interface:

1. Navigate to http://localhost:3000/admin
2. Log in with the default credentials:
   - Username: admin
   - Password: admin123

## Troubleshooting

If you encounter any issues:

### Database Connection Problems
- Make sure MySQL is running
- Verify your database credentials in the `.env` file
- Try running `npm run setup-db` again

### Frontend Not Loading
- Check console for any JavaScript errors
- Verify the REACT_APP_API_URL in your `.env` file
- Make sure the backend server is running

### API Not Responding
- Check if the server is running on the correct port
- Look for any error messages in the server console
- Verify the routes in src/server.js

### SVG Icons Not Displaying
- Ensure you've run `npm run create-svgs`
- Check if the files exist in the public/img directory

## Building for Production

To create a production build:

```bash
npm run build
```

This will create optimized files in the `build` directory that you can deploy to a production server.
