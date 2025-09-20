# 🚀 AeroFresh Cloud Deployment Checklist

This checklist will guide you through deploying AeroFresh to the cloud with full CI/CD automation.

## 📋 Prerequisites

Before starting, ensure you have:

- [ ] GitHub repository with your AeroFresh code
- [ ] Cloudflare account with Workers and Pages access
- [ ] Neon/Supabase PostgreSQL database with PostGIS
- [ ] Expo account (for mobile app deployment)
- [ ] Domain name (optional, for custom domains)

## 🔐 Step 1: Set Up GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** and add these secrets:

### Required Secrets

- [ ] **CF_API_TOKEN**: Cloudflare API token with Workers/Pages:Edit permissions
- [ ] **CF_ACCOUNT_ID**: Your Cloudflare account ID
- [ ] **DATABASE_URL**: PostgreSQL connection string with PostGIS
- [ ] **EXPO_TOKEN**: Expo access token (for mobile deployment)

### Optional Secrets

- [ ] **NEXT_PUBLIC_API_BASE_URL**: API base URL (defaults to workers.dev)
- [ ] **AVWX_TOKEN**: Aviation weather API token
- [ ] **MAPBOX_TOKEN**: Mapbox API token for maps
- [ ] **OPENSKY_USERNAME**: OpenSky Network username
- [ ] **OPENSKY_PASSWORD**: OpenSky Network password
- [ ] **SENTRY_DSN**: Sentry error tracking DSN
- [ ] **POSTHOG_KEY**: PostHog analytics key
- [ ] **FAA_API_KEY**: FAA API key
- [ ] **NTSB_API_KEY**: NTSB API key

> 📖 **Detailed Setup**: See `GITHUB_SECRETS_SETUP.md` for step-by-step instructions

## 🗄️ Step 2: Database Setup

### Create PostgreSQL Database

1. [ ] Create Neon/Supabase PostgreSQL instance
2. [ ] Enable PostGIS extension: `CREATE EXTENSION postgis;`
3. [ ] Copy connection string to `DATABASE_URL` secret
4. [ ] Test connection with Prisma: `pnpm -C packages/db prisma db push`

### Run Initial Migrations

```bash
# Test locally first
pnpm -C packages/db prisma migrate deploy
```

## ☁️ Step 3: Deploy API (Cloudflare Workers)

### First Deployment

1. [ ] Push changes to trigger API deployment workflow
2. [ ] Check GitHub Actions → "Deploy API (Cloudflare)" job
3. [ ] Verify deployment at: `https://aerofresh-api.your-subdomain.workers.dev/api/health`
4. [ ] Expected response: `{ "ok": true, "ts": 1234567890, ... }`

### Test API Endpoints

- [ ] Health check: `/api/health`
- [ ] Search: `/api/search?q=N123AB`
- [ ] Aircraft summary: `/api/aircraft/N123AB/summary`
- [ ] Live tracking: `/api/tracking/live?limit=10`

## 🌐 Step 4: Deploy Web Application

### Option A: Cloudflare Pages

1. [ ] Push changes to trigger web deployment workflow
2. [ ] Check GitHub Actions → "Deploy Web (Cloudflare Pages)" job
3. [ ] Verify deployment at: `https://aerofresh-web.pages.dev`
4. [ ] Test API integration on web app

### Option B: Vercel (Alternative)

1. [ ] Connect GitHub repo in Vercel dashboard
2. [ ] Set Root Directory: `apps/web`
3. [ ] Add environment variables in Vercel
4. [ ] Deploy and verify

## 📱 Step 5: Deploy Mobile Application

### EAS Build Setup

1. [ ] Install EAS CLI: `npm install -g @expo/eas-cli`
2. [ ] Login: `eas login`
3. [ ] Configure: Update `apps/mobile/eas.json` with your details

### Build and Deploy

```bash
cd apps/mobile

# Build for development
eas build --profile development --platform ios

# Build for production
eas build --profile production --platform all

# Submit to app stores (when ready)
eas submit --platform all
```

### Test Mobile App

- [ ] Install build on device/simulator
- [ ] Verify API connection (should show "Online" status)
- [ ] Test search functionality
- [ ] Test live tracking

## 🔄 Step 6: Deploy ETL System

### Deploy ETL Workers

1. [ ] Push changes to trigger ETL deployment workflow
2. [ ] Check GitHub Actions → "Deploy ETL (Cloudflare)" job
3. [ ] Verify both workers deployed:
   - ETL Loader (scheduled worker)
   - ETL Consumer (queue worker)

### Verify ETL Setup

1. [ ] Check Cloudflare Dashboard → Workers
2. [ ] Verify cron trigger is set (daily at 03:00 UTC)
3. [ ] Check Queues → `etl-jobs` queue exists
4. [ ] Monitor queue for job processing

## ✅ Step 7: Verification & Testing

### API Health Check

```bash
curl https://aerofresh-api.your-subdomain.workers.dev/api/health
```

Expected: `{ "ok": true, "database": "connected", ... }`

### Database Connectivity

1. [ ] Check Neon/Supabase dashboard
2. [ ] Verify tables created by Prisma
3. [ ] Test data insertion/retrieval

### Web Application

1. [ ] Open deployed web app
2. [ ] Test search functionality
3. [ ] Verify live tracking displays
4. [ ] Check responsive design

### Mobile Application

1. [ ] Install and launch mobile app
2. [ ] Verify "Online" status indicator
3. [ ] Test search with real API
4. [ ] Verify live data display

### ETL System

1. [ ] Check Cloudflare Workers logs
2. [ ] Verify cron jobs are running
3. [ ] Monitor queue processing
4. [ ] Check database for new data

## 🌍 Step 8: Custom Domain Setup (Optional)

### API Custom Domain

1. [ ] Add custom domain in Cloudflare Dashboard
2. [ ] Set DNS records: `api.yourdomain.com`
3. [ ] Update CORS headers in API worker
4. [ ] Update mobile/web configs with new domain

### Web Custom Domain

1. [ ] Add custom domain in Pages/Vercel
2. [ ] Set DNS records: `app.yourdomain.com`
3. [ ] Update environment variables
4. [ ] Test SSL certificate

## 🔧 Step 9: Monitoring & Maintenance

### Set Up Monitoring

1. [ ] Configure Sentry for error tracking
2. [ ] Set up PostHog for analytics
3. [ ] Monitor Cloudflare Workers metrics
4. [ ] Set up database monitoring

### Regular Maintenance

1. [ ] Monitor ETL job success rates
2. [ ] Check database performance
3. [ ] Review error logs
4. [ ] Update dependencies regularly

## 🚨 Troubleshooting

### Common Issues

#### API Not Responding

- Check Cloudflare Workers logs
- Verify secrets are set correctly
- Test health endpoint manually

#### Database Connection Issues

- Verify `DATABASE_URL` secret
- Check PostGIS extension is enabled
- Test connection with `psql`

#### Mobile App Shows "Offline"

- Verify API_BASE_URL is correct
- Check CORS headers in API
- Test API endpoint from mobile device

#### ETL Jobs Not Running

- Check cron trigger in Cloudflare
- Verify queue configuration
- Monitor worker logs

#### Web App Build Failures

- Check environment variables
- Verify Next.js build locally
- Check Pages/Vercel build logs

### Getting Help

- [ ] Check GitHub Actions logs
- [ ] Review Cloudflare Workers logs
- [ ] Consult `CLOUD_SETUP_GUIDE.md`
- [ ] Check `GITHUB_SECRETS_SETUP.md`

## 🎉 Success Criteria

Your deployment is successful when:

- [ ] ✅ API responds with `{ "ok": true }` at health endpoint
- [ ] ✅ Web app loads and shows real data
- [ ] ✅ Mobile app shows "Online" status
- [ ] ✅ Search returns real aircraft data
- [ ] ✅ Live tracking displays real positions
- [ ] ✅ ETL jobs run on schedule
- [ ] ✅ Database contains real aviation data
- [ ] ✅ All GitHub Actions workflows pass
- [ ] ✅ Custom domains work (if configured)
- [ ] ✅ Monitoring and analytics active

---

**🎯 Next Steps**: Once deployed, you can:

- Add more data sources to ETL
- Implement advanced analytics
- Add user authentication
- Set up payment processing
- Scale infrastructure as needed

**📚 Documentation**: All setup guides are in the repository root:

- `CLOUD_SETUP_GUIDE.md` - Detailed cloud setup
- `DEPLOYMENT_SUMMARY.md` - Architecture overview
- `GITHUB_SECRETS_SETUP.md` - Secrets configuration
