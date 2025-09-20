# 🚀 AeroFresh Cloud Infrastructure Setup Guide

This guide will help you set up the complete cloud infrastructure for AeroFresh, including database, API, web hosting, mobile deployment, and automated ETL processes.

## 📋 Prerequisites

- GitHub repository with your AeroFresh code
- Cloudflare account
- Neon/Supabase account (for PostgreSQL with PostGIS)
- Expo account
- Domain name (optional, for custom domains)

## 🗄️ 1. Database Setup (Neon/Supabase)

### Option A: Neon (Recommended)

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project: `aerofresh-production`
3. Copy the connection string (starts with `postgresql://`)
4. Enable PostGIS extension:

   ```sql
   CREATE EXTENSION postgis;
   ```

### Option B: Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project: `aerofresh-production`
3. Go to Settings → Database → Connection string
4. Copy the connection string
5. Enable PostGIS extension:

   ```sql
   CREATE EXTENSION postgis;
   ```

### Database Configuration

- **Connection String**: Store as `DATABASE_URL` secret
- **Extensions**: PostGIS enabled for geospatial queries
- **Backup**: Automatic daily backups
- **Scaling**: Auto-scaling based on usage

## ☁️ 2. Cloudflare Worker (API)

### 2.1 Create Cloudflare Account

1. Sign up at [Cloudflare](https://cloudflare.com)
2. Go to Workers & Pages → Create a Worker
3. Name it `aerofresh-api`

### 2.2 Configure Wrangler

The `wrangler.toml` is already configured. Update these values:

- Replace `your-subdomain` with your actual subdomain
- Set your `CF_ACCOUNT_ID`

### 2.3 Set Secrets

```bash
cd apps/api

# Required secrets
wrangler secret put DATABASE_URL
wrangler secret put AVWX_TOKEN
wrangler secret put MAPBOX_TOKEN

# Optional secrets
wrangler secret put OPENSKY_USERNAME
wrangler secret put OPENSKY_PASSWORD
```

### 2.4 Deploy API

```bash
# Deploy to staging
wrangler deploy --env staging

# Deploy to production
wrangler deploy --env production
```

## 🌐 3. Web Hosting (Cloudflare Pages)

### 3.1 Connect GitHub Repository

1. Go to Cloudflare Dashboard → Pages
2. Connect to Git → GitHub
3. Select your AeroFresh repository
4. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `cd apps/web && pnpm build`
   - **Build output directory**: `apps/web/.next`
   - **Root directory**: `/`

### 3.2 Environment Variables

Set these in Cloudflare Pages dashboard:

- `NEXT_PUBLIC_API_BASE_URL`: `https://aerofresh-api.your-subdomain.workers.dev`
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Your Mapbox token
- `NEXT_PUBLIC_SENTRY_DSN`: Your Sentry DSN (optional)

### Alternative: Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Framework**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`

## 📱 4. Mobile App Deployment (Expo EAS)

### 4.1 Install EAS CLI

```bash
npm install -g @expo/eas-cli
```

### 4.2 Login to Expo

```bash
eas login
```

### 4.3 Configure EAS

The `eas.json` is already configured. Update:

- Replace `your-subdomain` with your actual subdomain
- Set your Apple Developer account details
- Set your Google Play Console details

### 4.4 Build and Submit

```bash
cd apps/mobile

# Build for development
eas build --profile development --platform ios

# Build for production
eas build --profile production --platform all

# Submit to app stores
eas submit --platform all

# Push OTA updates
eas update --branch production --message "Bug fixes and improvements"
```

## 🔄 5. ETL and Scheduled Jobs

### 5.1 Create ETL Worker

```bash
cd apps/api

# Deploy ETL scheduler
wrangler deploy --config wrangler-etl.toml --env staging
```

### 5.2 Configure Scheduled Jobs

The ETL scheduler is configured with these cron jobs:

- **FAA Registry**: Daily at 2 AM
- **NTSB Accidents**: Weekly on Sunday at 3 AM
- **AD Directives**: Every 6 hours
- **OurAirports**: Monthly on 1st at 1 AM
- **Weather METAR**: Every 15 minutes
- **Live ADS-B**: Every 5 minutes

### 5.3 Manual ETL Triggers

You can manually trigger ETL jobs:

```bash
# Trigger FAA Registry update
curl https://aerofresh-etl.your-subdomain.workers.dev/api/etl/faa-registry

# Check ETL status
curl https://aerofresh-etl.your-subdomain.workers.dev/api/etl/status
```

## 🔐 6. GitHub Secrets Configuration

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

### Required Secrets

```text
CF_API_TOKEN          # Cloudflare API token
CF_ACCOUNT_ID         # Your Cloudflare account ID
DATABASE_URL          # PostgreSQL connection string
EXPO_TOKEN            # Expo access token
```

### Optional Secrets

```text
AVWX_TOKEN            # Aviation weather API token
MAPBOX_TOKEN          # Mapbox API token
OPENSKY_USERNAME      # OpenSky Network username
OPENSKY_PASSWORD      # OpenSky Network password
SENTRY_DSN            # Sentry error tracking DSN
POSTHOG_KEY           # PostHog analytics key
STRIPE_SECRET_KEY     # Stripe payment processing key
```

## 🌍 7. Custom Domain Setup (Optional)

### 7.1 API Custom Domain

1. In Cloudflare Dashboard → Workers & Pages
2. Go to your Worker → Settings → Triggers
3. Add Custom Domain: `api.yourdomain.com`

### 7.2 Web Custom Domain

1. In Cloudflare Pages → Custom Domains
2. Add domain: `app.yourdomain.com`
3. Configure DNS records

### 7.3 Update CORS Headers

Update the CORS configuration in your Worker:

```typescript
const CORS = {
  'Access-Control-Allow-Origin': 'https://app.yourdomain.com',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

## 📊 8. Monitoring and Analytics

### 8.1 Error Tracking (Sentry)

1. Create account at [Sentry](https://sentry.io)
2. Create project for AeroFresh
3. Add DSN to GitHub secrets
4. Configure in your applications

### 8.2 Analytics (PostHog)

1. Create account at [PostHog](https://posthog.com)
2. Get project key
3. Add to GitHub secrets
4. Configure in your applications

### 8.3 Performance Monitoring

- **Cloudflare Analytics**: Built-in Worker analytics
- **Expo Analytics**: Built-in mobile app analytics
- **Database Monitoring**: Neon/Supabase dashboard

## 💰 9. Cost Estimation

### Monthly Costs (Estimated)

- **Cloudflare Workers**: $0-5 (free tier covers most usage)
- **Cloudflare Pages**: $0 (free tier)
- **Neon Database**: $0-19 (free tier → $19 for production)
- **Expo EAS**: $0-29 (free tier → paid for builds)
- **Domain**: $10-15/year
- **Third-party APIs**: $0-50 (depending on usage)

### Total Estimated Cost

- **Development**: $0-10/month
- **Production (low traffic)**: $20-50/month
- **Production (high traffic)**: $50-200/month

## 🚀 10. Deployment Checklist

### Before First Deployment

- [ ] Database created with PostGIS
- [ ] Cloudflare account setup
- [ ] GitHub secrets configured
- [ ] Expo account setup
- [ ] API keys obtained (AVWX, Mapbox, etc.)

### First Deployment

- [ ] Deploy database migrations
- [ ] Deploy API to Cloudflare Workers
- [ ] Deploy web app to Pages/Vercel
- [ ] Build and test mobile app
- [ ] Configure ETL scheduler
- [ ] Test all integrations

### Post-Deployment

- [ ] Monitor error rates
- [ ] Check ETL job status
- [ ] Verify mobile app updates
- [ ] Test custom domain (if configured)
- [ ] Set up monitoring alerts

## 🔧 11. Troubleshooting

### Common Issues

#### API Not Responding

```bash
# Check Worker logs
wrangler tail aerofresh-api

# Test health endpoint
curl https://aerofresh-api.your-subdomain.workers.dev/api/health
```

#### Database Connection Issues

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT version();"

# Check PostGIS extension
psql $DATABASE_URL -c "SELECT PostGIS_Version();"
```

#### Mobile App Build Failures

```bash
# Check EAS build logs
eas build:list

# Clear build cache
eas build --clear-cache
```

#### ETL Job Failures

```bash
# Check ETL status
curl https://aerofresh-etl.your-subdomain.workers.dev/api/etl/status

# Check Worker logs
wrangler tail aerofresh-etl
```

## 📞 12. Support and Resources

### Documentation

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Expo EAS](https://docs.expo.dev/eas/)
- [Neon Database](https://neon.tech/docs)
- [Supabase](https://supabase.com/docs)

### Community

- [Cloudflare Discord](https://discord.gg/cloudflaredev)
- [Expo Discord](https://chat.expo.dev)
- [GitHub Issues](https://github.com/your-username/aerofresh/issues)

---

## 🎉 You're Ready to Launch

Once you've completed this setup, your AeroFresh application will be running in production with:

- ✅ Scalable API on Cloudflare Workers
- ✅ Real-time database with PostGIS
- ✅ Automated ETL processes
- ✅ Mobile app distribution via Expo
- ✅ Web application hosting
- ✅ CI/CD automation
- ✅ Monitoring and analytics

**Next Steps:**

1. Follow this guide step by step
2. Test each component
3. Monitor your application
4. Scale as needed

Happy flying! ✈️
