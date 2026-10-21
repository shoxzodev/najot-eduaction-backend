# ==========================================
# 1. Build Stage
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install system libraries needed by Prisma and native modules on Alpine
RUN apk add --no-cache openssl libc6-compat

# Copy dependency specifications and Prisma schema first for layer caching
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies required for compilation)
RUN npm install --legacy-peer-deps

# Generate Prisma Client
RUN npx prisma generate

# Copy project source files
COPY . .

# Build NestJS application
RUN npm run build

# ==========================================
# 2. Production Stage
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

# Install runtime system libraries needed by Prisma
RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production

# Copy package definitions and node_modules from builder
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/templates ./src/templates

# Create upload directory for static assets
RUN mkdir -p /app/src/uploads

# Expose port (default 4400)
EXPOSE 4400

# Run database migrations and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && (if [ -f dist/src/main.js ]; then node dist/src/main.js; else node dist/main.js; fi)"]