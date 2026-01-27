#!/bin/bash
# Script to update Nginx configuration on VPS for multi-domain support

set -e  # Exit on any error

echo "🔧 Updating Nginx Configuration for Multi-Domain Support..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run with sudo${NC}"
    exit 1
fi

# Backup current Nginx configuration
echo -e "${YELLOW}📦 Backing up current Nginx configuration...${NC}"
BACKUP_DIR="/etc/nginx/backups"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cp /etc/nginx/sites-available/hermeos $BACKUP_DIR/hermeos_$TIMESTAMP.bak 2>/dev/null || echo "No existing config to backup"

# Copy new configuration
echo -e "${YELLOW}📝 Copying new Nginx configuration...${NC}"
cp nginx_reverse_proxy.conf /etc/nginx/sites-available/hermeos

# Enable site if not already enabled
if [ ! -L /etc/nginx/sites-enabled/hermeos ]; then
    echo -e "${YELLOW}🔗 Enabling site...${NC}"
    ln -s /etc/nginx/sites-available/hermeos /etc/nginx/sites-enabled/
fi

# Test Nginx configuration
echo -e "${YELLOW}🧪 Testing Nginx configuration...${NC}"
if nginx -t; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
else
    echo -e "${RED}❌ Nginx configuration test failed!${NC}"
    echo -e "${YELLOW}Restoring backup...${NC}"
    cp $BACKUP_DIR/hermeos_$TIMESTAMP.bak /etc/nginx/sites-available/hermeos 2>/dev/null || true
    exit 1
fi

# Reload Nginx
echo -e "${YELLOW}🔄 Reloading Nginx...${NC}"
systemctl reload nginx

# Check Nginx status
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx is running successfully${NC}"
else
    echo -e "${RED}❌ Nginx failed to start!${NC}"
    systemctl status nginx
    exit 1
fi

# Verify SSL certificates exist
echo -e "${YELLOW}🔐 Verifying SSL certificates...${NC}"
DOMAINS=("hermeosproptech.com" "hermeos.com" "admin.hermeosproptech.com")
ALL_CERTS_OK=true

for domain in "${DOMAINS[@]}"; do
    if [ -f "/etc/letsencrypt/live/$domain/fullchain.pem" ]; then
        echo -e "${GREEN}✅ SSL certificate found for $domain${NC}"
    else
        echo -e "${RED}❌ SSL certificate NOT found for $domain${NC}"
        ALL_CERTS_OK=false
    fi
done

if [ "$ALL_CERTS_OK" = false ]; then
    echo -e "${YELLOW}⚠️  Some SSL certificates are missing. You may need to obtain them using:${NC}"
    echo -e "${YELLOW}   sudo certbot --nginx -d domain.com${NC}"
fi

echo ""
echo -e "${GREEN}✅ Nginx configuration updated successfully!${NC}"
echo ""
echo "📋 Next steps:"
echo "  1. Test each domain in your browser:"
echo "     - https://hermeosproptech.com"
echo "     - https://hermeos.com"
echo "     - https://admin.hermeosproptech.com"
echo ""
echo "  2. Monitor Nginx logs for any issues:"
echo "     sudo tail -f /var/log/nginx/error.log"
echo ""
echo "  3. Check CORS is working by testing API requests from each domain"
echo ""
