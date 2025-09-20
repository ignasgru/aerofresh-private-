#!/bin/bash

echo "🔍 AeroFresh Setup Validation Script"
echo "===================================="
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
    echo -e "${GREEN}[✅]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠️]${NC} $1"
}

print_error() {
    echo -e "${RED}[❌]${NC} $1"
}

# Check if tools are installed
check_tools() {
    print_status "Checking required tools..."
    
    if command -v gh &> /dev/null; then
        print_success "GitHub CLI (gh) is installed"
    else
        print_error "GitHub CLI (gh) is not installed"
        echo "  Install with: brew install gh"
    fi
    
    if command -v wrangler &> /dev/null; then
        print_success "Wrangler CLI is installed"
    else
        print_error "Wrangler CLI is not installed"
        echo "  Install with: npm install -g wrangler"
    fi
    
    if command -v pnpm &> /dev/null; then
        print_success "pnpm is installed"
    else
        print_error "pnpm is not installed"
        echo "  Install with: npm install -g pnpm"
    fi
}

# Check GitHub authentication
check_github_auth() {
    print_status "Checking GitHub authentication..."
    
    if gh auth status &> /dev/null; then
        print_success "GitHub CLI is authenticated"
        
        # Check if we're in a git repo
        if git rev-parse --git-dir > /dev/null 2>&1; then
            print_success "In a git repository"
            
            # Check if remote is set
            if git remote get-url origin &> /dev/null; then
                print_success "Git remote origin is configured"
            else
                print_warning "Git remote origin is not configured"
            fi
        else
            print_error "Not in a git repository"
        fi
    else
        print_error "GitHub CLI is not authenticated"
        echo "  Run: gh auth login"
    fi
}

# Check Cloudflare authentication
check_cloudflare_auth() {
    print_status "Checking Cloudflare authentication..."
    
    if npx wrangler whoami &> /dev/null; then
        print_success "Wrangler CLI is authenticated with Cloudflare"
    else
        print_warning "Wrangler CLI is not authenticated with Cloudflare"
        echo "  Run: npx wrangler login"
    fi
}

# Check GitHub secrets
check_github_secrets() {
    print_status "Checking GitHub secrets..."
    
    if gh auth status &> /dev/null; then
        echo ""
        echo "Configured secrets:"
        gh secret list
        
        echo ""
        print_status "Required secrets status:"
        
        # Check required secrets
        if gh secret get CF_API_TOKEN &> /dev/null; then
            print_success "CF_API_TOKEN is configured"
        else
            print_error "CF_API_TOKEN is missing"
        fi
        
        if gh secret get CF_ACCOUNT_ID &> /dev/null; then
            print_success "CF_ACCOUNT_ID is configured"
        else
            print_error "CF_ACCOUNT_ID is missing"
        fi
        
        if gh secret get DATABASE_URL &> /dev/null; then
            print_success "DATABASE_URL is configured"
        else
            print_error "DATABASE_URL is missing"
        fi
        
        if gh secret get NEXT_PUBLIC_API_BASE_URL &> /dev/null; then
            print_success "NEXT_PUBLIC_API_BASE_URL is configured"
        else
            print_error "NEXT_PUBLIC_API_BASE_URL is missing"
        fi
    else
        print_error "Cannot check secrets - GitHub CLI not authenticated"
    fi
}

# Check local development setup
check_local_setup() {
    print_status "Checking local development setup..."
    
    # Check if we're in the right directory
    if [ -f "package.json" ] && [ -d "apps" ]; then
        print_success "In AeroFresh project directory"
    else
        print_error "Not in AeroFresh project directory"
        return 1
    fi
    
    # Check if dependencies are installed
    if [ -d "node_modules" ]; then
        print_success "Node modules are installed"
    else
        print_warning "Node modules not found - run: pnpm install"
    fi
    
    # Check if API server is running
    if lsof -i :3001 &> /dev/null; then
        print_success "API server is running on port 3001"
    else
        print_warning "API server is not running"
        echo "  Start with: cd apps/api && npx wrangler dev --port 3001"
    fi
    
    # Check if Expo server is running
    if lsof -i :8086 &> /dev/null; then
        print_success "Expo server is running on port 8086"
    else
        print_warning "Expo server is not running"
        echo "  Start with: cd apps/mobile && npx expo start --port 8086"
    fi
}

# Check project structure
check_project_structure() {
    print_status "Checking project structure..."
    
    local files=(
        "apps/api/wrangler.toml"
        "apps/web/next.config.js"
        "apps/mobile/app.config.ts"
        "packages/db/prisma/schema.prisma"
        ".github/workflows/api-deploy.yml"
        ".github/workflows/web-deploy.yml"
        ".github/workflows/db-migrate.yml"
    )
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            print_success "$file exists"
        else
            print_error "$file is missing"
        fi
    done
}

# Main execution
main() {
    echo "This script validates your AeroFresh setup..."
    echo ""
    
    check_tools
    echo ""
    
    check_github_auth
    echo ""
    
    check_cloudflare_auth
    echo ""
    
    check_github_secrets
    echo ""
    
    check_local_setup
    echo ""
    
    check_project_structure
    echo ""
    
    print_status "Validation complete!"
    echo ""
    echo "Next steps:"
    echo "1. Fix any errors shown above"
    echo "2. Run: ./scripts/setup-cloud-deployment.sh"
    echo "3. Push to main: git push origin main"
    echo "4. Watch GitHub Actions deploy your app"
}

# Run main function
main
