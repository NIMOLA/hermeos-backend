#!/bin/bash

# Hermeos PropTech - VPS "TOTAL WIPE" & Reset Script
# WARNING: This will DELETE ALL DATA, database volumes, and the project folder.
# It attempts to preserve .env only to prevent locking you out, but treats everything else as disposable.

DIR="/var/www/hermeos-proptech"
BACKUP="/tmp/hermeos_env_backup_$(date +%s)"
REPO="https://github.com/NIMOLA/hermeos-backend.git"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${RED}💣 NUCLEAR OPTION: TOTAL WIPE & RESET${NC}"
echo -e "${RED}----------------------------------------${NC}"
echo "1. All Containers will be stopped and removed."
echo "2. All Database Volumes (DATA) will be DELETED irrecoverably."
echo "3. The project directory $DIR will be removed."
echo "4. Code will be re-cloned from $REPO."
echo ""
echo -e "${YELLOW}ℹ️  Note: We will temporarily backup your .env to $BACKUP so you don't lose secrets.${NC}"
echo "   If you want to start with a fresh .env, delete it manually after the script finishes."
echo ""
read -p "Are you ABSOLUTELY sure? (Type 'yes' to confirm): " CONFIRM
echo ""
if [ "$CONFIRM" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo -e "\n${YELLOW}Step 1: Backing up .env (Safety Net)...${NC}"
if [ -f "$DIR/.env" ]; then
    cp "$DIR/.env" "$BACKUP"
    echo -e "${GREEN}✓ .env saved to $BACKUP${NC}"
else
    echo -e "${YELLOW}⚠ No .env file found. Proceeding without backup.${NC}"
fi

echo -e "\n${YELLOW}Step 2: Destroying Everything...${NC}"
if [ -d "$DIR" ]; then
    cd "$DIR"
    # -v removes named volumes defined in the `volumes` section of the Compose file
    # This wipes the database data.
    docker compose down -v --remove-orphans
    echo -e "${GREEN}✓ Containers and Volumes removed${NC}"
    
    cd ..
    # Remove directory
    sudo rm -rf "$DIR"
    echo -e "${GREEN}✓ Deleted project directory${NC}"
else
    echo "Directory $DIR did not exist. Proceeding..."
fi

echo -e "\n${YELLOW}Step 3: Cloning Fresh Code (NIMOLA)...${NC}"
sudo git clone "$REPO" "$DIR"
sudo chown -R $USER:$USER "$DIR"
echo -e "${GREEN}✓ Code cloned from $REPO${NC}"

echo -e "\n${YELLOW}Step 4: Restoring Configuration...${NC}"
if [ -f "$BACKUP" ]; then
    cp "$BACKUP" "$DIR/.env"
    echo -e "${GREEN}✓ .env restored${NC}"
else
    echo -e "${RED}❌ No .env to restore. You must create one manually before deploying!${NC}"
    echo "Touching empty .env..."
    touch "$DIR/.env"
fi

echo -e "\n${YELLOW}Step 5: Full Deployment...${NC}"
cd "$DIR"
chmod +x deploy-complete.sh
./deploy-complete.sh

echo -e "\n${GREEN}✅ Total Wipe & Rebuild Complete!${NC}"
