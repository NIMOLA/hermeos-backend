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

# Check if running as root (Warning only)
if [ "$EUID" -eq 0 ]; then 
    echo -e "${YELLOW}⚠ Running as root. Ensure you know what you are doing.${NC}"
fi

# Get VPS IP
VPS_IP=$(curl -s ifconfig.me)
echo -e "${GREEN}📍 Detected VPS IP: $VPS_IP${NC}"
echo ""

# Step 1: Pull Latest Code
echo -e "${YELLOW}📥 Step 1: Pulling latest code...${NC}"
cd /var/www/hermeos-proptech
git pull origin main
echo -e "${GREEN}✓ Code updated${NC}"
echo ""

# Step 2: Backend Setup
echo -e "${YELLOW}📦 Step 2: Setting up backend...${NC}"
cd backend
npm install --production
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
echo ""

# Step 3: Build and Start Backend (To ensure container is running for migrations)
echo -e "${YELLOW}🚀 Step 3: Building and Starting Backend...${NC}"
cd ..
docker compose up -d --build backend
echo -e "${GREEN}✓ Backend started${NC}"
echo ""

# Step 4: Database Migrations
echo -e "${YELLOW}🗄️  Step 4: Running database migrations...${NC}"
# Wait for backend to be ready
echo "Waiting for backend to initialize..."
sleep 10

docker compose exec -T backend sh -c "npx prisma generate" || {
    echo -e "${RED}❌ Prisma generate failed${NC}"
    exit 1
}
docker compose exec -T backend sh -c "npx prisma db push" || {
    echo -e "${RED}❌ Database migration failed${NC}"
    exit 1
}
echo -e "${YELLOW}🌱 Seeding database (wiping existing data)...${NC}"
docker compose exec -T backend sh -c "npx tsx scripts/seed_init.ts" || {
    echo -e "${RED}❌ Database seeding failed${NC}"
    exit 1
}
echo -e "${GREEN}✓ Database updated and seeded${NC}"
echo ""

# Step 5: Restart Backend (Optional, but ensures clean state)
echo -e "${YELLOW}🔄 Step 5: Ensuring Backend is fresh...${NC}"
docker compose restart backend
sleep 3
echo -e "${GREEN}✓ Backend ready${NC}"
echo ""

# Step 5: Build Frontend
echo -e "${YELLOW}🎨 Step 5: Building frontend...${NC}"
cd frontend
npm install

# Auto-generate .env for frontend
echo -e "${YELLOW}📝 Generating frontend .env from root .env...${NC}"
if [ -f ../.env ]; then
    grep "^VITE_" ../.env > .env
    echo -e "${GREEN}✓ Frontend .env generated with VITE_ variables${NC}"
else
    echo -e "${RED}⚠ Root .env not found. Frontend build may fail or show blank page.${NC}"
fi

npm run build
echo -e "${GREEN}✓ Frontend built${NC}"
echo ""

# Step 6: Configure Nginx (if needed)
if [ ! -f /etc/nginx/sites-available/hermeos ]; then
    echo -e "${YELLOW}⚙️  Step 6: Configuring Nginx...${NC}"
    sudo tee /etc/nginx/sites-available/hermeos > /dev/null << EOF
server {
    listen 80;
    server_name $VPS_IP;

    location / {
        root /var/www/hermeos-proptech/frontend/dist;
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
    sudo ln -sf /etc/nginx/sites-available/hermeos /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    echo -e "${GREEN}✓ Nginx configured${NC}"
else
    echo -e "${GREEN}✓ Nginx already configured${NC}"
fi
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
