#!/bin/bash

# Hermeos PropTech - Local Build & Deploy Script
# Usage: ./local-deploy.sh [VPS_IP] [VPS_USER]

set -e

# Default Configuration
VPS_USER="root"
# Try to load VPS_IP from args or .env
VPS_IP="$1"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Starting Local Deployment Workflow${NC}"
echo "========================================"

# 1. Local Build Verification
echo -e "\n${YELLOW}🏗️  Step 1: Verifying Local Builds...${NC}"

echo ">> Building Backend..."
cd backend
if npm run build; then
    echo -e "${GREEN}✓ Backend build passed${NC}"
else
    echo -e "${RED}❌ Backend build failed. Aborting deployment.${NC}"
    exit 1
fi
cd ..

echo ">> Building Frontend..."
cd frontend
if npm run build; then
    echo -e "${GREEN}✓ Frontend build passed${NC}"
else
    echo -e "${RED}❌ Frontend build failed. Aborting deployment.${NC}"
    exit 1
fi
cd ..

# 2. Git Operations
echo -e "\n${YELLOW}📦 Step 2: Syncing with Git...${NC}"
git status
echo ""
read -p "Do you want to commit and push these changes? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter commit message: " COMMIT_MSG
    git add .
    git commit -m "$COMMIT_MSG"
    git push origin main
    echo -e "${GREEN}✓ Changes pushed to remote${NC}"
else
    echo -e "${YELLOW}⚠ Skipping git push. Ensure remote is up to date manually.${NC}"
fi

# 3. VPS Deployment
echo -e "\n${YELLOW}🚀 Step 3: Triggering Remote Deployment...${NC}"

if [ -z "$VPS_IP" ]; then
    read -p "Enter VPS IP Address: " VPS_IP
fi

if [ -z "$VPS_IP" ]; then
    echo -e "${RED}❌ No VPS IP provided. Deployment skipped.${NC}"
    exit 1
fi

echo "Connecting to $VPS_USER@$VPS_IP..."
echo "This will run 'deploy-complete.sh' on the server."

# SSH Command to run the deployment script
# We assume deploy-complete.sh is already at /var/www/hermeos-proptech/deploy-complete.sh
# If not, we can copy it over first
scp deploy-complete.sh $VPS_USER@$VPS_IP:/var/www/hermeos-proptech/deploy-complete.sh

ssh $VPS_USER@$VPS_IP "chmod +x /var/www/hermeos-proptech/deploy-complete.sh && /var/www/hermeos-proptech/deploy-complete.sh"

echo -e "\n${GREEN}✅ Deployment Workflow Complete!${NC}"
