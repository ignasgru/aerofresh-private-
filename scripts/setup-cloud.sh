#!/bin/bash

# AeroFresh Cloud Setup Script
# This script helps you set up the cloud infrastructure for AeroFresh

set -e

echo "🚀 AeroFresh Cloud Infrastructure Setup"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required tools are installed
check_dependencies() {
    print_info "Checking dependencies..."
    
    local missing_deps=()
    
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi
    
    if ! command -v pnpm &> /dev/null; then
        missing_deps+=("pnpm")
    fi
    
    if ! command -v git &> /dev/null; then
        missing_deps+=("git")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        print_info "Please install the missing dependencies and run this script again."
        exit 1
    fi
    
    print_status "All dependencies are installed"
}

# Setup Cloudflare
setup_cloudflare() {
    print_info "Setting up Cloudflare..."
    
    if ! command -v wrangler &> /dev/null; then
        print_info "Installing Wrangler CLI..."
        npm install -g wrangler
    fi
    
    print_info "Please login to Cloudflare:"
    wrangler login
    
    print_info "Getting your Account ID..."
    local account_id=$(wrangler whoami | grep "Account ID" | cut -d' ' -f3)
    print_status "Account ID: $account_id"
    
    echo ""
    print_warning "Please save your Account ID: $account_id"
    print_warning "You'll need this for GitHub secrets and deployment"
}

# Setup Expo
setup_expo() {
    print_info "Setting up Expo..."
    
    if ! command -v eas &> /dev/null; then
        print_info "Installing EAS CLI..."
        npm install -g @expo/eas-cli
    fi
    
    print_info "Please login to Expo:"
    eas login
    
    print_info "Initializing EAS project..."
    cd apps/mobile
    eas init --non-interactive || true
    cd ../..
    
    print_status "Expo setup complete"
}

# Setup database
setup_database() {
    print_info "Database setup instructions..."
    echo ""
    print_warning "Please create a Neon or Supabase database:"
    print_warning "1. Go to https://console.neon.tech/ or https://supabase.com/dashboard"
    print_warning "2. Create a new project"
    print_warning "3. Enable PostGIS extension: CREATE EXTENSION postgis;"
    print_warning "4. Copy the connection string"
    echo ""
    read -p "Enter your DATABASE_URL (postgresql://...): " database_url
    
    if [ -z "$database_url" ]; then
        print_error "DATABASE_URL is required"
        exit 1
    fi
    
    print_status "DATABASE_URL configured"
    echo "DATABASE_URL=$database_url" > .env.cloud
}

# Setup GitHub secrets
setup_github_secrets() {
    print_info "GitHub Secrets setup instructions..."
    echo ""
    print_warning "Please add these secrets to your GitHub repository:"
    print_warning "Go to: Settings → Secrets and variables → Actions"
    echo ""
    print_warning "Required secrets:"
    print_warning "- CF_API_TOKEN (Cloudflare API token)"
    print_warning "- CF_ACCOUNT_ID (Your Cloudflare account ID)"
    print_warning "- DATABASE_URL (PostgreSQL connection string)"
    print_warning "- EXPO_TOKEN (Expo access token)"
    echo ""
    print_warning "Optional secrets:"
    print_warning "- AVWX_TOKEN (Aviation weather API token)"
    print_warning "- MAPBOX_TOKEN (Mapbox API token)"
    print_warning "- OPENSKY_USERNAME (OpenSky Network username)"
    print_warning "- OPENSKY_PASSWORD (OpenSky Network password)"
    echo ""
    read -p "Press Enter when you've added the secrets to GitHub..."
}

# Deploy API
deploy_api() {
    print_info "Deploying API to Cloudflare Workers..."
    
    cd apps/api
    
    # Set secrets
    print_info "Setting up secrets..."
    wrangler secret put DATABASE_URL < ../.env.cloud || true
    
    # Deploy to staging
    print_info "Deploying to staging..."
    wrangler deploy --env staging
    
    cd ../..
    print_status "API deployed to staging"
}

# Deploy web
deploy_web() {
    print_info "Web deployment instructions..."
    echo ""
    print_warning "Please deploy your web app:"
    print_warning "Option 1 - Cloudflare Pages:"
    print_warning "1. Go to Cloudflare Dashboard → Pages"
    print_warning "2. Connect to Git → Select your repository"
    print_warning "3. Build settings: Framework preset = Next.js"
    print_warning "4. Build command: cd apps/web && pnpm build"
    print_warning "5. Build output directory: apps/web/.next"
    echo ""
    print_warning "Option 2 - Vercel:"
    print_warning "1. Go to https://vercel.com"
    print_warning "2. Import your GitHub repository"
    print_warning "3. Framework: Next.js, Root Directory: apps/web"
    echo ""
    read -p "Press Enter when you've deployed the web app..."
}

# Build mobile app
build_mobile() {
    print_info "Building mobile app..."
    
    cd apps/mobile
    
    print_info "Building development version..."
    eas build --profile development --platform ios --non-interactive || true
    
    cd ../..
    print_status "Mobile app build initiated"
}

# Run ETL
setup_etl() {
    print_info "Setting up ETL scheduler..."
    
    cd apps/api
    
    # Deploy ETL worker
    print_info "Deploying ETL scheduler..."
    wrangler deploy --config wrangler-etl.toml --env staging
    
    cd ../..
    print_status "ETL scheduler deployed"
}

# Main setup function
main() {
    echo "Starting AeroFresh cloud setup..."
    echo ""
    
    check_dependencies
    echo ""
    
    setup_cloudflare
    echo ""
    
    setup_expo
    echo ""
    
    setup_database
    echo ""
    
    setup_github_secrets
    echo ""
    
    deploy_api
    echo ""
    
    deploy_web
    echo ""
    
    build_mobile
    echo ""
    
    setup_etl
    echo ""
    
    print_status "🎉 AeroFresh cloud setup complete!"
    echo ""
    print_info "Next steps:"
    print_info "1. Test your API: https://aerofresh-api.your-subdomain.workers.dev/api/health"
    print_info "2. Check your web app deployment"
    print_info "3. Test your mobile app build"
    print_info "4. Monitor ETL jobs: https://aerofresh-etl.your-subdomain.workers.dev/api/etl/status"
    print_info "5. Set up monitoring and analytics"
    echo ""
    print_warning "Remember to:"
    print_warning "- Update your domain URLs in the configuration files"
    print_warning "- Configure custom domains if needed"
    print_warning "- Set up monitoring alerts"
    print_warning "- Test all integrations"
    echo ""
    print_status "Happy flying! ✈️"
}

# Run main function
main "$@"
