#!/bin/bash

echo "🚀 AeroFresh Cloud Deployment Setup Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v gh &> /dev/null; then
        print_error "GitHub CLI (gh) is not installed. Please install it first:"
        echo "  brew install gh"
        echo "  # or visit: https://cli.github.com/"
        exit 1
    fi
    
    if ! command -v wrangler &> /dev/null; then
        print_error "Wrangler CLI is not installed. Installing now..."
        npm install -g wrangler
    fi
    
    print_success "All dependencies are installed"
}

# Function to create secrets interactively
setup_github_secrets() {
    print_status "Setting up GitHub Secrets..."
    echo ""
    
    # Required secrets
    echo "🔐 Setting up REQUIRED secrets:"
    echo ""
    
    read -p "Enter your Cloudflare API Token (CF_API_TOKEN): " cf_token
    if [ -z "$cf_token" ]; then
        print_error "CF_API_TOKEN is required!"
        exit 1
    fi
    
    read -p "Enter your Cloudflare Account ID (CF_ACCOUNT_ID): " cf_account_id
    if [ -z "$cf_account_id" ]; then
        print_error "CF_ACCOUNT_ID is required!"
        exit 1
    fi
    
    read -p "Enter your Database URL (DATABASE_URL): " database_url
    if [ -z "$database_url" ]; then
        print_error "DATABASE_URL is required!"
        exit 1
    fi
    
    read -p "Enter your API Base URL (NEXT_PUBLIC_API_BASE_URL): " api_base_url
    if [ -z "$api_base_url" ]; then
        print_error "NEXT_PUBLIC_API_BASE_URL is required!"
        exit 1
    fi
    
    # Set required secrets
    gh secret set CF_API_TOKEN -b"$cf_token"
    gh secret set CF_ACCOUNT_ID -b"$cf_account_id"
    gh secret set DATABASE_URL -b"$database_url"
    gh secret set NEXT_PUBLIC_API_BASE_URL -b"$api_base_url"
    
    print_success "Required GitHub secrets configured"
    
    # Optional secrets
    echo ""
    echo "🔧 Setting up OPTIONAL secrets (press Enter to skip):"
    echo ""
    
    read -p "Enter AVWX Token (AVWX_TOKEN) [optional]: " avwx_token
    if [ ! -z "$avwx_token" ]; then
        gh secret set AVWX_TOKEN -b"$avwx_token"
        print_success "AVWX_TOKEN configured"
    fi
    
    read -p "Enter Mapbox Token (MAPBOX_TOKEN) [optional]: " mapbox_token
    if [ ! -z "$mapbox_token" ]; then
        gh secret set MAPBOX_TOKEN -b"$mapbox_token"
        print_success "MAPBOX_TOKEN configured"
    fi
    
    read -p "Enter OpenSky Username (OPENSKY_USERNAME) [optional]: " opensky_username
    if [ ! -z "$opensky_username" ]; then
        gh secret set OPENSKY_USERNAME -b"$opensky_username"
        print_success "OPENSKY_USERNAME configured"
    fi
    
    read -p "Enter OpenSky Password (OPENSKY_PASSWORD) [optional]: " opensky_password
    if [ ! -z "$opensky_password" ]; then
        gh secret set OPENSKY_PASSWORD -b"$opensky_password"
        print_success "OPENSKY_PASSWORD configured"
    fi
    
    read -p "Enter Stripe Secret Key (STRIPE_SECRET_KEY) [optional]: " stripe_key
    if [ ! -z "$stripe_key" ]; then
        gh secret set STRIPE_SECRET_KEY -b"$stripe_key"
        print_success "STRIPE_SECRET_KEY configured"
    fi
    
    read -p "Enter Sentry DSN (SENTRY_DSN) [optional]: " sentry_dsn
    if [ ! -z "$sentry_dsn" ]; then
        gh secret set SENTRY_DSN -b"$sentry_dsn"
        print_success "SENTRY_DSN configured"
    fi
    
    read -p "Enter PostHog Key (POSTHOG_KEY) [optional]: " posthog_key
    if [ ! -z "$posthog_key" ]; then
        gh secret set POSTHOG_KEY -b"$posthog_key"
        print_success "POSTHOG_KEY configured"
    fi
}

# Function to setup Cloudflare Worker secrets
setup_cloudflare_secrets() {
    print_status "Setting up Cloudflare Worker secrets..."
    echo ""
    
    read -p "Do you want to set up Cloudflare Worker secrets now? (y/n): " setup_worker_secrets
    
    if [[ $setup_worker_secrets == "y" || $setup_worker_secrets == "Y" ]]; then
        echo "Setting up API worker secrets..."
        
        # Get DATABASE_URL from GitHub secrets
        database_url=$(gh secret get DATABASE_URL)
        if [ ! -z "$database_url" ]; then
            echo "$database_url" | npx wrangler secret put DATABASE_URL --config apps/api/wrangler.toml
            print_success "DATABASE_URL set for API worker"
        fi
        
        # Optional secrets
        avwx_token=$(gh secret get AVWX_TOKEN 2>/dev/null)
        if [ ! -z "$avwx_token" ]; then
            echo "$avwx_token" | npx wrangler secret put AVWX_TOKEN --config apps/api/wrangler.toml
            print_success "AVWX_TOKEN set for API worker"
        fi
        
        mapbox_token=$(gh secret get MAPBOX_TOKEN 2>/dev/null)
        if [ ! -z "$mapbox_token" ]; then
            echo "$mapbox_token" | npx wrangler secret put MAPBOX_TOKEN --config apps/api/wrangler.toml
            print_success "MAPBOX_TOKEN set for API worker"
        fi
        
        opensky_username=$(gh secret get OPENSKY_USERNAME 2>/dev/null)
        if [ ! -z "$opensky_username" ]; then
            echo "$opensky_username" | npx wrangler secret put OPENSKY_USERNAME --config apps/api/wrangler.toml
            print_success "OPENSKY_USERNAME set for API worker"
        fi
        
        opensky_password=$(gh secret get OPENSKY_PASSWORD 2>/dev/null)
        if [ ! -z "$opensky_password" ]; then
            echo "$opensky_password" | npx wrangler secret put OPENSKY_PASSWORD --config apps/api/wrangler.toml
            print_success "OPENSKY_PASSWORD set for API worker"
        fi
        
        print_success "Cloudflare Worker secrets configured"
    fi
}

# Function to test the setup
test_setup() {
    print_status "Testing your setup..."
    echo ""
    
    # Test GitHub authentication
    if gh auth status &> /dev/null; then
        print_success "GitHub CLI is authenticated"
    else
        print_error "GitHub CLI is not authenticated. Please run: gh auth login"
        exit 1
    fi
    
    # Test Cloudflare authentication
    if npx wrangler whoami &> /dev/null; then
        print_success "Wrangler CLI is authenticated with Cloudflare"
    else
        print_warning "Wrangler CLI is not authenticated. Please run: npx wrangler login"
        echo "  This is required for deploying workers and setting secrets."
    fi
    
    # List configured secrets
    print_status "Configured GitHub secrets:"
    gh secret list
    
    print_success "Setup test completed"
}

# Main execution
main() {
    echo "This script will help you set up cloud deployment for AeroFresh."
    echo "Make sure you have created the required accounts:"
    echo "  - Cloudflare (for API hosting)"
    echo "  - Neon/Supabase (for database)"
    echo "  - GitHub (for repository and CI/CD)"
    echo ""
    
    read -p "Continue with setup? (y/n): " continue_setup
    if [[ $continue_setup != "y" && $continue_setup != "Y" ]]; then
        print_status "Setup cancelled"
        exit 0
    fi
    
    check_dependencies
    setup_github_secrets
    setup_cloudflare_secrets
    test_setup
    
    echo ""
    print_success "🎉 Cloud deployment setup completed!"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to main branch: git push origin main"
    echo "2. Watch GitHub Actions deploy your API and run migrations"
    echo "3. Check your API health: https://your-worker.workers.dev/api/health"
    echo "4. Update your mobile app config with the new API URL"
    echo ""
    echo "For detailed instructions, see: CLOUD_SETUP_GUIDE.md"
}

# Run main function
main
