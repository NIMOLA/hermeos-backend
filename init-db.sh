#!/bin/bash
echo "Running Prisma Migrations..."
docker exec hermeos-proptech-backend-1 npx prisma migrate deploy
echo "Seeding Database..."
docker exec hermeos-proptech-backend-1 npx prisma db seed
echo "Database initialization complete. You can now log in as admin@hermeos.com."
