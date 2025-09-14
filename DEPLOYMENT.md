# COM-PSU-Rizal Deployment Guide

## 🚀 Railway Supabase Deployment

This guide will help you deploy Supabase to Railway and load the remote authentication credentials.

### Prerequisites

1. **Railway CLI** - Install it first:

   ```bash
   npm install -g @railway/cli
   # or
   curl -fsSL https://railway.app/install.sh | sh
   ```

2. **Railway Token** - Set your token:
   ```bash
   export RAILWAY_TOKEN=0c275f51-45b5-4ee1-b78a-5e3fa62e624f
   ```

### Step 1: Deploy to Railway

Run the automated deployment script:

```bash
npm run railway:deploy
```

This will:

- ✅ Login to Railway
- ✅ Link to your project (81e74dcc-dce7-4d33-8e8b-487e100216ee)
- ✅ Set up environment variables
- ✅ Deploy Supabase services
- ✅ Provide service URLs

### Step 2: Update Environment Variables

After deployment, Railway will provide service URLs. Update your `.env.local`:

```bash
# Replace with your actual Railway URLs
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.railway.app
SUPABASE_URL=https://your-project-url.railway.app
SUPABASE_SERVICE_ROLE_KEY=your-service-key-from-railway
```

### Step 3: Load Remote Users

Load the authentication credentials from the remote:

```bash
npm run supabase:load-users
```

This will create:

- **Admin**: admin@com-psu-rizal.com / admin123
- **Student 1**: user1@com-psu-rizal.com / user123
- **Student 2**: user2@com-psu-rizal.com / user456

### Step 4: Verify Deployment

1. **Check Railway Dashboard**: https://railway.app/dashboard
2. **Test Connection**: Visit http://localhost:3000/test-connection
3. **Access Supabase Studio**: Use the URL provided by Railway

## 🐳 Local Docker Development

For local development with full Supabase stack:

### Start Services

```bash
docker-compose up -d
```

### Access Services

- **Supabase Studio**: http://localhost:54323
- **API**: http://localhost:3001
- **Auth**: http://localhost:9999
- **Realtime**: http://localhost:4000
- **Storage**: http://localhost:8000

### Load Test Data

```bash
npm run supabase:load-users
```

## 🔧 Environment Variables Reference

### Railway Environment Variables

```bash
# GoTrue Auth
GOTRUE_SITE_URL=http://localhost:3000

# JWT Configuration
AUTH_JWT_SECRET=your-generated-jwt-secret
SUPABASE_ANON_KEY=your-generated-anon-key
SUPABASE_SERVICE_KEY=your-generated-service-key

# Database
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Application
NEXT_PUBLIC_SUPABASE_URL=https://your-railway-url
SUPABASE_URL=https://your-railway-url
```

### Local Environment Variables

```bash
# For local development
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🧪 Testing Your Deployment

1. **Connection Test**: http://localhost:3000/test-connection
2. **API Test**: http://localhost:3000/api/test-connection
3. **Setup Verification**: `node scripts/verify-setup.js`

## 📋 Available Scripts

```bash
# Railway deployment
npm run railway:deploy

# Load remote users
npm run supabase:load-users

# Local Supabase
npm run supabase:start
npm run supabase:stop
npm run supabase:status

# Docker
docker-compose up -d
docker-compose down
```

## 🔗 Useful Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Railway Project**: https://railway.app/project/81e74dcc-dce7-4d33-8e8b-487e100216ee
- **Supabase Docs**: https://supabase.com/docs
- **GoTrue Auth**: https://supabase.com/docs/guides/auth

## 🎯 Next Steps

1. Deploy to Railway using `npm run railway:deploy`
2. Update environment variables with Railway URLs
3. Load users with `npm run supabase:load-users`
4. Test the application with `npm run dev`
5. Access Supabase Studio via Railway dashboard

Your Supabase infrastructure is now ready for both local development and production deployment! 🚀
