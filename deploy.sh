#!/bin/bash

# Pull latest changes
git pull origin main

# Rebuild and start containers
docker-compose up -d --build

# Wait for database to be ready (rudimentary check or rely on restart policy)
sleep 10

# Push schema and seed (Backend container command handles this, but for manual override:)
# docker-compose exec backend npx prisma db push
# docker-compose exec backend npx prisma db seed

echo "Deployment complete."
