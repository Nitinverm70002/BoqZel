#!/usr/bin/env bash
# exit on error
set -o errexit

echo "📦 Installing dependencies..."
npm install

echo "💎 Generating Prisma Client..."
# In a monorepo, npx is the safest way to find the prisma binary
npx prisma generate --schema=backend/prisma/schema.prisma

echo "🏗 Building backend..."
# Building only the backend workspace
npm run build -w backend

echo "✅ Build complete!"
