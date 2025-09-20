# 🔐 GitHub Secrets Setup Guide

This guide explains how to set up the required GitHub secrets for AeroFresh CI/CD workflows.

## 📋 Required Secrets

### **CF_API_TOKEN** (Required)

- **Purpose**: Cloudflare API token for deploying Workers and Pages
- **How to get**:

  1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
  2. Click "Create Token"
  3. Use "Custom token" template
  4. Permissions: `Cloudflare Pages:Edit`, `Cloudflare Workers:Edit`
  5. Account Resources: Include your account
  6. Zone Resources: Include all zones
  7. Copy the token

### **CF_ACCOUNT_ID** (Required)

- **Purpose**: Your Cloudflare account identifier
- **How to get**:

  1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
  2. Right sidebar → "Account ID"
  3. Copy the ID

### **DATABASE_URL** (Required)

- **Purpose**: PostgreSQL connection string for database migrations
- **Format**: `postgresql://username:password@host:port/database?sslmode=require`
- **How to get**: From your Neon/Supabase dashboard → Connection string

### **EXPO_TOKEN** (Required for mobile)

- **Purpose**: Expo access token for EAS builds
- **How to get**:

  1. Run `npx expo login` locally
  2. Run `npx expo whoami` to get your username
  3. Go to [Expo Dashboard](https://expo.dev/accounts/[username]/settings/access-tokens)
  4. Create a new access token

## 🔧 Optional Secrets

### **NEXT_PUBLIC_API_BASE_URL**

- **Purpose**: API base URL for web app (defaults to workers.dev URL)
- **Example**: `https://api.yourdomain.com`

### **MAPBOX_TOKEN**

- **Purpose**: Mapbox API token for maps functionality
- **How to get**: [Mapbox Account](https://account.mapbox.com/access-tokens/)

### **SENTRY_DSN**

- **Purpose**: Sentry error tracking DSN
- **How to get**: [Sentry Project Settings](https://sentry.io/settings/projects/)

### **POSTHOG_KEY**

- **Purpose**: PostHog analytics project key
- **How to get**: [PostHog Project Settings](https://app.posthog.com/project/settings)

### **AVWX_TOKEN**

- **Purpose**: Aviation weather API token
- **How to get**: [AVWX API](https://avwx.rest/)

### **OPENSKY_USERNAME** & **OPENSKY_PASSWORD**

- **Purpose**: OpenSky Network credentials for live aircraft data
- **How to get**: [OpenSky Network](https://opensky-network.org/accounts/profile/)

## 🚀 How to Set Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name and value
5. Click **Add secret**

## ✅ Verification

After setting secrets, your workflows should run without validation warnings:

- **API Deployment**: `.github/workflows/api-deploy.yml`
- **Web Deployment**: `.github/workflows/web-deploy.yml`
- **Mobile Deployment**: `.github/workflows/mobile-deploy.yml`
- **Database Migration**: `.github/workflows/db-migrate.yml`

## 🔍 Troubleshooting

### "Context access might be invalid" warnings

- These warnings appear in the GitHub Actions editor
- They disappear once secrets are actually set in the repository
- The workflows will still run with fallback values for optional secrets

### Workflow failures

- Check that required secrets are set correctly
- Verify secret names match exactly (case-sensitive)
- Ensure API tokens have correct permissions

### Missing permissions

- **Cloudflare**: Ensure token has `Pages:Edit` and `Workers:Edit` permissions
- **Expo**: Ensure token is valid and not expired

## 📚 Related Documentation

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Cloudflare API Tokens](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)
- [Expo Access Tokens](https://docs.expo.dev/accounts/programmatic-access/)

---

**Note**: Never commit secrets to your repository. Always use GitHub's encrypted secrets feature.
