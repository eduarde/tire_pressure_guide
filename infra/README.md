# 🏗️ Infrastructure & Deployment

This directory contains deployment configurations for the Tire Pressure Guide application on Vercel.

## 📁 Directory Structure

```
infra/
├── README.md                   # This file
├── VERCEL_DEPLOYMENT.md       # Complete deployment guide
└── vercel/
    ├── vercel.json            # Backend serverless config
    └── frontend.json          # Frontend static site config
```

## 🚀 Vercel Deployment (FREE)
## 🚀 Vercel Deployment (FREE)

- **Backend**: Serverless functions with @vercel/python runtime
- **Frontend**: Static site with global CDN and SPA routing
- **Cost**: Free tier (Unlimited deployments, 100GB bandwidth)
- **Features**: Automatic SSL, preview deployments, edge network
- **Limitations**: 10s function timeout, cold starts on serverless

**Quick Start:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy Backend
cp infra/vercel/vercel.json .
vercel --prod

# Deploy Frontend
cd frontend
cp ../infra/vercel/frontend.json vercel.json
vercel --prod
```

## � Configuration Files

### Backend (`infra/vercel/vercel.json`)
- Serverless deployment with @vercel/python
- Routes for /compute, /docs, /redoc, /openapi.json
- Function timeout: 10s (Hobby tier), 60s (Pro tier)

### Frontend (`infra/vercel/frontend.json`)
- Static site deployment with Vite framework
- SPA routing with rewrites
- Automatic CDN distribution

## 🌍 Environment Variables

### Backend
Set these in Vercel dashboard or CLI:

```bash
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,https://your-frontend-*.vercel.app
```

### Frontend
Set these in Vercel dashboard or CLI:

```bash
VITE_API_URL=https://your-backend-domain.vercel.app
```

**Set via CLI:**
```bash
# Backend
vercel env add ALLOWED_ORIGINS production

# Frontend
cd frontend
vercel env add VITE_API_URL production
```

After setting environment variables, redeploy:
```bash
vercel --prod
```

## 📚 Documentation

For complete deployment instructions, troubleshooting, and advanced configuration:
- **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** - Comprehensive deployment guide

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Full Deployment Guide](./VERCEL_DEPLOYMENT.md)
