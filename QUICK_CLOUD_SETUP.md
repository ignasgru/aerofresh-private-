# 🚀 Quick Cloud Setup Guide

## 📋 **Step-by-Step Account Creation**

### **1. Cloudflare Account Setup** (5 minutes)

#### **Create Account:**

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign up for free account
3. Verify email

#### **Get Account ID:**

1. Dashboard → Overview (top-right shows Account ID)
2. Copy the Account ID (looks like: `abc123def456ghi789`)

#### **Create API Token:**

1. Dashboard → My Profile → API Tokens
2. Click "Create Token"
3. Use template: **"Edit Cloudflare Workers"**
4. Add permissions:

   - `Cloudflare Workers:Edit`
   - `Cloudflare Pages:Edit` (if using Pages)

5. Scope to your account
6. Copy the token (starts with `abc123...`)

### **2. Database Setup** (Choose one - 5 minutes)

#### **Option A: Neon (Recommended)**

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create new project → "AeroFresh"
4. Go to **Connection Details**
5. Copy **Connection string** (looks like: `postgresql://user:pass@host/dbname`)
6. Go to **SQL Editor** → Run: `CREATE EXTENSION postgis;`

#### **Option B: Supabase**

1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Create new project → "AeroFresh"
4. Go to **Settings** → **Database**
5. Copy **Connection string**
6. Go to **SQL Editor** → Run: `CREATE EXTENSION postgis;`

### **3. Expo Account Setup** (3 minutes)

#### **Create Expo Account:**

1. Go to [expo.dev](https://expo.dev)
2. Sign up with GitHub
3. Verify email

#### **Get Token:**

```bash
# In your terminal
npx expo login
npx expo token
# Copy the token
```

### **4. Optional Services** (Add later)

#### **AVWX (Weather Data):**

- Go to [avwx.rest](https://avwx.rest)
- Sign up → Dashboard → API Key

#### **OpenSky (Aircraft Data):**

- Go to [opensky-network.org](https://opensky-network.org)
- Register → Username/Password

#### **Mapbox (Maps):**

- Go to [account.mapbox.com](https://account.mapbox.com)
- Access tokens → Create token

#### **Stripe (Payments):**

- Go to [dashboard.stripe.com](https://dashboard.stripe.com)
- Developers → API keys → Secret key

---

## 🔐 **Secret Configuration**

### **Required Secrets:**

```bash
CF_API_TOKEN=your_cloudflare_token_here
CF_ACCOUNT_ID=your_account_id_here
DATABASE_URL=postgresql://user:pass@host/dbname
NEXT_PUBLIC_API_BASE_URL=https://your-worker.workers.dev
```

### **Optional Secrets:**

```bash
AVWX_TOKEN=your_avwx_token
MAPBOX_TOKEN=your_mapbox_token
OPENSKY_USERNAME=your_username
OPENSKY_PASSWORD=your_password
STRIPE_SECRET_KEY=your_stripe_key
SENTRY_DSN=your_sentry_dsn
POSTHOG_KEY=your_posthog_key
```

---

## 🚀 **Automated Setup**

### **Option 1: Use the Setup Script**

```bash
# Make script executable
chmod +x scripts/setup-cloud-deployment.sh

# Run the interactive setup
./scripts/setup-cloud-deployment.sh
```

### **Option 2: Manual Setup**

```bash
# Set GitHub secrets manually
gh secret set CF_API_TOKEN -b"your_token_here"
gh secret set CF_ACCOUNT_ID -b"your_account_id_here"
gh secret set DATABASE_URL -b"postgresql://..."
gh secret set NEXT_PUBLIC_API_BASE_URL -b"https://your-worker.workers.dev"

# Set Cloudflare Worker secrets
npx wrangler secret put DATABASE_URL --config apps/api/wrangler.toml
npx wrangler secret put AVWX_TOKEN --config apps/api/wrangler.toml
```

---

## ✅ **Verification Steps**

### **1. Test GitHub Secrets:**

```bash
gh secret list
```

### **2. Test Cloudflare Authentication:**

```bash
npx wrangler whoami
```

### **3. Deploy and Test:**

```bash
# Push to trigger deployment
git push origin main

# Check API health
curl https://your-worker.workers.dev/api/health
```

### **4. Expected Response:**

```json
{
  "ok": true,
  "ts": 1234567890,
  "message": "AeroFresh API is running with real data!",
  "version": "2.0.0",
  "database": "connected",
  "environment": "production"
}
```

---

## 🎯 **Fast Path Checklist**

- [ ] **Cloudflare**: Account created, API token generated, Account ID copied
- [ ] **Database**: Neon/Supabase project created, PostGIS enabled, connection string copied
- [ ] **GitHub**: Repository exists, secrets configured
- [ ] **Expo**: Account created, token generated (optional for now)
- [ ] **Deploy**: Push to main, watch Actions deploy
- [ ] **Test**: API health endpoint returns `{ ok: true }`

---

## 🆘 **Troubleshooting**

### **Common Issues:**

#### **"GitHub CLI not authenticated"**

```bash
gh auth login
```

#### **"Wrangler not authenticated"**

```bash
npx wrangler login
```

#### **"Database connection failed"**

- Check DATABASE_URL format
- Ensure PostGIS extension is enabled
- Test connection: `psql "your_database_url"`

#### **"API deployment failed"**

- Check CF_API_TOKEN permissions
- Verify CF_ACCOUNT_ID is correct
- Check GitHub Actions logs

#### **"Mobile app can't connect"**

- Update `apps/mobile/app.config.ts` with new API URL
- Ensure API has proper CORS headers
- Test API from mobile device browser

---

## 📚 **Next Steps After Setup**

1. **Custom Domain**: Point your domain to Cloudflare Workers
2. **SSL Certificate**: Automatically handled by Cloudflare
3. **Monitoring**: Add Sentry/PostHog for error tracking
4. **Analytics**: Set up PostHog for user analytics
5. **Payments**: Integrate Stripe for premium features
6. **Maps**: Add Mapbox for interactive maps
7. **Real Data**: Connect AVWX/OpenSky for live aircraft data

---

**🎉 Once setup is complete, your AeroFresh platform will be running in the cloud with automatic deployments!**
