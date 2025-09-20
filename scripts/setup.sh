#!/bin/bash

# AeroFresh Setup Script
echo "🚀 Setting up AeroFresh - Aircraft Information Platform"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

echo "✅ pnpm is installed"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
pnpm -C packages/db prisma generate

# Create environment files
echo "⚙️ Setting up environment files..."

# API environment
cat > apps/api/.env << EOF
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/aerofresh"

# API Configuration
API_KEY="demo-api-key"
NODE_ENV="development"

# Live Tracking APIs
OPENSKY_USERNAME=""
OPENSKY_PASSWORD=""
ADSB_EXCHANGE_API_KEY=""
FLIGHTAWARE_API_KEY=""

# Notification Services
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASSWORD=""
VAPID_PUBLIC_KEY=""
VAPID_PRIVATE_KEY=""
WEBHOOK_URL=""
EOF

# Web environment
cat > apps/web/.env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:8787"
EOF

# Mobile environment
cat > apps/mobile/.env << EOF
# API Configuration
EXPO_PUBLIC_API_URL="http://localhost:8787"
EOF

echo "✅ Environment files created"

# Create database setup script
cat > scripts/db-setup.sql << EOF
-- AeroFresh Database Setup
CREATE DATABASE aerofresh;

-- Create user (adjust as needed)
CREATE USER aerofresh_user WITH PASSWORD 'aerofresh_password';
GRANT ALL PRIVILEGES ON DATABASE aerofresh TO aerofresh_user;
EOF

echo "📊 Database setup script created at scripts/db-setup.sql"

# Create development scripts
cat > package.json << EOF
{
  "name": "aerofresh",
  "private": true,
  "packageManager": "pnpm@9",
  "scripts": {
    "dev:api": "wrangler dev --config apps/api/wrangler.toml",
    "dev:web": "pnpm -C apps/web dev",
    "dev:mobile": "pnpm -C apps/mobile start",
    "dev": "concurrently \"pnpm dev:api\" \"pnpm dev:web\"",
    "build": "turbo build",
    "lint": "eslint .",
    "typecheck": "tsc -b",
    "db:generate": "pnpm -C packages/db prisma generate",
    "db:push": "pnpm -C packages/db prisma db push",
    "db:seed": "pnpm -C packages/db prisma db seed",
    "etl:airports": "ts-node scripts/etl/airports.ts",
    "etl:faa": "ts-node scripts/etl/faaRegistry.ts",
    "etl:ntsb": "ts-node scripts/etl/ntsbAccidents.ts",
    "etl:all": "pnpm etl:airports && pnpm etl:faa && pnpm etl:ntsb"
  },
  "devDependencies": {
    "typescript": "^5.5.4",
    "eslint": "^9.9.0",
    "turbo": "^2.0.6",
    "concurrently": "^8.2.0",
    "ts-node": "^10.9.0"
  }
}
EOF

echo "✅ Development scripts configured"

# Create README with setup instructions
cat > SETUP.md << EOF
# AeroFresh Setup Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **pnpm** package manager
3. **PostgreSQL** database
4. **Cloudflare Workers** account (for API deployment)

## Quick Start

1. **Clone and setup:**
   \`\`\`bash
   git clone <repository>
   cd aerofresh
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   \`\`\`

2. **Setup Database:**
   \`\`\`bash
   # Create PostgreSQL database
   createdb aerofresh
   
   # Or use the provided SQL script
   psql -f scripts/db-setup.sql
   
   # Push database schema
   pnpm db:push
   \`\`\`

3. **Start Development:**
   \`\`\`bash
   # Start all services
   pnpm dev
   
   # Or start individually:
   pnpm dev:api    # API server on http://localhost:8787
   pnpm dev:web    # Web app on http://localhost:3000
   pnpm dev:mobile # Mobile app (requires Expo CLI)
   \`\`\`

4. **Load Sample Data:**
   \`\`\`bash
   # Run ETL scripts to load aircraft data
   pnpm etl:all
   \`\`\`

## Environment Variables

### API (.env)
- \`DATABASE_URL\`: PostgreSQL connection string
- \`API_KEY\`: API authentication key
- \`NODE_ENV\`: Environment (development/production)

### Web (.env.local)
- \`NEXT_PUBLIC_API_URL\`: API server URL

### Mobile (.env)
- \`EXPO_PUBLIC_API_URL\`: API server URL

## API Endpoints

- \`GET /api/health\` - Health check
- \`GET /api/aircraft/{tail}/summary\` - Aircraft summary
- \`GET /api/aircraft/{tail}/history\` - Aircraft history
- \`GET /api/aircraft/{tail}/live\` - Live tracking data
- \`GET /api/airport/{icao}/metar\` - Weather data
- \`GET /api/search\` - Aircraft search

## Authentication

API requests require authentication via:
- Header: \`x-api-key: demo-api-key\`
- Header: \`Authorization: Bearer demo-api-key\`

## Data Sources

- **FAA Registry**: Aircraft registration data
- **NTSB**: Accident and incident reports
- **OurAirports**: Airport information
- **METAR**: Weather data
- **ADS-B**: Live tracking data

## Deployment

### API (Cloudflare Workers)
\`\`\`bash
cd apps/api
wrangler deploy
\`\`\`

### Web (Vercel/Netlify)
\`\`\`bash
cd apps/web
pnpm build
# Deploy to your preferred platform
\`\`\`

### Mobile (Expo)
\`\`\`bash
cd apps/mobile
expo build:android
expo build:ios
\`\`\`

## Troubleshooting

1. **Database connection issues**: Check DATABASE_URL in .env
2. **API authentication**: Ensure API_KEY is set correctly
3. **ETL failures**: Check network connectivity and data source URLs
4. **Build errors**: Run \`pnpm install\` and \`pnpm db:generate\`

## Support

For issues and questions, please check the documentation or create an issue.
EOF

echo "✅ Setup guide created at SETUP.md"

echo ""
echo "🎉 AeroFresh setup complete!"
echo ""
echo "Next steps:"
echo "1. Setup PostgreSQL database"
echo "2. Run: pnpm db:push"
echo "3. Run: pnpm dev"
echo "4. Load data: pnpm etl:all"
echo ""
echo "📖 See SETUP.md for detailed instructions"
