#!/bin/bash

# Stop on string error
set -e

echo "🚀 Starting Deployment..."

# 1. Backend Deployment
echo "📦 Deploying Backend..."
cd backend
npm install
# CRITICIAL: Update DB Schema
echo "⚠️  Migrating Database..."
npx prisma generate
npx prisma db push --accept-data-loss
# Build
npm run build
# Restart PM2
echo "🔄 Restarting Backend Process..."
pm2 restart hermeos-backend || pm2 start dist/server.js --name hermeos-backend --env production.env
cd ..

# 2. Frontend Deployment
echo "🎨 Deploying Frontend..."
cd frontend
npm install
npm run build
cd ..

# 3. Nginx Verification (Optional, if you need to restart)
# sudo systemctl reload nginx

echo "✅ Deployment Complete! Backend is running on PM2 and Frontend build is in frontend/dist."
