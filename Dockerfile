# ==========================================
# 1. Build Stage
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install system libraries needed by Prisma and native modules on Alpine
RUN apk add --no-cache openssl libc6-compat

# Copy dependency specifications, prisma config and schema first for layer caching
COPY package*.json prisma.config.ts* ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies needed for build)
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

# Copy built app and required files
COPY package*.json ./
COPY --from=builder /app/prisma.config.ts* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/templates ./src/templates
COPY --from=builder /app/src/uploads ./src/uploads

# Create upload directories for images and video files
RUN mkdir -p /app/src/uploads/files

# Expose application port
EXPOSE 4400

# Run database migrations and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && (if [ -f dist/src/main.js ]; then node dist/src/main.js; else node dist/main.js; fi)"]
