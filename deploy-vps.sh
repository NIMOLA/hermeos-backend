#!/bin/bash

# Hermeos PropTech - Complete Deployment Script for VPS
# This script deploys the entire application with database migrations

set -e  # Exit on any error

echo "🚀 Starting Hermeos PropTech Deployment..."

# Navigate to directory (optional if run from root)
# cd /var/www/hermeos-backend

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Rebuild and Start Containers (Updates dependencies & code)
echo "🔄 Rebuilding and Starting services..."
docker compose up -d --build

# Run Migrations (Safe to run multiple times)
echo "🗄️  Running database migrations..."
docker compose exec -T backend npx prisma db push

echo "✅ Deployment complete!"
echo ""
echo "🔐 Super Admin Setup:"
echo "   Master Key: mces2024!dev"
echo "   Initialize: POST /api/admin/management/init-super-admin"
echo ""
echo "📊 Dashboard APIs:"
echo "   Stats: GET /api/admin/dashboard/stats"
echo "   Activity: GET /api/admin/dashboard/activity"
echo "   Users: GET /api/admin/dashboard/users"
echo ""
echo "🌐 Access your application at:"
echo "   Frontend: http://$(curl -s ifconfig.me):5173"
echo "   Backend: http://$(curl -s ifconfig.me):5000"
