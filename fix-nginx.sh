#!/bin/bash
# fix-nginx.sh
# Safely updates Nginx config to serve static files while preserving SSL

# Backup existing config
cp /etc/nginx/sites-available/hermeos /etc/nginx/sites-available/hermeos.bak

# New config content (SSL parts will be injected by user or preserved manually, 
# strictly speaking we should use sed, but since user cat'd the file, we can reconstruct it.)

# Wait, reconstructing via echo is safer if we just replace the "location /" block.
# The user has Certbot lines at the bottom.

# Plan: Use sed to replace the location / block.

# 1. Replace proxy_pass with root and try_files
sed -i '/location \/ {/,/}/c\    location / {\n        root /var/www/hermeos-proptech/frontend/dist;\n        try_files $uri $uri/ /index.html;\n        add_header Cache-Control "no-cache";\n    }' /etc/nginx/sites-available/hermeos

# 2. Check and reload
nginx -t && systemctl reload nginx

echo "Nginx updated to serve static files."
