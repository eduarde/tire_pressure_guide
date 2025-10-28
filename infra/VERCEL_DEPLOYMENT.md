# Vercel Deployment Guide

> 📁 **Note**: All deployment configuration files are in the `infra/` directory

## 🎯 Deployment Options

### Option 1: Deploy Frontend to Vercel, Backend to Railway (Recommended)

**Why?** FastAPI works better on platforms designed for long-running processes.

**Frontend (Vercel)**: Free, instant deployments, global CDN
**Backend (Railway)**: $5/month, better for FastAPI, persistent connections

#### Step 1: Deploy Backend to Railway

1. **Sign up**: https://railway.app
2. **Create new project** → "Deploy from GitHub"
3. **Select repository**: `tire_pressure_guide`
4. **Configure**:
   ```
   Root Directory: /
   Build Command: (leave empty)
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
5. **Add environment variables**:
   ```
   ENVIRONMENT=production
   ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app
   ```
6. **Deploy** - Railway will give you a URL like: `https://tire-pressure-guide-production.up.railway.app`

#### Step 2: Deploy Frontend to Vercel

1. **Sign up**: https://vercel.com
2. **Import project** → Select your GitHub repo
3. **Configure**:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-railway-backend-url.up.railway.app
   ```
5. **Deploy** - Done! You'll get a URL like: `https://tire-pressure-guide.vercel.app`

**Monthly Cost**: $5 (Railway backend) + $0 (Vercel frontend) = **$5/month**

---

### Option 2: Both on Vercel (Serverless Backend)

**Limitations**:
- ⚠️ 10-second timeout on Hobby plan
- ⚠️ Cold starts (slower first request)
- ⚠️ Limited WebSocket support
- ✅ Free tier available

#### Backend Setup

1. **Copy Vercel config to root**:
   ```bash
   cp infra/vercel/vercel.json .
   ```

2. **Update `app/main.py` for serverless** (or create `/api/index.py`):
   ```python
   from app.main import app
   
   # Vercel serverless handler
   handler = app
   ```

2. **Create `vercel.json` in root** (already provided in `infra/vercel/vercel.json`):
   ```bash
   cp infra/vercel/vercel.json .
   ```

3. **Deploy Backend**:
   ```bash
   cd tire_pressure_guide
   vercel --prod
   ```

#### Frontend Setup

1. **Copy frontend Vercel config**:
   ```bash
   cp infra/vercel/frontend.json frontend/vercel.json
   ```

2. **Update `.env.production`**:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```

3. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel --prod
   ```

**Monthly Cost**: $0 (Free tier)

---

### Option 3: Both on Render.com

**Simplest option** - handles both easily.

#### Backend Setup

1. **Sign up**: https://render.com
2. **New Web Service** → Connect GitHub
3. **Configure**:
   ```
   Name: tire-pressure-backend
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
4. **Environment Variables**:
   ```
   ENVIRONMENT=production
   ALLOWED_ORIGINS=https://tire-pressure-frontend.onrender.com
   ```

#### Frontend Setup

1. **New Static Site**
2. **Configure**:
   ```
   Name: tire-pressure-frontend
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/dist
   ```
3. **Environment Variables**:
   ```
   VITE_API_URL=https://tire-pressure-backend.onrender.com
   ```

**Monthly Cost**: $7 (Web Service) + $0 (Static) = **$7/month**

---

## 🏆 Recommendation by Use Case

| Use Case | Platform | Cost | Pros |
|----------|----------|------|------|
| **Personal Project** | Frontend: Vercel<br>Backend: Railway | $5/mo | Easy, reliable, fast |
| **Portfolio Demo** | Both on Render | $7/mo | Single platform, SSL included |
| **Learning** | Both on Vercel | Free | Learn serverless, no cost |
| **Production** | Frontend: Vercel<br>Backend: Railway/Render | $5-7/mo | Best performance |

---

## 📋 Detailed Steps: Vercel + Railway (Recommended)

### Part 1: Backend on Railway

```bash
# 1. Copy Railway config to root
cp infra/railway/railway.json .

# 2. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Link to your code
railway link

# 5. Set environment variables
railway variables set ENVIRONMENT=production
railway variables set ALLOWED_ORIGINS=https://your-app.vercel.app

# 6. Deploy
railway up
```

**Or use Railway Dashboard**:
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Python and FastAPI
5. Click "Deploy"

### Part 2: Frontend on Vercel

```bash
# 1. Copy frontend config
cp infra/vercel/frontend.json frontend/vercel.json

# 2. Navigate to frontend
npm install -g vercel

# 2. Navigate to frontend
cd frontend

# 3. Install Vercel CLI
npm install -g vercel

# 4. Login to Vercel
vercel login

# 4. Login to Vercel
vercel login

# 5. Deploy
vercel --prod

# Follow prompts:
# - Link to existing project? No
# - What's your project's name? tire-pressure-guide
# - In which directory is your code located? ./
# - Want to override settings? Yes
# - Build Command: npm run build
# - Output Directory: dist
# - Development Command: npm run dev
```

**Or use Vercel Dashboard**:
1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: Your Railway backend URL
5. Click "Deploy"

---

## 🔧 Environment Variables Setup

### Backend (Railway/Render/Vercel)
```bash
ENVIRONMENT=production
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-frontend-preview.vercel.app
PORT=8088  # Railway/Render set this automatically
```

### Frontend (Vercel)
```bash
VITE_API_URL=https://your-backend.railway.app
```

---

## 🚀 Automated Deployments

### GitHub Actions for Vercel

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Backend to Railway
        run: |
          npm install -g @railway/cli
          railway link ${{ secrets.RAILWAY_PROJECT_ID }}
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Frontend to Vercel
        run: |
          npm install -g vercel
          cd frontend
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📊 Platform Comparison

| Feature | Vercel + Railway | Render | Vercel Only | AWS ECS |
|---------|------------------|--------|-------------|---------|
| **Cost** | $5/mo | $7/mo | Free | $25/mo |
| **Setup Time** | 10 min | 15 min | 20 min | 60 min |
| **Auto Deploy** | ✅ Yes | ✅ Yes | ✅ Yes | Manual |
| **SSL** | ✅ Free | ✅ Free | ✅ Free | Extra $ |
| **CDN** | ✅ Yes | ✅ Yes | ✅ Yes | Extra $ |
| **Cold Starts** | ❌ No | ❌ No | ⚠️ Yes | ❌ No |
| **WebSockets** | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **Custom Domain** | ✅ Free | ✅ Free | ✅ Free | ✅ Free |
| **Logs** | ✅ Good | ✅ Good | ⚠️ Limited | ✅ Excellent |
| **Scaling** | ✅ Auto | ✅ Auto | ⚠️ Limited | ✅ Full |

---

## ✅ Quick Start: Vercel + Railway

**5-Minute Deployment:**

```bash
# 1. Backend on Railway (3 minutes)
npm install -g @railway/cli
railway login
railway init
railway up

# Note the URL: https://xxx.up.railway.app

# 2. Frontend on Vercel (2 minutes)
cd frontend
npm install -g vercel
vercel login
vercel --prod

# When prompted for VITE_API_URL, paste Railway URL
```

Done! Your app is live! 🎉

---

## 🆘 Troubleshooting

### CORS Issues
Make sure `ALLOWED_ORIGINS` includes your Vercel preview URLs:
```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-*.vercel.app
```

### Build Failures
Check build logs in the platform dashboard:
- **Vercel**: Settings → Functions → View Logs
- **Railway**: Deployments → Click deployment → View Logs
- **Render**: Dashboard → Select service → Logs

### 500 Errors
Check application logs for Python errors:
```bash
# Railway
railway logs

# Vercel
vercel logs

# Render
# View in dashboard
```

---

## 🎯 My Recommendation

**For your tire pressure app:**

1. **Deploy backend to Railway** ($5/month)
   - Better for FastAPI
   - No cold starts
   - Persistent connections
   - Easy to scale

2. **Deploy frontend to Vercel** (Free)
   - Best for React/Vite
   - Global CDN
   - Instant previews
   - Zero config

**Total cost: $5/month with excellent performance!**

Ready to deploy? Let me know which platform you prefer, and I can help with the specific configuration!
