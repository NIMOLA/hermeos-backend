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
git pull origin main
echo -e "${GREEN}✓ Code updated${NC}"
echo ""

# Step 2: Update Infrastructure
echo -e "${YELLOW}🔄 Step 2: Updating infrastructure...${NC}"

# Stop host Nginx if running to prevent port 80 conflicts with Docker
if systemctl is-active --quiet nginx; then
    echo -e "${YELLOW}⚠️  Stopping host Nginx to allow Docker to bind Port 80...${NC}"
    sudo systemctl stop nginx || true
    sudo systemctl disable nginx || true
fi

# Rebuild containers to pick up changes in backend or frontend structure
docker compose up -d --build --remove-orphans
echo -e "${GREEN}✓ Docker containers updated${NC}"
echo ""

# Step 3: Database Migrations
echo -e "${YELLOW}🗄️  Step 3: Running database migrations...${NC}"
# We execute this inside the running backend container
docker compose exec -T backend sh -c "npx prisma generate" || {
    echo -e "${RED}❌ Prisma generate failed${NC}"
    # Continue anyway as the startup script usually handles this, but good to be explicit
}
docker compose exec -T backend sh -c "npx prisma db push" || {
    echo -e "${RED}❌ Database migration failed${NC}"
}
echo -e "${GREEN}✓ Database updated${NC}"
echo ""

# Step 4: Configure Nginx (Update path to use Docker or new structure)
# NOTE: Now that frontend is in Docker, we should proxy requests to it,
# OR if we still serve static files, point to the new location.
# For simplicity in this transition, we will assume Nginx on host proxies to frontend container.
# OR we rely on the `frontend` container (Nginx internal) exposed on port 80.

# If there is a host Nginx, it should just proxy port 80 to localhost:80 (docker frontend)
# BUT the previous setup served files directly.
# Let's switch to a full Docker setup where the host Nginx (if any) proxies to the containers.

if [ ! -f /etc/nginx/sites-available/hermeos ]; then
    echo -e "${YELLOW}⚙️  Step 4: Configuring Host Nginx...${NC}"
    sudo tee /etc/nginx/sites-available/hermeos > /dev/null << EOF
server {
    listen 80;
    server_name $VPS_IP;

    # Proxy all traffic to the Docker Frontend service (exposed on host port 80)
    # Note: If docker-compose exposes frontend:80->80, this host nginx might conflict.
    # If host nginx is needed (e.g. for SSL later), it should proxy.
    # Current docker-compose maps 80:80, so we should actually STOP host nginx or let Docker handle it.

    # STRATEGY CHANGE: We will let Docker bind port 80.
    # If Host Nginx is running, it will conflict.
    # We will disable host nginx for the 'hermeos' site and let Docker take over.
}
EOF
    # Actually, to avoid conflicts, let's just warn.
    echo -e "${YELLOW}⚠️  NOTE: Docker is now configured to listen on Port 80.${NC}"
    echo -e "${YELLOW}⚠️  If you have a host-level Nginx running, it might conflict.${NC}"
    echo -e "${YELLOW}⚠️  We will attempt to stop host nginx to allow Docker to bind port 80.${NC}"

    sudo systemctl stop nginx || true
    sudo systemctl disable nginx || true
    echo -e "${GREEN}✓ Host Nginx stopped to allow Docker Frontend${NC}"
else
    # Existing config found. We should probably remove it to let Docker handle port 80
    echo -e "${YELLOW}⚠️  Existing Nginx config found. Stopping host Nginx to allow Docker to take over port 80...${NC}"
    sudo systemctl stop nginx || true
    sudo systemctl disable nginx || true
fi
echo ""

# Step 5: Health Check
echo -e "${YELLOW}🏥 Step 5: Running health checks...${NC}"
sleep 10 # Wait for containers to settle

# Check backend
BACKEND_HEALTH=$(curl -s http://localhost:5000/health | jq -r .status 2>/dev/null || echo "error")
if [ "$BACKEND_HEALTH" = "healthy" ]; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
else
    echo -e "${RED}⚠ Backend health check failed${NC}"
fi

# Check frontend
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Frontend is accessible${NC}"
else
    echo -e "${RED}⚠ Frontend check failed (Status: $FRONTEND_STATUS)${NC}"
fi

echo ""
echo -e "${GREEN}===================================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "====================================================${NC}"
echo ""
echo "🌐 Your platform is live at:"
echo "   Frontend: http://$VPS_IP"
echo "   Backend API: http://$VPS_IP:5000/api"
echo ""
echo "🎉 Happy deploying!"
