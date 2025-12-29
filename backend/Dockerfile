# Base image
FROM node:20-alpine AS builder

# Install dependencies for Prisma
RUN apk add --no-cache openssl libc6-compat

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Copy app source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app (if using TS)
RUN npm run build

# Production stage
WORKDIR /app

# Install dependencies for Prisma
RUN apk add --no-cache openssl libc6-compat

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env.example ./.env

EXPOSE 5000

CMD ["npm", "start"]
