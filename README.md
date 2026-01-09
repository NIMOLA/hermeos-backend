# Hermeos PropTech Platform

Hermeos is a fractional real estate investment platform built with React (Frontend) and Express/Prisma (Backend).

## Project Structure

- `frontend/` - React + Vite + Tailwind CSS
- `backend/` - Node.js + Express + PostgreSQL (Prisma)
- `docker-compose.yml` - Orchestration for production

## Deployment Guide (VPS)

### Prerequisites

- Docker & Docker Compose installed
- Git installed
- Root or sudo access

### Step-by-Step Deployment

1. **Clone/Pull the Repository**

   ```bash
   cd /var/www/hermeos-proptech
   git pull origin main
   ```

2. **Run the Deployment Script**
   The `deploy-complete.sh` script handles Dependencies, Migrations, and Resets.

   **Important:** You must make the script executable first.

   ```bash
   chmod +x deploy-complete.sh
   ./deploy-complete.sh
   ```

### Manual Commands

If you prefer running commands manually:

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm install --production

# Database
docker compose exec backend npx prisma db push
```

## Environment Variables

Ensure you have a `.env` file in the root and `backend/` directories with:

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
