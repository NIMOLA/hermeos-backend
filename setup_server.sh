#!/bin/bash
# Run this ONCE to setup the server tools

echo "🛠️  Installing System Prerequisites..."

# 1. Install PM2 globally
npm install -g pm2 typescript ts-node prisma

# 2. Check directory
if [ ! -d "backend" ]; then
    echo "❌ Error: 'backend' directory not found!"
    echo "👉 Please 'cd' into your project folder first."
    echo "   Example: cd hermeos-proptech"
    exit 1
fi

echo "✅ Prerequisites installed. Now run './deploy.sh' or the deployment commands."
