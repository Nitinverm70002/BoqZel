#!/usr/bin/env bash
# exit on error
set -o errexit

echo "📦 Installing dependencies..."
npm install

echo "💎 Generating Prisma Client..."
# Explicitly pointing to the backend schema
npx prisma generate --schema=backend/prisma/schema.prisma

echo "🏗 Building backend..."
# Building only the backend workspace
npm run build -w backend

echo "✅ Build complete!"
