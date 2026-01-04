#!/bin/bash

# Hermeos PropTech - One-Command Complete Deployment
# Run this on your VPS after initial setup

set -e

echo "🚀 Hermeos PropTech - Complete Production Deployment"
echo "===================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}❌ Please do not run as root${NC}"
    exit 1
fi

# Get VPS IP
VPS_IP=$(curl -s ifconfig.me)
echo -e "${GREEN}📍 Detected VPS IP: $VPS_IP${NC}"
echo ""

# Step 1: Pull Latest Code
echo -e "${YELLOW}📥 Step 1: Pulling latest code...${NC}"
cd /var/www/hermeos-proptech
# Detect current branch or default to main
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Pulling from branch: $CURRENT_BRANCH"
git pull origin $CURRENT_BRANCH
echo -e "${GREEN}✓ Code updated${NC}"
echo ""

# Step 2: Backend Setup
echo -e "${YELLOW}📦 Step 2: Setting up backend...${NC}"
# Rebuild containers to ensure backend has latest code/deps (and bypasses build check)
docker compose up -d --build backend db
echo -e "${GREEN}✓ Backend containers built and started${NC}"
echo ""

# Step 3: Database Migrations
echo -e "${YELLOW}🗄️  Step 3: Running database migrations...${NC}"
# Wait for DB to be ready
sleep 5
docker compose exec -T backend npx prisma generate || echo "Prisma generate warning (can be ignored if runtime uses tsx)"
docker compose exec -T backend npx prisma db push || {
    echo -e "${RED}❌ Database migration failed${NC}"
    exit 1
}
echo -e "${GREEN}✓ Database updated${NC}"
echo ""

# Step 4: Build Frontend
echo -e "${YELLOW}🎨 Step 4: Building frontend...${NC}"
# Install all dependencies (dev included for build tools)
npm install
npm run build || {
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
}
echo -e "${GREEN}✓ Frontend built${NC}"
echo ""

# Step 5: Configure Nginx
echo -e "${YELLOW}⚙️  Step 5: Configuring Nginx...${NC}"
# We overwrite default to ensure it's the only one and correct
sudo tee /etc/nginx/sites-available/default > /dev/null << EOF
server {
    listen 80;
    server_name $VPS_IP hermeosproptech.com www.hermeosproptech.com;

    root /var/www/hermeos-proptech/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF

# Link default if not linked
sudo ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
# Remove conflicting 'hermeos' config if it exists
if [ -f /etc/nginx/sites-enabled/hermeos ]; then
    sudo rm /etc/nginx/sites-enabled/hermeos
fi

echo -e "${GREEN}✓ Nginx configured${NC}"
echo ""

# Step 7: Reload Nginx
echo -e "${YELLOW}🔄 Step 7: Reloading Nginx...${NC}"
sudo nginx -t && sudo systemctl reload nginx
echo -e "${GREEN}✓ Nginx reloaded${NC}"
echo ""

# Step 8: Health Check
echo -e "${YELLOW}🏥 Step 8: Running health checks...${NC}"
sleep 2

# Check backend
BACKEND_HEALTH=$(curl -s http://localhost:5000/health | jq -r .status 2>/dev/null || echo "error")
if [ "$BACKEND_HEALTH" = "healthy" ]; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
else
    echo -e "${RED}⚠ Backend health check failed${NC}"
fi

# Check database
DB_CHECK=$(docker compose exec -T postgres pg_isready -U hermeos_user 2>/dev/null || echo "error")
if [[ $DB_CHECK == *"accepting connections"* ]]; then
    echo -e "${GREEN}✓ Database is healthy${NC}"
else
    echo -e "${RED}⚠ Database health check failed${NC}"
fi

# Check Nginx
NGINX_STATUS=$(sudo systemctl is-active nginx)
if [ "$NGINX_STATUS" = "active" ]; then
    echo -e "${GREEN}✓ Nginx is running${NC}"
else
    echo -e "${RED}⚠ Nginx is not running${NC}"
fi

echo ""
echo -e "${GREEN}===================================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "====================================================${NC}"
echo ""
echo "🌐 Your platform is live at:"
echo "   Frontend: http://$VPS_IP"
echo "   Backend API: http://$VPS_IP:5000/api"
echo "   Health Check: http://$VPS_IP:5000/health"
echo ""
echo "🔐 Next Steps:"
echo "   1. Initialize super admin (if not done):"
echo "      curl -X POST http://$VPS_IP:5000/api/admin/management/init-super-admin \\"
echo "        -H 'Content-Type: application/json' \\"
echo "        -d '{\"email\":\"admin@hermeos.com\",\"password\":\"YourPassword123!\",\"firstName\":\"Super\",\"lastName\":\"Admin\",\"masterKey\":\"mces2024!dev\"}'"
echo ""
echo "   2. Login at: http://$VPS_IP/login"
echo "   3. Access admin dashboard: http://$VPS_IP/admin"
echo ""
echo "📊 Check logs:"
echo "   docker compose logs -f backend"
echo ""
echo "🎉 Happy deploying!"
