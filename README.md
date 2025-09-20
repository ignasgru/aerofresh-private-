# AeroFresh - Aircraft Information Platform

A comprehensive aircraft information platform similar to CarVertical but for aircraft. Get detailed aircraft history, safety records, ownership information, and real-time tracking data.

## 🚀 Features

### Core Functionality

- **Aircraft Search**: Search by tail number, make, model, or year
- **Detailed Reports**: Comprehensive aircraft history and safety information
- **Safety Records**: NTSB accident reports and incident history
- **Ownership History**: Complete ownership chain and registration details
- **Airworthiness Directives**: Open and closed AD tracking
- **Risk Assessment**: Automated risk scoring based on safety factors
- **Live Tracking**: Real-time aircraft position data (when available)

### Platform Support

- **Web Application**: Modern React/Next.js dashboard with advanced filtering
- **Mobile App**: React Native app with intuitive navigation
- **API**: RESTful API with authentication and comprehensive endpoints

### Data Sources

- **FAA Registry**: Aircraft registration and ownership data
- **NTSB**: Accident and incident reports
- **OurAirports**: Airport information and weather data
- **METAR**: Real-time weather conditions
- **ADS-B**: Live aircraft tracking (when available)

## 🏗️ Architecture

```text
aerofresh/
├── apps/
│   ├── api/           # Cloudflare Workers API
│   ├── web/           # Next.js web application
│   └── mobile/        # React Native mobile app
├── packages/
│   ├── core/          # Shared types and utilities
│   └── db/            # Prisma database client
└── scripts/
    └── etl/           # Data ingestion scripts
```

## 🛠️ Tech Stack

### Backend

- **Cloudflare Workers**: Serverless API runtime
- **Prisma**: Database ORM and migrations
- **PostgreSQL**: Primary database
- **TypeScript**: Type-safe development

### Frontend

- **Next.js**: React web framework
- **Tailwind CSS**: Utility-first styling
- **React Native**: Mobile app development
- **Recharts**: Data visualization

### DevOps

- **Turbo**: Monorepo build system
- **pnpm**: Fast package manager
- **Vitest**: Testing framework
- **ESLint**: Code linting

## 📦 Quick Start

### Prerequisites

- Node.js 18+
- pnpm package manager
- PostgreSQL database
- Cloudflare Workers account

### Installation

1. **Clone and setup:**

   ```bash
   git clone <repository>
   cd aerofresh
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

2. **Setup database:**

   ```bash
   createdb aerofresh
   pnpm db:push
   ```

3. **Start development:**

   ```bash
   pnpm dev
   ```

4. **Load sample data:**

   ```bash
   pnpm etl:all
   ```

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start all services
pnpm dev:api          # API server only
pnpm dev:web          # Web app only
pnpm dev:mobile       # Mobile app only

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:seed          # Seed database with sample data

# Data Loading
pnpm etl:airports     # Load airport data
pnpm etl:faa          # Load FAA registry
pnpm etl:ntsb         # Load NTSB accidents
pnpm etl:all          # Load all data sources

# Testing
pnpm test             # Run all tests
pnpm test:api         # API tests only
pnpm test:web         # Web tests only

# Building
pnpm build            # Build all packages
pnpm lint             # Lint all code
pnpm typecheck        # TypeScript type checking
```

### Environment Variables

Create `.env` files in each app directory:

**API** (`apps/api/.env`):

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/aerofresh"
API_KEY="your-api-key"
```

**Web** (`apps/web/.env.local`):

```env
NEXT_PUBLIC_API_URL="http://localhost:8787"
```

**Mobile** (`apps/mobile/.env`):

```env
EXPO_PUBLIC_API_URL="http://localhost:8787"
```

## 📊 API Documentation

### Authentication

All endpoints require authentication via API key:

```text
x-api-key: your-api-key
# or
Authorization: Bearer your-api-key
```

### Endpoints

#### Health Check

```text
GET /api/health
```

Returns API status and timestamp.

#### Aircraft Summary

```text
GET /api/aircraft/{tail}/summary
```

Returns aircraft summary with risk score and key metrics.

#### Aircraft History

```text
GET /api/aircraft/{tail}/history
```

Returns detailed history including owners, accidents, and AD directives.

#### Live Tracking

```text
GET /api/aircraft/{tail}/live
```

Returns real-time aircraft position data.

#### Airport Weather

```text
GET /api/airport/{icao}/metar
```

Returns METAR weather data for airport.

#### Search

```text
GET /api/search?make=Cessna&model=172&year=2020&hasAccidents=false
```

Search aircraft with filters.

## 🚀 Deployment

### API (Cloudflare Workers)

```bash
cd apps/api
wrangler deploy
```

### Web (Vercel)

```bash
cd apps/web
vercel deploy
```

### Mobile (Expo)

```bash
cd apps/mobile
expo build:android
expo build:ios
```

## 📱 Mobile App

The mobile app provides:

- Aircraft search with autocomplete
- Detailed aircraft reports
- Risk assessment visualization
- History browsing
- Offline capability for viewed reports

## 🔒 Security

- API key authentication
- Input validation and sanitization
- SQL injection prevention via Prisma
- CORS configuration
- Rate limiting (when deployed)

## 🧪 Testing

```bash
# Run all tests
pnpm test

# API tests
pnpm -C apps/api test

# Web tests
pnpm -C apps/web test

# Coverage report
pnpm test:coverage
```

## 📈 Performance

- **API**: < 100ms response times via Cloudflare Workers
- **Web**: Static generation with ISR for dynamic content
- **Mobile**: Optimized bundle size with code splitting
- **Database**: Indexed queries and connection pooling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: See `SETUP.md` for detailed setup instructions
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🗺️ Roadmap

- [x] Real-time notifications for AD directives
- [x] Advanced analytics dashboard
- [x] Aircraft comparison tool
- [x] Export to PDF/Excel
- [x] API rate limiting and caching
- [x] Multi-language support
- [x] Advanced search filters
- [ ] Integration with more data sources

---

Built with ❤️ for the aviation community
