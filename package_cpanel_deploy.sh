#!/bin/bash

# Configuration
DEPLOY_DIR="deploy_cpanel"
ZIP_NAME="mrp_frontend_cpanel_deploy.zip"

echo "🚀 Starting cPanel placement preparation..."

# 1. Build the project
npm run build

# 2. Create/Clean deployment directory
rm -rf $DEPLOY_DIR
rm -f $ZIP_NAME
mkdir -p $DEPLOY_DIR

echo "📦 Copying standalone files..."
# 3. Copy standalone build
# Note: .next/standalone contains the necessary node_modules and the app
cp -r .next/standalone/* $DEPLOY_DIR/

echo "📂 Copying static assets..."
# 4. Copy public and static assets
# Next.js standalone doesn't include these by default
mkdir -p $DEPLOY_DIR/mrp_frontend/.next/static
cp -r public $DEPLOY_DIR/
cp -r .next/static/* $DEPLOY_DIR/mrp_frontend/.next/static/

echo "🛠 Creating root-level server.js..."
# 5. Create a root-level server.js for cPanel Passenger
cat > $DEPLOY_DIR/server.js <<EOF
const path = require('path');

// Set environment to production
process.env.NODE_ENV = 'production';

// The standalone build generates a server.js in the app folder
// We require it here to act as the entry point for cPanel
require('./mrp_frontend/server.js');
EOF

echo "📝 Copying settings JSON files..."
# 6. Copy settings JSON files (important for dynamic content)
cp *-settings.json $DEPLOY_DIR/ 2>/dev/null || true
cp youtube-settings.json $DEPLOY_DIR/ 2>/dev/null || true

echo "📝 Adding environment variables..."
# 7. Copy .env.production to the deployment root as .env
if [ -f .env.production ]; then
    cp .env.production $DEPLOY_DIR/.env
fi

echo "🗜 Creating deployment zip..."
# 7. Zip the deployment directory
cd $DEPLOY_DIR
zip -r ../$ZIP_NAME .
cd ..

echo "✅ Deployment package created: $ZIP_NAME"
echo "👉 Follow the instructions in CPANEL_DEPLOYMENT.md to upload."
