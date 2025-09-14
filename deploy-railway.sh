#!/bin/bash

# Railway Deployment Script for COM-PSU-Rizal
# This script helps deploy the project to Railway

set -e

echo "🚂 Starting Railway deployment for COM-PSU-Rizal..."

# Configuration
RAILWAY_DOMAIN="com-psu-rizal-production.up.railway.app"
APP_PORT="3001"

# Check if Railway CLI is installed
if ! command -v railway &>/dev/null; then
    echo "❌ Railway CLI is not installed. Please install it first:"
    echo "npm install -g @railway/cli"
    exit 1
fi

# Check if user is logged in
if ! railway whoami &>/dev/null; then
    echo "❌ You are not logged in to Railway. Please login first:"
    echo "railway login"
    exit 1
fi

# Link project if not already linked
if [ ! -f ".railway/project.json" ]; then
    echo "🔗 Linking project to Railway..."
    railway link
fi

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway deploy

echo "✅ Deployment initiated successfully!"
echo "📊 Check your Railway dashboard for deployment status:"
echo "https://railway.app/dashboard"
echo ""
echo "🌐 Your app will be available at:"
echo "https://$RAILWAY_DOMAIN"
echo "📝 Port: $APP_PORT"

# Optional: Open logs
read -p "Would you like to view the deployment logs? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    railway logs
fi
